// Main Game Controller for 《魔寵：幻境之旅》
import * as THREE from './three.module.js';
import { PetModelFactory } from './pet_models.js';
import { WorldManager } from './world.js';
import { BattleManager } from './battle.js';
import { UIManager } from './ui.js';
import { PET_SPECIES, MAP_ZONES, CONSUMABLES, EGG_TYPES, ELEMENTS, COOKING_RECIPES, FURNITURE_ITEMS, FISH_TYPES } from './pets_data.js';
import { CHARACTERS, MAIN_QUESTS } from './character_data.js';
import { sound } from './audio.js';

class PetAdventureGame {
  constructor() {
    this.playerLevel = 1;
    this.coins = 120;
    this.inventory = {
      berry: 8,
      apple: 4,
      orange: 4,
      candy: 3,
      donut: 1,
      fire_stone: 2,
      ice_stone: 1,
      nature_stone: 2,
      shadow_stone: 1,
      thunder_stone: 2,
      light_stone: 2,
      water_stone: 2,
      egg_fire: 1,
      egg_ice: 1,
      egg_nature: 1,
      egg_thunder: 1,
      egg_light: 1,
      egg_water: 1
    };

    // Character identity & Customization (星月, 夜影, 晨曦)
    this.characterId = 'xingyue';
    const initialChar = CHARACTERS[this.characterId];
    this.playerName = initialChar.name;
    this.customConfig = { ...initialChar.defaultCustom, name: initialChar.name };
    this.currentQuestIndex = 0;

    // Pet instance class
    this.pets = [];
    this.activePetIndex = 0;
    this.discoveredPets = new Set(['fire_1', 'ice_1', 'nature_1', 'shadow_1', 'thunder_1', 'light_1', 'water_1']);

    this.initDefaultPets();
    this.initThree();
    this.initWeatherVisuals();
    this.initPlayer();
    this.initFollowerPet();

    this.world = new WorldManager(this.scene);
    this.battle = new BattleManager(this);
    this.ui = new UIManager(this);

    this.world.loadZone('home'); // 預設降落在美麗的「溫馨小家」果園小屋外！
    this.ui.updateHUD();

    this.bindControls();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Initial prompt: Character Selection Gate
    setTimeout(() => {
      sound.playVictory();
      this.ui.showToast('🌟 歡迎來到《魔寵：幻境之旅》！認同您的所有魔寵夥伴將全員無上限一同跟隨冒險！', 5500);
      this.ui.openCharSelectModal();
    }, 600);
  }

  initDefaultPets() {
    // 預設先配置 1 隻最初夥伴（選完角色與序章後，將正式開啟《初始魔寵契約儀式》在六大夥伴中自由選擇！）
    this.pets = [
      this.createPetInstance('fire_1', 1, '小火狐')
    ];
  }

  selectStarterPet(speciesId, customName = null) {
    const spec = PET_SPECIES[speciesId];
    const name = customName || spec?.name || '最初夥伴';
    this.pets = [
      this.createPetInstance(speciesId, 1, name)
    ];
    this.activePetIndex = 0;
    this.discoveredPets.add(speciesId);
    this.rebuildFollowerPets();
    this.ui?.updateHUD();
    sound.playVictory();
    this.ui?.showToast(`✨ 初始契約締結成功！【${name}】已成為你的最初同行夥伴！`, 5000);
  }

  recruitCompanionPet(speciesId, customName = null) {
    const pet = this.addNewPet(speciesId);
    if (customName) pet.customName = customName;
    sound.playVictory();
    this.ui?.showToast(`🎉 成功締結新夥伴契約！【${pet.customName}】加入跟隨隊伍（🐾 全員無上限跟隨中: ${this.pets.length}隻）！`, 5000);
    return pet;
  }

  createPetInstance(speciesId, level = 1, customName = null) {
    const spec = PET_SPECIES[speciesId];
    this.discoveredPets.add(speciesId);

    return {
      uid: 'pet_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      speciesId: speciesId,
      customName: customName || spec?.name || '神祕魔寵',
      level: level,
      exp: 0,
      satiety: 85,
      affection: 50,
      maxHp: (spec ? spec.baseHp : 180) + (level - 1) * 22,
      currentHp: (spec ? spec.baseHp : 180) + (level - 1) * 22,
      atk: (spec ? spec.baseAtk : 40) + (level - 1) * 6,
      def: (spec ? spec.baseDef : 25) + (level - 1) * 4,
      spd: (spec ? spec.baseSpd : 30) + (level - 1) * 3,

      gainExp(amt) {
        this.exp += amt;
        let leveled = false;
        while (this.exp >= this.level * 60) {
          const nextLevelExp = this.level * 60;
          this.level++;
          this.exp -= nextLevelExp;
          this.maxHp += 22;
          this.currentHp = this.maxHp;
          this.atk += 6;
          this.def += 4;
          this.spd += 3;
          leveled = true;
        }
        if (leveled) {
          sound.playVictory();
        }
        return leveled;
      },

      evolveTo(nextSpeciesId) {
        this.speciesId = nextSpeciesId;
        const nSpec = PET_SPECIES[nextSpeciesId];
        if (nSpec) {
          this.customName = nSpec.name;
          this.maxHp += 80;
          this.currentHp = this.maxHp;
          this.atk += 25;
          this.def += 18;
          this.spd += 15;
        }
      }
    };
  }

  getActivePet() {
    return this.pets[this.activePetIndex] || this.pets[0];
  }

  addNewPet(speciesId) {
    const pet = this.createPetInstance(speciesId, 1);
    this.pets.push(pet);
    this.activePetIndex = this.pets.length - 1;
    this.rebuildFollowerPet();
    this.ui.updateHUD();
    return pet;
  }

  feedActivePet(food) {
    const pet = this.getActivePet();
    if (!pet || (this.inventory[food.id] || 0) <= 0) return;

    this.inventory[food.id]--;
    pet.satiety = Math.min(100, pet.satiety + (food.satiety || 20));
    pet.affection = Math.min(100, pet.affection + (food.affection || 10));
    const healHp = Math.round(pet.maxHp * 0.25);
    pet.currentHp = Math.min(pet.maxHp, pet.currentHp + healHp);
    const leveledUp = pet.gainExp(food.exp || 25);

    sound.playFeed();
    if (leveledUp) {
      sound.playVictory();
      this.ui.showToast(`🎉 升級啦！${pet.customName} 升到了 Lv.${pet.level}！戰力與生命值大幅提升！`);
      this.rebuildFollowerPets();
    } else {
      this.ui.showToast(`餵食了【${food.name}】，${pet.customName} 飽食度與經驗值大幅提升！✨`);
    }
    this.ui.updateHUD();
  }

  addItem(itemId, count = 1) {
    this.inventory[itemId] = (this.inventory[itemId] || 0) + count;
    this.ui.updateHUD();
  }

  // --- 1. Three.js Initialization ---
  initThree() {
    this.container = document.getElementById('canvas-container');
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
    this.camera.position.set(0, 5, 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.setClearColor(0xbae6fd, 1);
    this.scene.background = new THREE.Color(0xbae6fd);
    this.container.appendChild(this.renderer.domElement);

    // Lights
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.3);
    this.sunLight.position.set(25, 45, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.scene.add(this.sunLight);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // --- 🌧️ 1.2. 動態天氣視覺與粒子系統 (Dynamic Weather Visuals & Particles) ---
  initWeatherVisuals() {
    this.currentWeather = 'sunny';
    this.weatherTimer = 0;
    this.weatherDuration = 70; // 每 70 秒自動變換一次天氣

    // 1. 雨滴粒子特效
    const rainCount = 420;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPos[i] = (Math.random() - 0.5) * 85;
      rainPos[i + 1] = Math.random() * 28;
      rainPos[i + 2] = (Math.random() - 0.5) * 85;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.24,
      transparent: true,
      opacity: 0.78
    });
    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);

    // 2. 雨後彩虹 3D 神聖天際七彩光弧 (High Altitude Ethereal 7-Color Rainbow Arc)
    const rainbowCanvas = document.createElement('canvas');
    rainbowCanvas.width = 128;
    rainbowCanvas.height = 16;
    const rCtx = rainbowCanvas.getContext('2d');
    const grad = rCtx.createLinearGradient(0, 0, 0, 16);
    grad.addColorStop(0.0, 'rgba(239, 68, 68, 0.7)');   // Red
    grad.addColorStop(0.18, 'rgba(249, 115, 22, 0.65)'); // Orange
    grad.addColorStop(0.36, 'rgba(250, 204, 21, 0.65)'); // Yellow
    grad.addColorStop(0.54, 'rgba(34, 197, 94, 0.6)');  // Green
    grad.addColorStop(0.72, 'rgba(6, 182, 212, 0.65)');  // Cyan/Blue
    grad.addColorStop(0.90, 'rgba(99, 102, 241, 0.65)'); // Indigo
    grad.addColorStop(1.0, 'rgba(168, 85, 247, 0.7)');  // Violet
    rCtx.fillStyle = grad;
    rCtx.fillRect(0, 0, 128, 16);

    const rainbowTex = new THREE.CanvasTexture(rainbowCanvas);
    const rainbowGeo = new THREE.RingGeometry(72, 80, 48, 1, 0, Math.PI);
    const rainbowMat = new THREE.MeshBasicMaterial({
      map: rainbowTex,
      transparent: true,
      opacity: 0.68,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.rainbowMesh = new THREE.Mesh(rainbowGeo, rainbowMat);
    // 高懸於正北方遠景天際線之上（y: 8, z: -105），跨越整個天地，絕不插在地面或穿透房屋山丘！
    this.rainbowMesh.position.set(0, 8, -105);
    this.rainbowMesh.visible = false;
    this.scene.add(this.rainbowMesh);
  }

  setWeather(newWeather) {
    this.currentWeather = newWeather;
    this.weatherTimer = 0;

    const zoneSky = this.world?.currentZoneData?.skyColor || 0xbae6fd;
    if (newWeather === 'rain') {
      if (this.scene.background) this.scene.background.setHex(0x64748b);
      sound.startRain();
      if (this.rainParticles) this.rainParticles.visible = true;
      if (this.rainbowMesh) this.rainbowMesh.visible = false;
      this.ui?.updateWeatherBadge('🌧️ 幻境細雨');
      this.ui?.showToast('🌧️ 天空飄起幻境細雨... 感受大自然的清新甘霖！', 3500);
    } else if (newWeather === 'thunder') {
      if (this.scene.background) this.scene.background.setHex(0x334155);
      sound.startRain();
      sound.playThunder();
      if (this.rainParticles) this.rainParticles.visible = true;
      if (this.rainbowMesh) this.rainbowMesh.visible = false;
      this.ui?.updateWeatherBadge('⚡ 驚雷陣雨');
      this.ui?.showScreenFlash('rgba(255, 255, 255, 0.75)');
      this.ui?.showToast('⚡ 天際轟鳴！驚雷雨落下，雷系魔寵精力大增！', 3500);
    } else if (newWeather === 'rainbow') {
      if (this.scene.background) this.scene.background.setHex(0xdbeafe);
      sound.stopRain();
      sound.playRainbow();
      if (this.rainParticles) this.rainParticles.visible = false;
      if (this.rainbowMesh) this.rainbowMesh.visible = true;
      this.ui?.updateWeatherBadge('🌈 晴空彩虹');
      this.ui?.showToast('🌈 奇蹟的七色彩虹現身！所有魔寵親密度大幅上升！', 4500);
      this.pets.forEach(p => p.affection = Math.min(100, p.affection + 15));
      this.ui?.updateHUD();
    } else if (newWeather === 'cloudy') {
      if (this.scene.background) this.scene.background.setHex(0x94a3b8);
      sound.stopRain();
      if (this.rainParticles) this.rainParticles.visible = false;
      if (this.rainbowMesh) this.rainbowMesh.visible = false;
      this.ui?.updateWeatherBadge('⛅ 悠閒微雲');
    } else {
      if (this.scene.background) this.scene.background.setHex(zoneSky);
      sound.stopRain();
      if (this.rainParticles) this.rainParticles.visible = false;
      if (this.rainbowMesh) this.rainbowMesh.visible = false;
      this.ui?.updateWeatherBadge('☀️ 晴朗艷陽');
    }
  }

  toggleWeatherNext() {
    const weathers = ['sunny', 'cloudy', 'rain', 'thunder', 'rainbow'];
    const idx = weathers.indexOf(this.currentWeather);
    const next = weathers[(idx + 1) % weathers.length];
    this.setWeather(next);
  }

  updateWeather(delta) {
    this.weatherTimer += delta;
    if (this.weatherTimer > this.weatherDuration) {
      this.toggleWeatherNext();
    }

    if (this.rainParticles && this.rainParticles.visible) {
      const positions = this.rainParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 24 * delta;
        if (positions[i] < 0) {
          positions[i] = 26 + Math.random() * 5;
        }
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  // 🔥 熔岩灼傷扣血檢查
  checkLavaDamage(delta) {
    if (this.world.checkLavaHazard(this.playerPos)) {
      this.lavaDamageTimer = (this.lavaDamageTimer || 0) + delta;
      if (this.lavaDamageTimer >= 1.1) {
        this.lavaDamageTimer = 0;
        sound.playLavaHurt();
        this.ui?.showScreenFlash('rgba(239, 68, 68, 0.45)');
        this.ui?.showToast('🔥 熾熱熔岩燙傷！快跳出熔岩！', 1600);
        const activePet = this.getActivePet();
        if (activePet) {
          activePet.currentHp = Math.max(1, activePet.currentHp - 25);
          this.ui?.updateHUD();
        }
      }
    } else {
      this.lavaDamageTimer = 0.8;
    }
  }

  // 🎣 碧波水澤揮竿釣魚系統
  startFishing() {
    if (this.isFishing) return;
    this.isFishing = true;
    sound.playFishingCast();
    this.ui?.showToast('🎣 揮竿拋線入水... 屏息等待靈魚咬鉤...', 3000);

    setTimeout(() => {
      sound.playFishBite();
      this.ui?.showToast('🐟 浮標劇烈下沉！靈魚咬鉤了！起竿！', 1600);

      setTimeout(() => {
        sound.playFishingCatch();
        this.isFishing = false;
        const fishList = [
          { id: 'fish_blue', name: '清泉水靈魚', icon: '🐟💧' },
          { id: 'fish_rainbow', name: '彩虹金鱗魚', icon: '🐟✨' },
          { id: 'fish_fire', name: '熾火飛魚', icon: '🐟🔥' }
        ];
        const caught = fishList[Math.floor(Math.random() * fishList.length)];
        this.addItem(caught.id, 1);
        this.ui?.showToast(`🎉 成功釣起【${caught.name}】！已收入冒險背包！`, 4500);
      }, 1000);
    }, 2200);
  }

  // 🍳 烹飪料理系統
  cookRecipe(recipe) {
    const canCook = recipe.ingredients.every(ing => (this.inventory[ing.id] || 0) >= ing.count);
    if (!canCook) {
      this.ui?.showToast(`❌ 食材不足！無法製作【${recipe.name}】`);
      return false;
    }

    recipe.ingredients.forEach(ing => {
      this.inventory[ing.id] -= ing.count;
    });

    sound.playCookingSizzle();
    setTimeout(() => {
      sound.playDishComplete();
      this.addItem(recipe.resultItem, 1);
      this.ui?.showToast(`🍳 料理大成功！獲得了美味的【${recipe.name}】！`, 4000);
      this.ui?.renderCookingModal();
    }, 800);

    return true;
  }

  // 💤 雲朵暖床安睡休息
  sleepInBed() {
    sound.playSleepRecover();
    this.pets.forEach(p => {
      p.currentHp = p.maxHp;
      p.satiety = Math.min(100, p.satiety + 25);
      p.affection = Math.min(100, p.affection + 10);
    });
    this.ui?.showScreenFlash('rgba(254, 240, 138, 0.5)');
    this.ui?.showToast('💤 在柔軟的雲朵雙人床上安睡一宿... 全隊魔寵體力與生命值已完全恢復！', 4500);
    this.ui?.updateHUD();
  }

  // 🛋️ 購買溫馨家具
  buyFurniture(item) {
    if (this.coins < item.price) {
      this.ui?.showToast(`🪙 金幣不足！還需要 ${item.price - this.coins} 金幣！`);
      return false;
    }
    this.coins -= item.price;
    item.bought = true;
    sound.playFanfare();
    this.ui?.showToast(`✨ 成功購買家具【${item.name}】！已佈置在溫馨小木屋中！`, 4000);
    this.ui?.updateHUD();
    this.ui?.renderFurnitureModal();
    return true;
  }

  // --- 2. Player 3D Avatar & Controller ---
  initPlayer() {
    this.playerMesh = PetModelFactory.createPlayer(this.characterId, this.customConfig);
    this.playerMesh.position.set(0, 0, 5);
    this.playerMesh.rotation.y = Math.PI; // 面朝世界前方（北向），背對鏡頭，讓跟隨寵物自然排在身後
    this.scene.add(this.playerMesh);

    this.playerPos = this.playerMesh.position;
    this.playerVel = new THREE.Vector3();
    this.playerSpeed = 6.2;
    this.isMoving = false;
    this.isGrounded = true;

    this.cameraOffset = new THREE.Vector3(0, 3.2, 6.5);
    this.cameraLookOffset = new THREE.Vector3(0, 1.2, 0);

    this.keys = {};
  }

  rebuildPlayerAvatar() {
    if (this.playerMesh) {
      const prevPos = this.playerMesh.position.clone();
      const prevRot = this.playerMesh.rotation.y;
      this.scene.remove(this.playerMesh);

      this.playerMesh = PetModelFactory.createPlayer(this.characterId, this.customConfig);
      this.playerMesh.position.copy(prevPos);
      this.playerMesh.rotation.y = prevRot;
      this.scene.add(this.playerMesh);
      this.playerPos = this.playerMesh.position;
    }
  }

  // --- 3. Follower Pet Parade 3D Entourage (無上限全員跟隨系統) ---
  initFollowerPet() {
    this.followerGroup = new THREE.Group();
    this.scene.add(this.followerGroup);
    this.followerList = [];
    this.rebuildFollowerPets();
  }

  // 🐾 3x3 九宮格往身後排隊陣列（每排3隻，向身後負Z方向依序延伸）
  calculateFollowerOffset(index, totalCount) {
    const row = Math.floor(index / 3);
    const colInRow = index % 3;
    const countInThisRow = Math.min(3, totalCount - row * 3);

    // 距離玩家身後的深度（負數嚴格確保在玩家身後，絕不在前方）
    const baseDist = 1.95;
    const rowDist = 1.5;
    const depth = -(baseDist + row * rowDist);

    // 橫向左右站位（3人一排九宮格陣容）
    let lateral = 0;
    if (countInThisRow === 1) {
      lateral = 0; // 居中跟隨於正後方
    } else if (countInThisRow === 2) {
      lateral = (colInRow === 0) ? -0.9 : 0.9; // 左右對稱護衛
    } else {
      // 3隻排滿：左中右
      const colSpread = [-1.4, 0, 1.4];
      lateral = colSpread[colInRow];
    }

    return { x: lateral, z: depth };
  }

  // 取得目前選擇上陣跟隨的魔寵列表
  getDeployedPets() {
    const deployed = this.pets.filter(p => p.deployed !== false);
    if (deployed.length === 0 && this.pets.length > 0) {
      this.pets[0].deployed = true;
      return [this.pets[0]];
    }
    return deployed;
  }

  // 切換指定魔寵的上陣/待命狀態
  togglePetDeploy(index) {
    if (index < 0 || index >= this.pets.length) return;
    const pet = this.pets[index];
    const isLeader = (index === this.activePetIndex);

    if (pet.deployed !== false && isLeader) {
      this.ui.showToast(`⚠️【${pet.customName || pet.speciesId}】當前是出戰領隊，不可轉入休息！請先指定其他魔寵為領隊。`);
      return;
    }

    pet.deployed = (pet.deployed === false);
    this.rebuildFollowerPets();
    this.ui.renderCarePanel();
    this.ui.updateHUD();

    if (pet.deployed) {
      sound.playFanfare();
      this.ui.showToast(`⚔️【${pet.customName || pet.speciesId}】已上陣！加入身後三排九宮格跟隨隊伍！`);
    } else {
      sound.playClick();
      this.ui.showToast(`💤【${pet.customName || pet.speciesId}】已轉為休整待命（不跟隨）。`);
    }
  }

  // 一鍵全員上陣
  deployAllPets() {
    this.pets.forEach(p => p.deployed = true);
    this.rebuildFollowerPets();
    this.ui.renderCarePanel();
    this.ui.updateHUD();
    sound.playFanfare();
    this.ui.showToast(`⚔️ 全員上陣！全體魔寵夥伴已在身後排成九宮格三排陣容！`);
  }

  // 僅領隊出戰跟隨
  deployOnlyLeader() {
    this.pets.forEach((p, idx) => {
      p.deployed = (idx === this.activePetIndex);
    });
    this.rebuildFollowerPets();
    this.ui.renderCarePanel();
    this.ui.updateHUD();
    sound.playClick();
    this.ui.showToast(`🐾 僅領隊魔寵單獨出戰跟隨。`);
  }

  // 重建身後九宮格跟隨隊伍（僅上陣的魔寵依序排隊）
  rebuildFollowerPets() {
    while (this.followerGroup.children.length > 0) {
      this.followerGroup.remove(this.followerGroup.children[0]);
    }
    this.followerList = [];

    const deployed = this.getDeployedPets();
    deployed.forEach((pet, index) => {
      const spec = PET_SPECIES[pet.speciesId];
      if (!spec) return;

      const model = PetModelFactory.createPet(pet.speciesId);
      const elem = ELEMENTS[spec.element] || { color: '#38bdf8', icon: '✨' };
      const isLeader = (this.pets.indexOf(pet) === this.activePetIndex);

      // 3D 浮動魔寵名字與等級名牌 (Nameplate Sprite)
      const badge = PetModelFactory.createNameBadge(
        pet.customName || spec.name,
        isLeader ? `⭐ 領隊 Lv.${pet.level}` : `Lv.${pet.level}`,
        elem.icon,
        elem.color
      );
      badge.position.y = 0.58;
      model.add(badge);

      const petContainer = new THREE.Group();
      petContainer.add(model);

      const offset = this.calculateFollowerOffset(index, deployed.length);
      const playerRot = this.playerMesh ? this.playerMesh.rotation.y : Math.PI;
      const rotatedOffset = new THREE.Vector3(offset.x, 0, offset.z).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerRot);

      petContainer.position.set(
        this.playerPos.x + rotatedOffset.x,
        0,
        this.playerPos.z + rotatedOffset.z
      );
      petContainer.rotation.y = playerRot;

      this.followerGroup.add(petContainer);

      this.followerList.push({
        petData: pet,
        container: petContainer,
        model: model,
        badge: badge,
        index: index,
        phase: (index * 1.38) + Math.random(),
        dist: 0
      });
    });

    // 保持當前領隊魔寵的向後相容參考
    if (this.followerList.length > 0) {
      const activeIdx = this.activePetIndex % this.followerList.length;
      this.activePetModel = this.followerList[activeIdx].model;
    }
  }

  rebuildFollowerPet() {
    this.rebuildFollowerPets();
  }

  // --- 4. Controls Binding (WASD, Arrow Keys, Mouse Orbit, Touch) ---
  bindControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Interaction key [E] or [Space]
      if (e.code === 'KeyE') {
        this.checkInteract();
      }
      if (e.code === 'Space') {
        this.jumpPlayer();
      }

      // Quick Nav shortcuts
      if (e.code === 'KeyH') this.ui.openHatchModal();
      if (e.code === 'KeyC') this.ui.openCareModal();
      if (e.code === 'KeyM') this.ui.openMapModal();
      if (e.code === 'KeyB') this.ui.openBookModal();
      if (e.code === 'KeyW' && e.altKey) this.ui.openWardrobeModal();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse camera orbit drag
    let isMouseDown = false;
    let lastMouseX = 0;
    this.cameraYaw = 0;

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('.anime-modal') || e.target.closest('.hud-header') || e.target.closest('.quick-nav-bar')) return;
      isMouseDown = true;
      lastMouseX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      const dx = e.clientX - lastMouseX;
      lastMouseX = e.clientX;
      this.cameraYaw -= dx * 0.006;
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    // Touch Virtual Joystick for Mobile / Tablet
    const stickEl = document.getElementById('mobile-stick-thumb');
    const stickBase = document.getElementById('mobile-stick-base');
    let touchId = null;
    let stickStart = { x: 0, y: 0 };
    this.touchVector = { x: 0, y: 0 };

    if (stickBase) {
      stickBase.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        touchId = t.identifier;
        const rect = stickBase.getBoundingClientRect();
        stickStart = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (touchId === null) return;
        for (let i = 0; i < e.touches.length; i++) {
          const t = e.touches[i];
          if (t.identifier === touchId) {
            const dx = t.clientX - stickStart.x;
            const dy = t.clientY - stickStart.y;
            const dist = Math.min(45, Math.hypot(dx, dy));
            const angle = Math.atan2(dy, dx);

            stickEl.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
            this.touchVector = {
              x: (Math.cos(angle) * dist) / 45,
              y: (Math.sin(angle) * dist) / 45
            };
          }
        }
      }, { passive: true });

      const resetStick = (e) => {
        touchId = null;
        stickEl.style.transform = `translate(0px, 0px)`;
        this.touchVector = { x: 0, y: 0 };
      };
      window.addEventListener('touchend', resetStick);
      window.addEventListener('touchcancel', resetStick);
    }
  }

  jumpPlayer() {
    if (this.isGrounded) {
      this.playerVel.y = 7.5;
      this.isGrounded = false;
    }
  }

  // --- 4.5. 遠古幻境傳送石碑空間躍遷 (Teleport Waypoint System) ---
  teleportToZone(zoneId) {
    const targetZone = MAP_ZONES.find(z => z.id === zoneId);
    if (!targetZone) return;

    sound.playTeleport();

    // Visual Warp Screen Flash
    const flash = document.createElement('div');
    flash.className = 'teleport-warp-flash';
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.classList.add('fade-out');
      setTimeout(() => flash.remove(), 600);
    }, 280);

    // Load world zone
    this.world.loadZone(zoneId);

    // Position player safely in front of the waypoint monolith
    this.playerPos.set(4.8, 0, 4.6);
    this.playerMesh.position.copy(this.playerPos);
    this.playerMesh.rotation.y = Math.PI;

    // Follower pet reset
    this.rebuildFollowerPet();

    // Update HUD
    this.ui.updateHUD();
    this.ui.showToast(`🌀 空間躍遷完成！已抵達【${targetZone.name}】！`, 4500);
  }

  // --- 5. Interaction Check ---
  checkInteract() {
    const nearby = this.world.findNearestInteractive(this.playerPos, 4.2);
    if (!nearby) return;

    if (nearby.type === 'gathering') {
      const drop = this.world.gatherResource(nearby);
      if (drop) {
        this.addItem(drop.item, drop.count);
        sound.playFanfare();
        this.ui.showToast(`✨ 成功採集了【${drop.name}】x${drop.count}！`);
      }
    } else if (nearby.type === 'fruit_tree') {
      const drop = this.world.shakeFruitTree(nearby.data);
      if (drop) {
        this.addItem(drop.item, drop.count);
        this.ui.showToast(`🍎 搖晃果樹，採摘了【${drop.name}】x${drop.count}！已放入背包！`, 3500);
      }
    } else if (nearby.type === 'cooking') {
      sound.playClick();
      this.ui.openCookingModal();
    } else if (nearby.type === 'bed') {
      this.sleepInBed();
    } else if (nearby.type === 'fishing') {
      this.startFishing();
    } else if (nearby.type === 'teleport_waypoint') {
      sound.playRuneActivate();
      this.ui.openMapModal();
    } else if (nearby.type === 'rune') {
      sound.playClick();
      this.ui.openRuneModal(nearby.data);
    } else if (nearby.type === 'monster') {
      sound.playClick();
      const activePet = this.getActivePet();
      const enemySpeciesId = nearby.data.speciesId;
      this.battle.startBattle(activePet, enemySpeciesId, (victory) => {
        if (victory && nearby.data.mesh) {
          this.world.zoneGroup.remove(nearby.data.mesh);
          const idx = this.world.wildMonsters.indexOf(nearby.data);
          if (idx !== -1) this.world.wildMonsters.splice(idx, 1);
        }
      });
      this.ui.openBattleModal(this.battle);
    } else if (nearby.type === 'companion_npc') {
      sound.playClick();
      this.ui.showToast(`💬【${nearby.data.name}】：${nearby.data.dialog}`, 6000);
    } else if (nearby.type === 'wardrobe_mirror') {
      sound.playFanfare();
      this.ui.openWardrobeModal();
    }
  }

  // --- 6. Main Loop & Animation ---
  animate() {
    requestAnimationFrame(this.animate);

    const delta = 0.016;
    this.updatePlayer(delta);
    this.updateFollower(delta);
    this.updateWeather(delta);
    this.checkLavaDamage(delta);
    this.world.update(delta, this.playerPos);

    // Check interaction prompt every frame
    const nearby = this.world.findNearestInteractive(this.playerPos, 4.2);
    if (nearby) {
      let label = '【E】進行互動';
      if (nearby.type === 'fruit_tree') label = nearby.data.name;
      else if (nearby.type === 'cooking') label = nearby.data.name;
      else if (nearby.type === 'bed') label = nearby.data.name;
      else if (nearby.type === 'fishing') label = nearby.data.name;
      else if (nearby.type === 'teleport_waypoint') label = `【E】啟動 ${nearby.data.name} (空間躍遷)`;
      else if (nearby.type === 'gathering') label = `【E】採集 ${nearby.data.name}`;
      else if (nearby.type === 'rune') label = `【E】研讀 ${nearby.data.name}`;
      else if (nearby.type === 'monster') label = `【E】邂逅野生動物【${nearby.data.name}】(交談/感化同行)`;
      else if (nearby.type === 'companion_npc') label = `【E】與 ${nearby.data.name} 交談`;
      else if (nearby.type === 'wardrobe_mirror') label = `【E】照看 ${nearby.data.name} (更換時裝)`;
      this.ui.setInteractPrompt(label);
    } else {
      this.ui.setInteractPrompt(null);
    }

    // Camera follow smoothly
    const desiredCamPos = this.playerPos.clone().add(
      this.cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw)
    );
    this.camera.position.lerp(desiredCamPos, 0.12);
    this.camera.lookAt(this.playerPos.clone().add(this.cameraLookOffset));

    this.renderer.render(this.scene, this.camera);
  }

  updatePlayer(delta) {
    let moveX = 0;
    let moveZ = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;

    // Apply touch vector if present
    if (Math.abs(this.touchVector.x) > 0.1) moveX += this.touchVector.x;
    if (Math.abs(this.touchVector.y) > 0.1) moveZ += this.touchVector.y;

    const inputLen = Math.hypot(moveX, moveZ);
    if (inputLen > 0.1) {
      this.isMoving = true;
      // Rotate movement by camera yaw
      const moveDir = new THREE.Vector3(moveX, 0, moveZ).normalize();
      moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);

      this.playerPos.addScaledVector(moveDir, this.playerSpeed * delta);
      const lookAngle = Math.atan2(moveDir.x, moveDir.z);
      this.playerMesh.rotation.y = lookAngle;

      // Walk cycle animation
      const walkCycle = Math.sin(Date.now() * 0.012);
      if (this.playerMesh.legL) this.playerMesh.legL.rotation.x = walkCycle * 0.6;
      if (this.playerMesh.legR) this.playerMesh.legR.rotation.x = -walkCycle * 0.6;
      if (this.playerMesh.armL) this.playerMesh.armL.rotation.x = -walkCycle * 0.5;
      if (this.playerMesh.armR) this.playerMesh.armR.rotation.x = walkCycle * 0.5;
      if (this.playerMesh.cape) this.playerMesh.cape.rotation.x = 0.35 + Math.abs(walkCycle) * 0.2;

      // Footstep sound
      if (Math.random() < delta * 2.5) {
        sound.playFootstep();
      }
    } else {
      this.isMoving = false;
      if (this.playerMesh.legL) this.playerMesh.legL.rotation.x = 0;
      if (this.playerMesh.legR) this.playerMesh.legR.rotation.x = 0;
      if (this.playerMesh.armL) this.playerMesh.armL.rotation.x = 0;
      if (this.playerMesh.armR) this.playerMesh.armR.rotation.x = 0;
      if (this.playerMesh.cape) this.playerMesh.cape.rotation.x = 0.2;
    }

    // Gravity & Grounding
    if (!this.isGrounded) {
      this.playerVel.y -= 18 * delta;
      this.playerPos.y += this.playerVel.y * delta;
      if (this.playerPos.y <= 0) {
        this.playerPos.y = 0;
        this.playerVel.y = 0;
        this.isGrounded = true;
      }
    }

    // Keep player inside boundary
    this.playerPos.x = Math.max(-55, Math.min(55, this.playerPos.x));
    this.playerPos.z = Math.max(-55, Math.min(55, this.playerPos.z));
  }

  // 🐾 靈動自由漫步與忠實跟隨系統（寵物隨便走、到處逛、嗅嗅草地、回頭看主人，但始終忠誠跟隨身邊）
  updateFollower(delta) {
    if (!this.followerGroup || !this.followerList || this.followerList.length === 0) return;

    const now = Date.now();
    const playerMoving = this.isMoving;

    this.followerList.forEach((f) => {
      // 1. 初始化每隻寵物的自主漫步狀態
      if (!f.roamTarget) {
        f.roamTarget = f.container.position.clone();
        f.roamTimer = Math.random() * 2;
        f.idleBehavior = 'wander';
        f.lastCryTime = now + Math.random() * 4000;
      }

      const distToPlayer = f.container.position.distanceTo(this.playerPos);
      let isPetMoving = false;

      // 2. 防走丟安全繩索：如果距離主人太遠（> 16 單位，例如地圖傳送或高速瞬移），瞬間跟隨至主人身旁
      if (distToPlayer > 16) {
        const resetAng = Math.random() * Math.PI * 2;
        f.container.position.set(
          this.playerPos.x + Math.cos(resetAng) * 2.2,
          0,
          this.playerPos.z + Math.sin(resetAng) * 2.2
        );
        f.roamTarget.copy(f.container.position);
      }

      // 3. 【主人奔跑前進】或【寵物距離主人較遠 > 4.2公尺】
      // ➔ 進入「歡快跟跑模式」：寵物主動奔向主人身邊的流動扇區，不用死板卡位！
      if (playerMoving || distToPlayer > 4.2) {
        // 動態隨行目標點（落在主人周圍 1.8~3.2 公尺處的自然流動扇區，非固定方格）
        const followAngle = (f.index * 1.5) + Math.sin(now * 0.0015 + f.phase) * 0.7;
        const followDist = 2.0 + (f.index % 3) * 0.6 + Math.sin(now * 0.002 + f.phase) * 0.4;

        // 偏向主人身後或兩側自然跟進
        const playerAngle = this.playerMesh.rotation.y;
        const backAngle = playerAngle + Math.PI + (f.index % 2 === 0 ? 0.6 : -0.6);
        const dynamicFollowTarget = new THREE.Vector3(
          this.playerPos.x + Math.sin(backAngle) * followDist,
          0,
          this.playerPos.z + Math.cos(backAngle) * followDist
        );

        const toTarget = dynamicFollowTarget.clone().sub(f.container.position);
        toTarget.y = 0;
        const distToFollowTarget = toTarget.length();

        if (distToFollowTarget > 0.35) {
          isPetMoving = true;
          // 加速度隨距離增加：主人跑得快，寵物也開心地加緊小碎步追上
          const chaseSpeed = Math.min(7.5, 3.8 + distToFollowTarget * 1.1);
          const step = Math.min(distToFollowTarget, chaseSpeed * delta);
          toTarget.normalize();
          f.container.position.addScaledVector(toTarget, step);

          // 轉向奔跑前進方向
          const moveAngle = Math.atan2(toTarget.x, toTarget.z);
          f.container.rotation.y = THREE.MathUtils.lerp(f.container.rotation.y, moveAngle, 0.15);

          // 歡快小跑步伐彈跳
          const walkCycle = Math.sin(now * 0.014 + f.phase);
          f.model.position.y = Math.abs(walkCycle) * 0.22;
        } else {
          // 已經接近主人身側，放緩小步
          f.model.position.y = THREE.MathUtils.lerp(f.model.position.y, 0.06, 0.1);
        }
      } else {
        // 4. 【主人停下腳步 / 正在休息】
        // ➔ 進入「自由自主漫步與探索模式」：寵物在主人身邊隨便走、到處逛、嗅嗅草地、回頭看主人！
        f.roamTimer = (f.roamTimer || 0) - delta;

        // 每隔 2.5 ~ 4.5 秒，寵物在主人周圍挑選一個新的漫步探索點
        if (f.roamTimer <= 0) {
          f.roamTimer = 2.8 + Math.random() * 2.4;

          // 在主人身邊 1.5 ~ 3.5 公尺內隨機選點（絕不走遠脫離主人）
          const randomAng = Math.random() * Math.PI * 2;
          const randomDist = 1.4 + Math.random() * 2.2;
          f.roamTarget.set(
            this.playerPos.x + Math.cos(randomAng) * randomDist,
            0,
            this.playerPos.z + Math.sin(randomAng) * randomDist
          );

          // 隨機切換當前的自由行為
          const roll = Math.random();
          if (roll < 0.55) {
            f.idleBehavior = 'wander'; // 隨意走走散步
          } else if (roll < 0.75) {
            f.idleBehavior = 'sniff'; // 嗅嗅草地、好奇探索
          } else if (roll < 0.90) {
            f.idleBehavior = 'look_player'; // 深情回頭望著主人
          } else {
            f.idleBehavior = 'play_hop'; // 開心原地小跳躍
          }
        }

        // 執行漫步行為
        if (f.idleBehavior === 'wander') {
          const toRoam = f.roamTarget.clone().sub(f.container.position);
          toRoam.y = 0;
          const distToRoam = toRoam.length();

          if (distToRoam > 0.25) {
            isPetMoving = true;
            // 悠閒慢悠悠的小步散步（速度約 2.0）
            const wanderSpeed = 2.0;
            const step = Math.min(distToRoam, wanderSpeed * delta);
            toRoam.normalize();
            f.container.position.addScaledVector(toRoam, step);

            // 轉向漫步目的地
            const roamAngle = Math.atan2(toRoam.x, toRoam.z);
            f.container.rotation.y = THREE.MathUtils.lerp(f.container.rotation.y, roamAngle, 0.12);

            // 悠閒小步
            f.model.position.y = Math.abs(Math.sin(now * 0.008 + f.phase)) * 0.12;
            f.model.rotation.x = THREE.MathUtils.lerp(f.model.rotation.x, 0, 0.1);
          } else {
            // 到達探索小目標，站定休息
            f.idleBehavior = Math.random() < 0.5 ? 'look_player' : 'sniff';
          }
        } else if (f.idleBehavior === 'look_player') {
          // 好奇回望主人
          const toPlayer = this.playerPos.clone().sub(f.container.position);
          if (toPlayer.lengthSq() > 0.01) {
            const angleToPlayer = Math.atan2(toPlayer.x, toPlayer.z);
            f.container.rotation.y = THREE.MathUtils.lerp(f.container.rotation.y, angleToPlayer, 0.08);
          }
          f.model.rotation.z = Math.sin(now * 0.005 + f.phase) * 0.08; // 可愛側歪頭
          f.model.rotation.x = THREE.MathUtils.lerp(f.model.rotation.x, 0, 0.1);
          f.model.position.y = THREE.MathUtils.lerp(f.model.position.y, 0.05 + Math.sin(now * 0.004) * 0.04, 0.1);
        } else if (f.idleBehavior === 'sniff') {
          // 在草地上探頭嗅聞
          f.model.rotation.x = THREE.MathUtils.lerp(f.model.rotation.x, 0.16, 0.1);
          f.model.rotation.z = Math.sin(now * 0.008) * 0.04;
          f.model.position.y = THREE.MathUtils.lerp(f.model.position.y, 0.02, 0.1);
        } else if (f.idleBehavior === 'play_hop') {
          // 開心小跳躍
          const hop = Math.abs(Math.sin(now * 0.01 + f.phase));
          f.model.position.y = hop * 0.22;
          f.model.rotation.x = THREE.MathUtils.lerp(f.model.rotation.x, 0, 0.1);
        } else {
          // 默認溫和呼吸浮動
          const bob = Math.sin(now * 0.004 + f.phase) * 0.06;
          f.model.position.y = THREE.MathUtils.lerp(f.model.position.y, 0.06 + bob, 0.1);
          f.model.rotation.x = THREE.MathUtils.lerp(f.model.rotation.x, 0, 0.1);
        }
      }

      // 🔊 偶爾在主人身邊發出親暱快樂的叫聲（每 12~20 秒隨機觸發）
      if (now - (f.lastCryTime || 0) > 14000) {
        if (Math.random() < 0.35 && distToPlayer < 4.0) {
          f.lastCryTime = now;
          sound.playPetCry(f.petData?.speciesId || 'fire_1');
        }
      }

      // 🐾 魔寵全動態即時運算（小腳前後邁步踏步、耳朵抖動、尾巴靈活搖擺、雙翼拍打）
      PetModelFactory.animatePetModel(f.model, isPetMoving, now, f.phase);
    });
  }
}

// Start game on load
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new PetAdventureGame();
  window.game = window.gameInstance;
});
