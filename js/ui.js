// Modern Anime UI Controller for 《魔寵：幻境之旅》
import { ELEMENTS, RARITIES, PET_SPECIES, MAP_ZONES, CONSUMABLES, EGG_TYPES, COOKING_RECIPES, FURNITURE_ITEMS, FISH_TYPES } from './pets_data.js';
import { CHARACTERS, WARDROBE_ITEMS, MAIN_QUESTS, SECRET_ARCHIVES, STORY_MERGE_EVENT, FREE_ROAM_FEATURES } from './character_data.js';
import { sound } from './audio.js';

export class UIManager {
  constructor(game) {
    this.game = game;

    this.activeModal = null;
    this.battleInstance = null;
    this.hatchTimer = null;

    // Wardrobe temporary preview state
    this.tempWardrobe = {
      outfit: 'mage_robe',
      hairStyle: 'long',
      hairColor: '#f1f5f9',
      eyeColor: '#38bdf8',
      headwear: 'magic_halo',
      name: '星月'
    };
    this.currentWardrobeTab = 'outfits';

    this.initDOMElements();
    this.bindEvents();
  }

  initDOMElements() {
    // Top HUD
    this.elPlayerName = document.getElementById('hud-player-name');
    this.elPlayerLevel = document.getElementById('hud-player-level');
    this.elPlayerCoins = document.getElementById('hud-player-coins');
    this.elCurrentZone = document.getElementById('hud-current-zone');
    this.elWeatherBadge = document.getElementById('hud-weather-badge');
    this.elQuestTitle = document.getElementById('hud-quest-title');

    this.elPetAvatar = document.getElementById('hud-pet-avatar');
    this.elPetName = document.getElementById('hud-pet-name');
    this.elPetElement = document.getElementById('hud-pet-element');
    this.elPetLevel = document.getElementById('hud-pet-level');
    this.elPetHpBar = document.getElementById('hud-pet-hp-bar');
    this.elPetSatietyBar = document.getElementById('hud-pet-satiety-bar');
    this.elPetAffection = document.getElementById('hud-pet-affection');

    this.elToast = document.getElementById('game-toast');
    this.elCrosshairPrompt = document.getElementById('crosshair-prompt');
  }

  bindEvents() {
    // Weather Badge Toggle
    this.elWeatherBadge?.addEventListener('click', () => this.game.toggleWeatherNext());

    // Top Nav Buttons
    document.getElementById('btn-nav-home')?.addEventListener('click', () => this.game.teleportToZone('home'));
    document.getElementById('btn-nav-cooking')?.addEventListener('click', () => this.openCookingModal());
    document.getElementById('btn-nav-furniture')?.addEventListener('click', () => this.openFurnitureModal());
    document.getElementById('btn-nav-hatch')?.addEventListener('click', () => this.openHatchModal());
    document.getElementById('btn-nav-care')?.addEventListener('click', () => this.openCareModal());
    document.getElementById('btn-nav-evolve')?.addEventListener('click', () => this.openEvolveModal());
    document.getElementById('btn-nav-book')?.addEventListener('click', () => this.openBookModal());
    document.getElementById('btn-nav-map')?.addEventListener('click', () => this.openMapModal());
    document.getElementById('btn-nav-bag')?.addEventListener('click', () => this.openBagModal());
    document.getElementById('btn-nav-wardrobe')?.addEventListener('click', () => this.openWardrobeModal());
    document.getElementById('btn-nav-secrets')?.addEventListener('click', () => this.openSecretsModal());
    document.getElementById('btn-nav-switch-char')?.addEventListener('click', () => this.openCharSelectModal());
    document.getElementById('btn-nav-starter')?.addEventListener('click', () => this.openStarterPetSelectModal());

    document.getElementById('hud-quest-box')?.addEventListener('click', () => this.openQuestModal());

    document.getElementById('btn-toggle-sound')?.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      document.getElementById('btn-toggle-sound').innerText = isMuted ? '🔇 靜音' : '🔊 音效';
    });

    // Close Modal buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => this.closeCurrentModal());
    });

    // Pet Quick Interact
    document.getElementById('hud-pet-card')?.addEventListener('click', () => {
      this.openCareModal();
    });
  }

  showToast(msg, duration = 3000) {
    if (!this.elToast) return;
    this.elToast.innerText = msg;
    this.elToast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.elToast.classList.remove('show');
    }, duration);
  }

  setInteractPrompt(text) {
    if (!this.elCrosshairPrompt) return;
    if (text) {
      this.elCrosshairPrompt.innerText = text;
      this.elCrosshairPrompt.style.display = 'block';
    } else {
      this.elCrosshairPrompt.style.display = 'none';
    }
  }

  updateHUD() {
    if (this.elPlayerName) this.elPlayerName.innerText = this.game.playerName || '星月';
    if (this.elPlayerLevel) this.elPlayerLevel.innerText = `Lv.${this.game.playerLevel}`;
    if (this.elPlayerCoins) this.elPlayerCoins.innerText = this.game.coins;

    const currentZone = MAP_ZONES.find(z => z.id === this.game.world.currentZoneId);
    if (this.elCurrentZone && currentZone) {
      this.elCurrentZone.innerHTML = `${currentZone.icon} ${currentZone.name}`;
    }

    const currentQuest = MAIN_QUESTS[this.game.currentQuestIndex] || MAIN_QUESTS[0];
    if (this.elQuestTitle && currentQuest) {
      this.elQuestTitle.innerText = `📜 ${currentQuest.title}`;
    }

    const activePet = this.game.getActivePet();
    if (activePet) {
      const spec = PET_SPECIES[activePet.speciesId];
      if (this.elPetAvatar) this.elPetAvatar.innerText = spec.icon;
      if (this.elPetName) {
        const deployedCount = this.game.getDeployedPets ? this.game.getDeployedPets().length : 1;
        const totalCount = this.game.pets ? this.game.pets.length : 1;
        this.elPetName.innerHTML = `${activePet.customName || spec.name} <span style="font-size:11px; color:#facc15; font-weight:600; margin-left:4px;">(⚔️ 上陣跟隨: ${deployedCount}/${totalCount}隻)</span>`;
      }
      if (this.elPetLevel) this.elPetLevel.innerText = `Lv.${activePet.level}`;

      const elem = ELEMENTS[spec.element];
      if (this.elPetElement && elem) {
        this.elPetElement.innerText = `${elem.icon} ${elem.name}`;
        this.elPetElement.style.background = elem.color;
      }

      if (this.elPetHpBar) {
        const hpPct = Math.max(0, Math.min(100, (activePet.currentHp / activePet.maxHp) * 100));
        this.elPetHpBar.style.width = `${hpPct}%`;
      }

      if (this.elPetSatietyBar) {
        const satPct = Math.max(0, Math.min(100, (activePet.satiety / 100) * 100));
        this.elPetSatietyBar.style.width = `${satPct}%`;
      }

      if (this.elPetAffection) {
        this.elPetAffection.innerText = `💖 ${activePet.affection}/100`;
      }
    }
  }

  openModal(modalId) {
    this.closeCurrentModal();
    sound.playClick();
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      this.activeModal = modal;
    }
  }

  closeCurrentModal() {
    document.querySelectorAll('.anime-modal.active').forEach(m => m.classList.remove('active'));
    this.activeModal = null;
    sound.playClick();
  }

  // ==========================================
  // 🚪 0. 幻境選擇之門 (Character Selection Gate)
  // ==========================================
  openCharSelectModal() {
    this.openModal('modal-char-select');
    this.renderCharSelection();
  }

  renderCharSelection() {
    const listEl = document.getElementById('char-select-cards');
    if (!listEl) return;
    listEl.innerHTML = '';

    Object.values(CHARACTERS).forEach(char => {
      const isSelected = (this.game.characterId === char.id);
      const card = document.createElement('div');
      card.className = `char-gate-card ${isSelected ? 'selected' : ''}`;
      card.style.borderColor = char.color;
      card.innerHTML = `
        <div class="char-portrait-box">
          <img src="${char.portrait}" alt="${char.name}" class="char-img">
          <div class="char-type-pill" style="background:${char.color}">${char.typeIcon} ${char.type}</div>
        </div>
        <div class="char-gate-info">
          <h3 style="color:${char.color};">${char.name}</h3>
          <span class="char-title">${char.title}</span>
          <p class="char-desc">${char.desc}</p>
          <div class="char-skill-preview">
            <strong>初始技能：</strong> ${char.initialSkill.icon} ${char.initialSkill.name}
          </div>
          <button class="anime-btn ${isSelected ? 'success-glow' : 'primary-glow'}" style="margin-top:10px; width:100%;">
            ${isSelected ? '✅ 當前踏入幻境' : '🌟 選擇此角色展開旅程'}
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        sound.playClick();
        this.selectCharacterAndStartStory(char);
      });
      listEl.appendChild(card);
    });
  }

  selectCharacterAndStartStory(char) {
    this.game.characterId = char.id;
    this.game.playerName = char.name;
    this.game.customConfig = { ...char.defaultCustom, name: char.name };
    this.game.rebuildPlayerAvatar();
    this.updateHUD();
    this.closeCurrentModal();

    // Play Character Prologue Story
    this.openStoryCutscene(char);
  }

  // ==========================================
  // 📖 故事序章奇遇 (Prologue Story Cutscene)
  // ==========================================
  openStoryCutscene(char) {
    this.openModal('modal-story-cutscene');
    const container = document.getElementById('story-cutscene-body');
    if (!container) return;

    let step = 0;
    const renderStep = () => {
      container.innerHTML = `
        <div class="story-cinematic-view">
          <div class="story-img-container">
            <img src="${char.storyBg}" alt="${char.storyTitle}" class="story-cg-img">
            <div class="story-overlay-grad"></div>
          </div>
          <div class="story-dialogue-card">
            <div class="story-chap-tag">📜 角色專屬序章：【${char.storyTitle}】</div>
            <p class="story-text-typing">${char.storyText[step] || ''}</p>
            <div class="story-nav-actions">
              <span style="font-size:12px; color:#94a3b8;">(${step + 1}/${char.storyText.length})</span>
              <button id="btn-story-next" class="anime-btn primary-glow">
                ${step < char.storyText.length - 1 ? '繼續閱讀 ➔' : '踏入《魔寵：幻境之旅》✨'}
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btn-story-next')?.addEventListener('click', () => {
        sound.playClick();
        step++;
        if (step < char.storyText.length) {
          renderStep();
        } else {
          this.closeCurrentModal();
          sound.playVictory();
          this.showToast(`✨ 序章【${char.storyTitle}】已收錄至秘密檔案館！即將進行初始魔寵契約儀式！`, 5000);
          SECRET_ARCHIVES.find(s => s.id === 'sec_character').unlocked = true;

          // 自動開啟初始魔寵契約儀式（從六隻中選擇一隻作為初始同伴！）
          setTimeout(() => {
            this.openStarterPetSelectModal();
          }, 450);
        }
      });
    };

    renderStep();
  }

  // ==========================================
  // 🐾 初始魔寵契約儀式 (Starter Pet Selection Modal)
  // ==========================================
  openStarterPetSelectModal() {
    this.openModal('modal-starter-pet-select');
    const container = document.getElementById('starter-pets-cards-grid');
    if (!container) return;
    container.innerHTML = '';

    const STARTER_PETS = [
      {
        id: 'ice_1',
        code: '001',
        name: '雪團',
        species: '冰霜幼狼',
        element: 'ice',
        elemName: '❄️ 冰',
        elemColor: '#38bdf8',
        icon: '🐺',
        personality: '呆萌、忠誠、喜愛冰雪',
        skills: ['冰霜吐息', '寒冰護盾'],
        stats: { hp: 190, atk: 42, def: 30, spd: 28 },
        desc: '生活在永凍冰原外圍的靈動小狼。擁有純淨的冰晶之力，會用小雪花和同伴嬉戲。'
      },
      {
        id: 'water_1',
        code: '002',
        name: '泡泡',
        species: '碧水靈萌',
        element: 'water',
        elemName: '💧 水',
        elemColor: '#06b6d4',
        icon: '🫧',
        personality: '溫柔、靈動、活潑愛笑',
        skills: ['水流噴射', '清泉治癒'],
        stats: { hp: 200, atk: 38, def: 28, spd: 32 },
        desc: '誕生於清泉湖底的純澈水靈。身體如果凍般彈潤透亮，心情好時會吐出彩虹泡泡。'
      },
      {
        id: 'fire_1',
        code: '003',
        name: '小火狐',
        species: '火焰幼狐',
        element: 'fire',
        elemName: '🔥 火',
        elemColor: '#ef4444',
        icon: '🦊',
        personality: '活潑、勇敢、好奇心旺盛',
        skills: ['小火球', '火焰尾巴'],
        stats: { hp: 180, atk: 48, def: 24, spd: 35 },
        desc: '炎龍火山腳下的活潑幼狐。尾尖燃燒著溫暖而不灼人的靈焰，開心時會冒出愛心火花。'
      },
      {
        id: 'nature_1',
        code: '004',
        name: '芽鹿',
        species: '森林幼鹿',
        element: 'nature',
        elemName: '🌿 木',
        elemColor: '#22c55e',
        icon: '🦌',
        personality: '溫柔、親人、大自然之子',
        skills: ['藤蔓纏繞', '自然恢復'],
        stats: { hp: 210, atk: 36, def: 32, spd: 26 },
        desc: '迷霧森林生命之樹的信使。鹿角上開滿微型繁花，奔跑時腳邊會綻放出青翠的小草。'
      },
      {
        id: 'shadow_1',
        code: '005',
        name: '紫翼',
        species: '暗影翼獸',
        element: 'shadow',
        elemName: '🌙 暗',
        elemColor: '#a855f7',
        icon: '🦇',
        personality: '神秘、機智、微調皮',
        skills: ['暗影球', '暗影感知'],
        stats: { hp: 175, atk: 50, def: 22, spd: 40 },
        desc: '暗月遺跡的神秘守護者。擁有洞悉暗格與夜行飛翔的能力，身邊縈繞著紫色的微光星塵。'
      },
      {
        id: 'thunder_1',
        code: '006',
        name: '雷羽',
        species: '雷電幼鳥',
        element: 'thunder',
        elemName: '⚡ 雷',
        elemColor: '#eab308',
        icon: '🐥',
        personality: '活潑、迅捷、好勝不服輸',
        skills: ['閃電突擊', '電光羽刃'],
        stats: { hp: 170, atk: 52, def: 20, spd: 44 },
        desc: '雲端天空城的高速靈鳥。羽毛間跳躍著劈啪作響的金色電光，飛行速度全大陸第一！'
      }
    ];

    STARTER_PETS.forEach(pet => {
      const isAlreadyOwned = this.game.pets.some(p => p.speciesId === pet.id);
      const isFirstPet = (this.game.pets.length <= 1);

      const card = document.createElement('div');
      card.className = `starter-pet-card ${isAlreadyOwned ? 'selected' : ''}`;
      card.style.setProperty('--card-color', pet.elemColor);
      card.style.setProperty('--card-glow', `${pet.elemColor}66`);

      card.innerHTML = `
        <div class="starter-pet-header">
          <span class="starter-pet-id-tag">No.${pet.code}</span>
          <span class="starter-pet-elem-tag" style="background:${pet.elemColor};">${pet.elemName}</span>
        </div>

        <div class="starter-pet-avatar-box">
          <span class="pet-big-icon">${pet.icon}</span>
        </div>

        <div class="starter-pet-name">
          <span>${pet.name}</span>
          <span style="font-size:12px; font-weight:600; color:#94a3b8;">${pet.species}</span>
        </div>

        <div class="starter-pet-personality">
          💖 性格：${pet.personality}
        </div>

        <div class="starter-pet-skills-box">
          <div class="starter-pet-skills-title">⚔️ 初始專屬技能：</div>
          <div class="starter-pet-skill-item">✨ ${pet.skills[0]}</div>
          <div class="starter-pet-skill-item">🛡️ ${pet.skills[1]}</div>
          <div style="margin-top:6px; font-size:11px; color:#cbd5e1;">
            生命 ${pet.stats.hp} ｜ 攻擊 ${pet.stats.atk} ｜ 防禦 ${pet.stats.def} ｜ 速度 ${pet.stats.spd}
          </div>
        </div>

        <button class="starter-pet-action-btn" style="background: linear-gradient(135deg, ${pet.elemColor}, #1e1b4b);">
          ${isAlreadyOwned 
            ? '🐾 當前同行夥伴 (跟隨中)' 
            : (isFirstPet ? '✨ 選擇為最初同行夥伴 ➔' : '➕ 締結契約並召喚跟隨 (無上限) ➔')}
        </button>
      `;

      card.querySelector('.starter-pet-action-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playClick();
        if (isAlreadyOwned) {
          this.showToast(`🐾 【${pet.name}】已經在你的身邊跟隨冒險囉！`, 3000);
          return;
        }

        if (isFirstPet) {
          // 替換最初夥伴為玩家所選
          this.game.selectStarterPet(pet.id, pet.name);
          this.closeCurrentModal();
        } else {
          // 召喚加入跟隨隊伍（無上限全員跟隨！）
          this.game.recruitCompanionPet(pet.id, pet.name);
          this.openStarterPetSelectModal(); // refresh UI
        }
      });

      container.appendChild(card);
    });
  }

  // ==========================================
  // 🌋 三條故事合併奇遇 (Volcano Ancient Temple Meeting)
  // ==========================================
  openMergeStoryCutscene() {
    this.openModal('modal-story-cutscene');
    const container = document.getElementById('story-cutscene-body');
    if (!container) return;

    const eventData = STORY_MERGE_EVENT;
    let step = 0;

    const renderStep = () => {
      const current = eventData.steps[step];
      const isImgAvatar = current.avatar && current.avatar.startsWith('assets/');

      container.innerHTML = `
        <div class="story-cinematic-view">
          <div class="story-img-container">
            <img src="${eventData.cgBg}" alt="${eventData.title}" class="story-cg-img">
            <div class="story-overlay-grad"></div>
            <!-- Three character meeting preview badges in temple -->
            <div class="merge-char-row">
              <div class="merge-char-badge ${step >= 1 ? 'active pulse-glow' : ''}">
                <img src="assets/character_xingyue.jpg" alt="星月">
                <span>星月・魔寵蛋</span>
              </div>
              <div class="merge-char-badge ${step >= 2 ? 'active pulse-glow' : ''}">
                <img src="assets/character_yeying.png" alt="夜影">
                <span>夜影・古代日記</span>
              </div>
              <div class="merge-char-badge ${step >= 3 ? 'active pulse-glow' : ''}">
                <img src="assets/character_chenxi.jpg" alt="晨曦">
                <span>晨曦・黑霧之謎</span>
              </div>
            </div>
          </div>
          <div class="story-dialogue-card">
            <div class="story-speaker-bar">
              <div class="speaker-avatar-circle">
                ${isImgAvatar ? `<img src="${current.avatar}" alt="${current.speaker}">` : `<span>${current.avatar}</span>`}
              </div>
              <div class="story-chap-tag">🏛️【${eventData.title}】• <span style="color:#f59e0b;">${current.speaker}</span></div>
            </div>
            <p class="story-text-typing" style="white-space:pre-line;">${current.text}</p>
            <div class="story-nav-actions">
              <span style="font-size:12px; color:#94a3b8;">(${step + 1}/${eventData.steps.length})</span>
              <button id="btn-merge-next" class="anime-btn ${step === eventData.steps.length - 1 ? 'success-glow' : 'primary-glow'}">
                ${step < eventData.steps.length - 1 ? '繼續對話 ➔' : '三線正式合併・攜手踏上新征程！✨'}
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btn-merge-next')?.addEventListener('click', () => {
        sound.playClick();
        step++;
        if (step < eventData.steps.length) {
          renderStep();
        } else {
          this.closeCurrentModal();
          sound.playVictory();
          // Advance quest to Chapter 4 (七顆水晶的秘密)
          this.game.currentQuestIndex = Math.max(this.game.currentQuestIndex, 4);
          this.game.coins += 300;
          this.game.addItem('fire_stone', 3);
          const cSec = SECRET_ARCHIVES.find(s => s.id === 'sec_character');
          if (cSec) cSec.unlocked = true;
          const aSec = SECRET_ARCHIVES.find(s => s.id === 'sec_ancient');
          if (aSec) aSec.unlocked = true;
          this.updateHUD();
          this.showToast('🌟【三條故事正式合併！】星月、夜影、晨曦結成同盟，七顆水晶的秘密正式解開！', 6000);
        }
      });
    };

    renderStep();
  }

  // ==========================================
  // 👗 1:1 時裝衣櫥系統 (Wardrobe Modal - Image 4)
  // ==========================================
  openWardrobeModal() {
    this.openModal('modal-wardrobe');
    this.tempWardrobe = { ...this.game.customConfig };
    this.renderWardrobeMirror();
  }

  renderWardrobeMirror() {
    // Current Character Preview Box
    const char = CHARACTERS[this.game.characterId] || CHARACTERS['xingyue'];
    const mirrorCharEl = document.getElementById('wardrobe-mirror-portrait');
    if (mirrorCharEl) {
      mirrorCharEl.src = char.portrait;
    }

    // Name Input
    const nameInput = document.getElementById('wardrobe-input-name');
    if (nameInput) {
      nameInput.value = this.tempWardrobe.name || this.game.playerName || char.name;
    }

    // Category Tabs Left
    document.querySelectorAll('.wardrobe-cat-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.cat === this.currentWardrobeTab);
      tab.onclick = () => {
        sound.playClick();
        this.currentWardrobeTab = tab.dataset.cat;
        document.querySelectorAll('.wardrobe-cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderWardrobeItemsList();
    // Mirror Click Event
    const interactiveMirror = document.getElementById('wardrobe-interactive-mirror');
    const speechEl = document.getElementById('wardrobe-char-speech');
    if (interactiveMirror) {
      interactiveMirror.onclick = () => {
        sound.playFanfare();
        interactiveMirror.classList.add('mirror-glow-pulse');
        setTimeout(() => interactiveMirror.classList.remove('mirror-glow-pulse'), 800);

        for (let i = 0; i < 8; i++) {
          const star = document.createElement('div');
          star.className = 'mirror-star-fly';
          star.innerText = '✨';
          const angle = (i / 8) * Math.PI * 2;
          const dist = 60 + Math.random() * 40;
          star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
          interactiveMirror.appendChild(star);
          setTimeout(() => star.remove(), 800);
        }

        const mirrorQuotes = {
          xingyue: [
            '「在穿衣鏡前照了照，星語神殿的法袍今天也格外合身呢！」',
            '「星光微芒在鏡面中閃耀……今天的冒險也一定會順利的！」',
            '「這套時裝很適合引導星宿魔法，感覺魔力更加流暢了。」'
          ],
          yeying: [
            '「這面鏡子擦得很乾淨。暗影游俠的斗篷不能有一絲破綻。」',
            '「隨時檢查裝備是巡林者的基本功，很靈活的剪裁。」',
            '「在月光與鏡像中隱匿身形……出發吧。」'
          ],
          chenxi: [
            '「哇～花之桂冠在鏡子裡好漂亮！森林的精靈們一定會喜歡的！」',
            '「鏡子裡的我看起來很有精神！今天也要好好照顧所有的魔寵！」',
            '「綠意的連衣裙最舒服了，隨時可以為大家施展生命祝福！」'
          ]
        };
        const quotes = mirrorQuotes[this.game.characterId] || mirrorQuotes.xingyue;
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        if (speechEl) {
          speechEl.innerText = `${char.name}：${q}`;
          speechEl.style.display = 'block';
        }
        this.showToast(`✨ ${char.name} 照了照鏡子：${q}`);
      };
    }
      };
    });

    this.renderWardrobeItemsList();
    // Mirror Click Event
    const interactiveMirror = document.getElementById('wardrobe-interactive-mirror');
    const speechEl = document.getElementById('wardrobe-char-speech');
    if (interactiveMirror) {
      interactiveMirror.onclick = () => {
        sound.playFanfare();
        interactiveMirror.classList.add('mirror-glow-pulse');
        setTimeout(() => interactiveMirror.classList.remove('mirror-glow-pulse'), 800);

        for (let i = 0; i < 8; i++) {
          const star = document.createElement('div');
          star.className = 'mirror-star-fly';
          star.innerText = '✨';
          const angle = (i / 8) * Math.PI * 2;
          const dist = 60 + Math.random() * 40;
          star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
          interactiveMirror.appendChild(star);
          setTimeout(() => star.remove(), 800);
        }

        const mirrorQuotes = {
          xingyue: [
            '「在穿衣鏡前照了照，星語神殿的法袍今天也格外合身呢！」',
            '「星光微芒在鏡面中閃耀……今天的冒險也一定會順利的！」',
            '「這套時裝很適合引導星宿魔法，感覺魔力更加流暢了。」'
          ],
          yeying: [
            '「這面鏡子擦得很乾淨。暗影游俠的斗篷不能有一絲破綻。」',
            '「隨時檢查裝備是巡林者的基本功，很靈活的剪裁。」',
            '「在月光與鏡像中隱匿身形……出發吧。」'
          ],
          chenxi: [
            '「哇～花之桂冠在鏡子裡好漂亮！森林的精靈們一定會喜歡的！」',
            '「鏡子裡的我看起來很有精神！今天也要好好照顧所有的魔寵！」',
            '「綠意的連衣裙最舒服了，隨時可以為大家施展生命祝福！」'
          ]
        };
        const quotes = mirrorQuotes[this.game.characterId] || mirrorQuotes.xingyue;
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        if (speechEl) {
          speechEl.innerText = `${char.name}：${q}`;
          speechEl.style.display = 'block';
        }
        this.showToast(`✨ ${char.name} 照了照鏡子：${q}`);
      };
    }

    // Bottom Action Buttons
    document.getElementById('btn-wardrobe-save').onclick = () => {
      sound.playVictory();
      this.tempWardrobe.name = nameInput.value.trim() || char.name;
      this.game.playerName = this.tempWardrobe.name;
      this.game.customConfig = { ...this.tempWardrobe };
      this.game.rebuildPlayerAvatar();
      this.updateHUD();
      this.closeCurrentModal();
      this.showToast('✨ 時裝裝扮與個人設定已成功保存！');
    };

    document.getElementById('btn-wardrobe-reset').onclick = () => {
      sound.playClick();
      this.tempWardrobe = { ...char.defaultCustom, name: char.name };
      this.renderWardrobeMirror();
      this.showToast('已還原為該角色預設外觀！');
    };
  }

  renderWardrobeItemsList() {
    const listEl = document.getElementById('wardrobe-items-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (this.currentWardrobeTab === 'outfits') {
      WARDROBE_ITEMS.outfits.forEach(outfit => {
        const isEquipped = (this.tempWardrobe.outfit === outfit.id);
        const card = document.createElement('div');
        card.className = `wardrobe-item-card ${isEquipped ? 'equipped' : ''}`;
        card.innerHTML = `
          <div class="w-item-icon" style="color:${outfit.color}">${outfit.icon}</div>
          <div class="w-item-info">
            <div class="w-item-title">${outfit.name}</div>
            <div class="w-item-desc">${outfit.desc}</div>
          </div>
          <span class="w-status-badge">${isEquipped ? '裝備中' : '更換'}</span>
        `;
        card.onclick = () => {
          sound.playClick();
          this.tempWardrobe.outfit = outfit.id;
          this.renderWardrobeItemsList();
    // Mirror Click Event
    const interactiveMirror = document.getElementById('wardrobe-interactive-mirror');
    const speechEl = document.getElementById('wardrobe-char-speech');
    if (interactiveMirror) {
      interactiveMirror.onclick = () => {
        sound.playFanfare();
        interactiveMirror.classList.add('mirror-glow-pulse');
        setTimeout(() => interactiveMirror.classList.remove('mirror-glow-pulse'), 800);

        for (let i = 0; i < 8; i++) {
          const star = document.createElement('div');
          star.className = 'mirror-star-fly';
          star.innerText = '✨';
          const angle = (i / 8) * Math.PI * 2;
          const dist = 60 + Math.random() * 40;
          star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
          interactiveMirror.appendChild(star);
          setTimeout(() => star.remove(), 800);
        }

        const mirrorQuotes = {
          xingyue: [
            '「在穿衣鏡前照了照，星語神殿的法袍今天也格外合身呢！」',
            '「星光微芒在鏡面中閃耀……今天的冒險也一定會順利的！」',
            '「這套時裝很適合引導星宿魔法，感覺魔力更加流暢了。」'
          ],
          yeying: [
            '「這面鏡子擦得很乾淨。暗影游俠的斗篷不能有一絲破綻。」',
            '「隨時檢查裝備是巡林者的基本功，很靈活的剪裁。」',
            '「在月光與鏡像中隱匿身形……出發吧。」'
          ],
          chenxi: [
            '「哇～花之桂冠在鏡子裡好漂亮！森林的精靈們一定會喜歡的！」',
            '「鏡子裡的我看起來很有精神！今天也要好好照顧所有的魔寵！」',
            '「綠意的連衣裙最舒服了，隨時可以為大家施展生命祝福！」'
          ]
        };
        const quotes = mirrorQuotes[this.game.characterId] || mirrorQuotes.xingyue;
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        if (speechEl) {
          speechEl.innerText = `${char.name}：${q}`;
          speechEl.style.display = 'block';
        }
        this.showToast(`✨ ${char.name} 照了照鏡子：${q}`);
      };
    }
        };
        listEl.appendChild(card);
      });
    } else if (this.currentWardrobeTab === 'hairStyles') {
      WARDROBE_ITEMS.hairStyles.forEach(h => {
        const isEquipped = (this.tempWardrobe.hairStyle === h.id);
        const card = document.createElement('div');
        card.className = `wardrobe-item-card ${isEquipped ? 'equipped' : ''}`;
        card.innerHTML = `
          <div class="w-item-icon">${h.icon}</div>
          <div class="w-item-info">
            <div class="w-item-title">${h.name}</div>
            <div class="w-item-desc">${h.desc}</div>
          </div>
          <span class="w-status-badge">${isEquipped ? '裝備中' : '修剪'}</span>
        `;
        card.onclick = () => {
          sound.playClick();
          this.tempWardrobe.hairStyle = h.id;
          this.renderWardrobeItemsList();
    // Mirror Click Event
    const interactiveMirror = document.getElementById('wardrobe-interactive-mirror');
    const speechEl = document.getElementById('wardrobe-char-speech');
    if (interactiveMirror) {
      interactiveMirror.onclick = () => {
        sound.playFanfare();
        interactiveMirror.classList.add('mirror-glow-pulse');
        setTimeout(() => interactiveMirror.classList.remove('mirror-glow-pulse'), 800);

        for (let i = 0; i < 8; i++) {
          const star = document.createElement('div');
          star.className = 'mirror-star-fly';
          star.innerText = '✨';
          const angle = (i / 8) * Math.PI * 2;
          const dist = 60 + Math.random() * 40;
          star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
          interactiveMirror.appendChild(star);
          setTimeout(() => star.remove(), 800);
        }

        const mirrorQuotes = {
          xingyue: [
            '「在穿衣鏡前照了照，星語神殿的法袍今天也格外合身呢！」',
            '「星光微芒在鏡面中閃耀……今天的冒險也一定會順利的！」',
            '「這套時裝很適合引導星宿魔法，感覺魔力更加流暢了。」'
          ],
          yeying: [
            '「這面鏡子擦得很乾淨。暗影游俠的斗篷不能有一絲破綻。」',
            '「隨時檢查裝備是巡林者的基本功，很靈活的剪裁。」',
            '「在月光與鏡像中隱匿身形……出發吧。」'
          ],
          chenxi: [
            '「哇～花之桂冠在鏡子裡好漂亮！森林的精靈們一定會喜歡的！」',
            '「鏡子裡的我看起來很有精神！今天也要好好照顧所有的魔寵！」',
            '「綠意的連衣裙最舒服了，隨時可以為大家施展生命祝福！」'
          ]
        };
        const quotes = mirrorQuotes[this.game.characterId] || mirrorQuotes.xingyue;
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        if (speechEl) {
          speechEl.innerText = `${char.name}：${q}`;
          speechEl.style.display = 'block';
        }
        this.showToast(`✨ ${char.name} 照了照鏡子：${q}`);
      };
    }
        };
        listEl.appendChild(card);
      });
    } else if (this.currentWardrobeTab === 'hairColors') {
      const swatchGrid = document.createElement('div');
      swatchGrid.className = 'color-swatch-grid';
      WARDROBE_ITEMS.hairColors.forEach(c => {
        const isSelected = (this.tempWardrobe.hairColor === c.color);
        const swatch = document.createElement('div');
        swatch.className = `color-swatch-btn ${isSelected ? 'selected' : ''}`;
        swatch.style.background = c.color;
        swatch.title = c.name;
        swatch.innerHTML = `<span>${c.name}</span>`;
        swatch.onclick = () => {
          sound.playClick();
          this.tempWardrobe.hairColor = c.color;
          this.renderWardrobeItemsList();
    // Mirror Click Event
    const interactiveMirror = document.getElementById('wardrobe-interactive-mirror');
    const speechEl = document.getElementById('wardrobe-char-speech');
    if (interactiveMirror) {
      interactiveMirror.onclick = () => {
        sound.playFanfare();
        interactiveMirror.classList.add('mirror-glow-pulse');
        setTimeout(() => interactiveMirror.classList.remove('mirror-glow-pulse'), 800);

        for (let i = 0; i < 8; i++) {
          const star = document.createElement('div');
          star.className = 'mirror-star-fly';
          star.innerText = '✨';
          const angle = (i / 8) * Math.PI * 2;
          const dist = 60 + Math.random() * 40;
          star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
          interactiveMirror.appendChild(star);
          setTimeout(() => star.remove(), 800);
        }

        const mirrorQuotes = {
          xingyue: [
            '「在穿衣鏡前照了照，星語神殿的法袍今天也格外合身呢！」',
            '「星光微芒在鏡面中閃耀……今天的冒險也一定會順利的！」',
            '「這套時裝很適合引導星宿魔法，感覺魔力更加流暢了。」'
          ],
          yeying: [
            '「這面鏡子擦得很乾淨。暗影游俠的斗篷不能有一絲破綻。」',
            '「隨時檢查裝備是巡林者的基本功，很靈活的剪裁。」',
            '「在月光與鏡像中隱匿身形……出發吧。」'
          ],
          chenxi: [
            '「哇～花之桂冠在鏡子裡好漂亮！森林的精靈們一定會喜歡的！」',
            '「鏡子裡的我看起來很有精神！今天也要好好照顧所有的魔寵！」',
            '「綠意的連衣裙最舒服了，隨時可以為大家施展生命祝福！」'
          ]
        };
        const quotes = mirrorQuotes[this.game.characterId] || mirrorQuotes.xingyue;
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        if (speechEl) {
          speechEl.innerText = `${char.name}：${q}`;
          speechEl.style.display = 'block';
        }
        this.showToast(`✨ ${char.name} 照了照鏡子：${q}`);
      };
    }
        };
        swatchGrid.appendChild(swatch);
      });
      listEl.appendChild(swatchGrid);
    } else if (this.currentWardrobeTab === 'eyeColors') {
      const swatchGrid = document.createElement('div');
      swatchGrid.className = 'color-swatch-grid';
      WARDROBE_ITEMS.eyeColors.forEach(e => {
        const isSelected = (this.tempWardrobe.eyeColor === e.color);
        const swatch = document.createElement('div');
        swatch.className = `color-swatch-btn ${isSelected ? 'selected' : ''}`;
        swatch.style.background = e.color;
        swatch.title = e.name;
        swatch.innerHTML = `<span>${e.name}</span>`;
        swatch.onclick = () => {
          sound.playClick();
          this.tempWardrobe.eyeColor = e.color;
          this.renderWardrobeItemsList();
    // Mirror Click Event
    const interactiveMirror = document.getElementById('wardrobe-interactive-mirror');
    const speechEl = document.getElementById('wardrobe-char-speech');
    if (interactiveMirror) {
      interactiveMirror.onclick = () => {
        sound.playFanfare();
        interactiveMirror.classList.add('mirror-glow-pulse');
        setTimeout(() => interactiveMirror.classList.remove('mirror-glow-pulse'), 800);

        for (let i = 0; i < 8; i++) {
          const star = document.createElement('div');
          star.className = 'mirror-star-fly';
          star.innerText = '✨';
          const angle = (i / 8) * Math.PI * 2;
          const dist = 60 + Math.random() * 40;
          star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
          interactiveMirror.appendChild(star);
          setTimeout(() => star.remove(), 800);
        }

        const mirrorQuotes = {
          xingyue: [
            '「在穿衣鏡前照了照，星語神殿的法袍今天也格外合身呢！」',
            '「星光微芒在鏡面中閃耀……今天的冒險也一定會順利的！」',
            '「這套時裝很適合引導星宿魔法，感覺魔力更加流暢了。」'
          ],
          yeying: [
            '「這面鏡子擦得很乾淨。暗影游俠的斗篷不能有一絲破綻。」',
            '「隨時檢查裝備是巡林者的基本功，很靈活的剪裁。」',
            '「在月光與鏡像中隱匿身形……出發吧。」'
          ],
          chenxi: [
            '「哇～花之桂冠在鏡子裡好漂亮！森林的精靈們一定會喜歡的！」',
            '「鏡子裡的我看起來很有精神！今天也要好好照顧所有的魔寵！」',
            '「綠意的連衣裙最舒服了，隨時可以為大家施展生命祝福！」'
          ]
        };
        const quotes = mirrorQuotes[this.game.characterId] || mirrorQuotes.xingyue;
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        if (speechEl) {
          speechEl.innerText = `${char.name}：${q}`;
          speechEl.style.display = 'block';
        }
        this.showToast(`✨ ${char.name} 照了照鏡子：${q}`);
      };
    }
        };
        swatchGrid.appendChild(swatch);
      });
      listEl.appendChild(swatchGrid);
    } else if (this.currentWardrobeTab === 'headwears') {
      WARDROBE_ITEMS.headwears.forEach(hw => {
        const isEquipped = (this.tempWardrobe.headwear === hw.id);
        const card = document.createElement('div');
        card.className = `wardrobe-item-card ${isEquipped ? 'equipped' : ''}`;
        card.innerHTML = `
          <div class="w-item-icon">${hw.icon}</div>
          <div class="w-item-info">
            <div class="w-item-title">${hw.name}</div>
          </div>
          <span class="w-status-badge">${isEquipped ? '佩戴中' : '配戴'}</span>
        `;
        card.onclick = () => {
          sound.playClick();
          this.tempWardrobe.headwear = hw.id;
          this.renderWardrobeItemsList();
    // Mirror Click Event
    const interactiveMirror = document.getElementById('wardrobe-interactive-mirror');
    const speechEl = document.getElementById('wardrobe-char-speech');
    if (interactiveMirror) {
      interactiveMirror.onclick = () => {
        sound.playFanfare();
        interactiveMirror.classList.add('mirror-glow-pulse');
        setTimeout(() => interactiveMirror.classList.remove('mirror-glow-pulse'), 800);

        for (let i = 0; i < 8; i++) {
          const star = document.createElement('div');
          star.className = 'mirror-star-fly';
          star.innerText = '✨';
          const angle = (i / 8) * Math.PI * 2;
          const dist = 60 + Math.random() * 40;
          star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
          star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
          interactiveMirror.appendChild(star);
          setTimeout(() => star.remove(), 800);
        }

        const mirrorQuotes = {
          xingyue: [
            '「在穿衣鏡前照了照，星語神殿的法袍今天也格外合身呢！」',
            '「星光微芒在鏡面中閃耀……今天的冒險也一定會順利的！」',
            '「這套時裝很適合引導星宿魔法，感覺魔力更加流暢了。」'
          ],
          yeying: [
            '「這面鏡子擦得很乾淨。暗影游俠的斗篷不能有一絲破綻。」',
            '「隨時檢查裝備是巡林者的基本功，很靈活的剪裁。」',
            '「在月光與鏡像中隱匿身形……出發吧。」'
          ],
          chenxi: [
            '「哇～花之桂冠在鏡子裡好漂亮！森林的精靈們一定會喜歡的！」',
            '「鏡子裡的我看起來很有精神！今天也要好好照顧所有的魔寵！」',
            '「綠意的連衣裙最舒服了，隨時可以為大家施展生命祝福！」'
          ]
        };
        const quotes = mirrorQuotes[this.game.characterId] || mirrorQuotes.xingyue;
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        if (speechEl) {
          speechEl.innerText = `${char.name}：${q}`;
          speechEl.style.display = 'block';
        }
        this.showToast(`✨ ${char.name} 照了照鏡子：${q}`);
      };
    }
        };
        listEl.appendChild(card);
      });
    }
  }

  // ==========================================
  // 📜 主線任務與自由探索 (Quest Modal)
  // ==========================================
  openQuestModal() {
    this.openModal('modal-quest');
    const container = document.getElementById('quest-content-body');
    if (!container) return;

    container.innerHTML = `
      <div class="quest-view-tabs">
        <button id="tab-btn-main-quests" class="quest-tab-btn active">📜 主線劇情全章節 (8大篇章)</button>
        <button id="tab-btn-free-roam" class="quest-tab-btn">🗺️ 自由探索模式指南 (7大玩法)</button>
      </div>

      <div id="quest-view-main-content">
        <div class="quest-list-scroll">
          ${MAIN_QUESTS.map((q, idx) => {
            const isDone = (idx < this.game.currentQuestIndex);
            const isCurrent = (idx === this.game.currentQuestIndex);
            const isMergeChapter = (q.id === 'quest_3');
            return `
              <div class="quest-card ${isDone ? 'done' : (isCurrent ? 'active' : 'locked')}">
                <div class="quest-header">
                  <span class="quest-chap">${q.chapter}</span>
                  <span class="quest-state">${isDone ? '✅ 已完成' : (isCurrent ? '📍 進行中' : '🔒 未解鎖')}</span>
                </div>
                <h3 class="quest-title">${q.title}</h3>
                <p class="quest-desc">${q.desc}</p>
                <div class="quest-dialog-quote">${q.dialog}</div>
                <div class="quest-rewards">
                  <strong>章節獎勵：</strong> 🪙 ${q.reward.coins} 金幣、⭐ ${q.reward.exp} EXP
                  ${q.reward.item ? `、🎁 獲得道具 x${q.reward.count}` : ''}
                </div>
                ${isCurrent && isMergeChapter ? `
                  <button id="btn-quest-trigger-merge" class="anime-btn success-glow" style="margin-top:10px; width:100%;">
                    🔥 前往炎龍火山古代神殿（觸發三使者相遇與故事合併奇遇！）✨
                  </button>
                ` : ''}
                ${isCurrent && !isMergeChapter ? `
                  <button class="anime-btn primary-glow btn-quest-advance" data-idx="${idx}" style="margin-top:10px; width:100%;">
                    ⚡ 達成當前試煉並推進主線 ➔
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div id="quest-view-roam-content" style="display:none;">
        <div class="free-roam-header-box">
          <h3>🗺️ 自由探索模式（隨時自由冒險）</h3>
          <p>即使不推進主線任務，玩家依然可以不受限制地在各大板塊深度探索，享受魔寵養成與發現隱藏奇遇的樂趣：</p>
        </div>
        <div class="free-roam-grid-cards">
          ${FREE_ROAM_FEATURES.map(f => `
            <div class="free-roam-card">
              <div class="fr-icon">${f.icon}</div>
              <div class="fr-info">
                <h4>${f.title}</h4>
                <p>${f.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Tab switching
    const btnMainTab = document.getElementById('tab-btn-main-quests');
    const btnRoamTab = document.getElementById('tab-btn-free-roam');
    const viewMain = document.getElementById('quest-view-main-content');
    const viewRoam = document.getElementById('quest-view-roam-content');

    btnMainTab?.addEventListener('click', () => {
      sound.playClick();
      btnMainTab.classList.add('active');
      btnRoamTab.classList.remove('active');
      viewMain.style.display = 'block';
      viewRoam.style.display = 'none';
    });

    btnRoamTab?.addEventListener('click', () => {
      sound.playClick();
      btnRoamTab.classList.add('active');
      btnMainTab.classList.remove('active');
      viewMain.style.display = 'none';
      viewRoam.style.display = 'block';
    });

    // Merge Event Button
    document.getElementById('btn-quest-trigger-merge')?.addEventListener('click', () => {
      sound.playClick();
      this.closeCurrentModal();
      this.openMergeStoryCutscene();
    });

    // Advance Quest Button
    document.querySelectorAll('.btn-quest-advance').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playVictory();
        const currentQ = MAIN_QUESTS[this.game.currentQuestIndex];
        this.game.coins += currentQ.reward.coins;
        if (currentQ.reward.item) {
          this.game.addItem(currentQ.reward.item, currentQ.reward.count || 1);
        }
        this.game.currentQuestIndex++;
        this.updateHUD();
        this.showToast(`🎉 成功完成【${currentQ.chapter}：${currentQ.title}】！`);
        this.openQuestModal();
      });
    });
  }

  // ==========================================
  // 🗝️ 五大隱藏秘密檔案館 (Secrets Modal)
  // ==========================================
  openSecretsModal() {
    this.openModal('modal-secrets');
    const listEl = document.getElementById('secrets-grid-list');
    if (!listEl) return;

    listEl.innerHTML = SECRET_ARCHIVES.map(sec => {
      return `
        <div class="secret-archive-card ${sec.unlocked ? 'unlocked' : 'locked'}">
          <div class="sec-cat-tag">${sec.icon} ${sec.category}</div>
          <h3 class="sec-title">${sec.unlocked ? sec.title : '？？？【未解開的禁忌記憶】'}</h3>
          <p class="sec-desc">${sec.unlocked ? sec.desc : '此秘密尚未被發現。'}</p>
          <div class="sec-clue">🔍 線索提示：${sec.clue}</div>
        </div>
      `;
    }).join('');
  }

  // ==========================================
  // 🥚 1. 孵化室 (Hatchery Modal)
  // ==========================================
  openHatchModal() {
    this.openModal('modal-hatch');
    this.renderHatchEggs();
  }

  renderHatchEggs() {
    const listEl = document.getElementById('hatch-egg-list');
    const standEl = document.getElementById('hatch-stand-view');
    if (!listEl) return;
    listEl.innerHTML = '';

    const eggItems = EGG_TYPES.filter(e => (this.game.inventory[e.id] || 0) > 0);

    if (eggItems.length === 0) {
      listEl.innerHTML = '<div class="empty-hint">背包中暫無魔寵蛋<br>前往野外探索可採集野生魔寵蛋窩 🥚！</div>';
      if (standEl) standEl.innerHTML = '<div class="stand-placeholder">請先在左側選取魔寵蛋</div>';
      return;
    }

    eggItems.forEach((egg, idx) => {
      const count = this.game.inventory[egg.id];
      const card = document.createElement('div');
      card.className = 'anime-card egg-card';
      card.innerHTML = `
        <div class="egg-icon" style="text-shadow: 0 0 10px ${egg.color}">${egg.icon}</div>
        <div class="egg-title">${egg.name}</div>
        <div class="egg-count">持有：${count} 個</div>
      `;
      card.addEventListener('click', () => {
        this.selectEggForHatching(egg);
      });
      listEl.appendChild(card);

      if (idx === 0 && standEl && !standEl.hasSelected) {
        this.selectEggForHatching(egg);
      }
    });
  }

  selectEggForHatching(egg) {
    const standEl = document.getElementById('hatch-stand-view');
    if (!standEl) return;
    standEl.hasSelected = true;

    standEl.innerHTML = `
      <div class="incubator-pod">
        <div id="incubator-egg" class="incubating-egg" style="color: ${egg.color}">${egg.icon}</div>
        <div class="pod-light" style="background: radial-gradient(circle, ${egg.color} 0%, transparent 70%)"></div>
      </div>
      <h3 style="color:${egg.color}; margin-top:15px;">${egg.name}</h3>
      <p style="color:#cbd5e1; font-size:13px; margin-bottom:15px;">溫暖的魔力之泉正在滋潤蛋殼中的幼小生命...</p>
      <button id="btn-start-hatch" class="anime-btn primary-glow">✨ 開始破殼孵化</button>
    `;

    document.getElementById('btn-start-hatch')?.addEventListener('click', () => {
      this.doHatchAnimation(egg);
    });
  }

  doHatchAnimation(egg) {
    if ((this.game.inventory[egg.id] || 0) <= 0) return;
    this.game.inventory[egg.id]--;

    const eggEl = document.getElementById('incubator-egg');
    const btn = document.getElementById('btn-start-hatch');
    if (btn) btn.disabled = true;

    eggEl.classList.add('wobble');
    sound.playHatchCrack();

    setTimeout(() => {
      sound.playHatchCrack();
      eggEl.classList.add('cracking');
    }, 900);

    setTimeout(() => {
      sound.playHatchSuccess();
      eggEl.classList.add('burst');

      const randomSpeciesId = egg.pool[Math.floor(Math.random() * egg.pool.length)];
      const newPet = this.game.addNewPet(randomSpeciesId);

      this.showHatchResultCard(newPet);
      this.renderHatchEggs();
      this.updateHUD();
    }, 1800);
  }

  showHatchResultCard(petInstance) {
    const standEl = document.getElementById('hatch-stand-view');
    if (!standEl) return;

    const spec = PET_SPECIES[petInstance.speciesId];
    const elem = ELEMENTS[spec.element];
    const rar = RARITIES[spec.rarity];

    standEl.innerHTML = `
      <div class="hatch-result-splash">
        <div class="result-banner" style="background: ${rar.color}; box-shadow: 0 0 20px ${rar.color}">
          ★ ${rar.name} 稀有度 ★
        </div>
        <div class="result-avatar-glow" style="border-color:${elem.color}">
          <span style="font-size:72px;">${spec.icon}</span>
        </div>
        <h2 style="color:#fff; margin:10px 0 4px 0;">${spec.name}</h2>
        <div class="badge-tag" style="background:${elem.color}">${elem.icon} ${elem.name}屬性</div>
        <p style="color:#cbd5e1; font-size:13px; max-width:320px; margin:10px auto;">
          "${spec.desc}"
        </p>
        <div class="stat-mini-row">
          <span>❤️ 生命: ${petInstance.maxHp}</span>
          <span>⚔️ 攻擊: ${petInstance.atk}</span>
          <span>🛡️ 防禦: ${petInstance.def}</span>
        </div>
        <button id="btn-hatch-confirm" class="anime-btn success-glow" style="margin-top:15px;">🌟 歡迎加入夥伴！</button>
      </div>
    `;

    document.getElementById('btn-hatch-confirm')?.addEventListener('click', () => {
      sound.playClick();
      this.renderHatchEggs();
    });
  }

  // ==========================================
  // 🍎 2. 養成撫摸面板 (Care Modal)
  // ==========================================
  openCareModal() {
    this.openModal('modal-care');
    this.renderCarePanel();
  }

  renderCarePanel() {
    const pet = this.game.getActivePet();
    if (!pet) return;

    const spec = PET_SPECIES[pet.speciesId] || {};
    const elem = ELEMENTS[spec.element] || { color: '#f59e0b', name: '元素', icon: '✨' };

    const avatarEl = document.getElementById('care-pet-avatar');
    const nameEl = document.getElementById('care-pet-name');
    const badgeEl = document.getElementById('care-pet-badge');
    const touchBtn = document.getElementById('btn-pet-touch');

    const hpValEl = document.getElementById('care-hp-val');
    const hpBarEl = document.getElementById('care-hp-bar');
    const satValEl = document.getElementById('care-satiety-val');
    const satBarEl = document.getElementById('care-satiety-bar');
    const affValEl = document.getElementById('care-affection-val');
    const affBarEl = document.getElementById('care-affection-bar');
    const expValEl = document.getElementById('care-exp-val');
    const expBarEl = document.getElementById('care-exp-bar');

    if (avatarEl) avatarEl.innerText = spec.icon || '🦊';
    if (nameEl) nameEl.innerText = pet.customName || spec.name || '魔寵夥伴';
    if (badgeEl) {
      badgeEl.innerText = `Lv.${pet.level} · ${elem.icon} ${elem.name}屬性 (${spec.title || '守護魔寵'})`;
      if (elem.color) {
        badgeEl.style.borderColor = elem.color;
        badgeEl.style.color = elem.color;
      }
    }

    // 1. 生命值 HP
    const curHp = Math.round(pet.currentHp !== undefined ? pet.currentHp : pet.maxHp);
    const maxHp = Math.round(pet.maxHp || 120);
    const hpPct = Math.max(0, Math.min(100, (curHp / maxHp) * 100));
    if (hpValEl) hpValEl.innerText = `${curHp} / ${maxHp}`;
    if (hpBarEl) hpBarEl.style.width = `${hpPct}%`;

    // 2. 飽食度 Satiety
    const satVal = Math.max(0, Math.min(100, Math.round(pet.satiety !== undefined ? pet.satiety : 85)));
    if (satValEl) satValEl.innerText = `${satVal} / 100`;
    if (satBarEl) satBarEl.style.width = `${satVal}%`;

    // 3. 親密度 Affection
    const affVal = Math.max(0, Math.min(100, Math.round(pet.affection !== undefined ? pet.affection : 50)));
    if (affValEl) affValEl.innerText = `${affVal} / 100`;
    if (affBarEl) affBarEl.style.width = `${affVal}%`;

    // 4. 經驗值 EXP
    const nextExp = (pet.level || 1) * 60;
    const curExp = Math.max(0, Math.round(pet.exp || 0));
    const expPct = Math.max(0, Math.min(100, (curExp / nextExp) * 100));
    if (expValEl) expValEl.innerText = `${curExp} / ${nextExp}`;
    if (expBarEl) expBarEl.style.width = `${expPct}%`;

    // 🍓 餵食投餵清單 (包含野外果實、釣獲靈魚、美味烹飪料理、皇家點心)
    const foodListEl = document.getElementById('care-food-list');
    if (foodListEl) {
      foodListEl.innerHTML = '';
      const foods = CONSUMABLES.filter(c => c.satiety !== undefined || c.exp !== undefined);
      foods.forEach(food => {
        const count = this.game.inventory[food.id] || 0;
        const fBtn = document.createElement('button');
        fBtn.className = `food-item-btn ${count <= 0 ? 'disabled' : ''}`;
        fBtn.innerHTML = `
          <span class="food-icon">${food.icon}</span>
          <div class="food-info">
            <div class="food-name">${food.name} <strong style="color:${count > 0 ? '#facc15' : '#94a3b8'}; margin-left:4px;">(x${count})</strong></div>
            <div class="food-stats">+${food.satiety || 0}飽食 · +${food.affection || 0}親密 · +${food.exp || 0}EXP</div>
          </div>
        `;
        fBtn.addEventListener('click', () => {
          if (count > 0) {
            this.game.feedActivePet(food);
            this.renderCarePanel();
            this.updateHUD();
          } else {
            this.showToast(`【${food.name}】數量不足，可前往果園摘採或湖畔垂釣獲得！`);
          }
        });
        foodListEl.appendChild(fBtn);
      });
    }

    // ✋ 溫柔撫摸互動 (點擊頭像或撫摸按鈕)
    const handleTouch = (e) => {
      sound.playPetPet();
      pet.affection = Math.min(100, (pet.affection || 50) + 5);
      pet.currentHp = Math.min(pet.maxHp, (pet.currentHp || pet.maxHp) + 5);
      const leveledUp = pet.gainExp(8);

      const rect = (e.currentTarget || e.target).getBoundingClientRect();
      const clickX = e.clientX || (rect.left + rect.width / 2);
      const clickY = e.clientY || (rect.top + rect.height / 2);
      this.spawnHeartFloating(clickX, clickY);

      if (leveledUp) {
        sound.playVictory();
        this.showToast(`🎉 撫摸激發了潛能！${pet.customName} 升到了 Lv.${pet.level}！`);
        this.game.rebuildFollowerPets();
      } else {
        this.showToast(`💖 溫柔撫摸了 ${pet.customName}，親密度 +5，經驗 +8！`);
      }
      this.renderCarePanel();
      this.updateHUD();
    };

    if (touchBtn) {
      touchBtn.onclick = handleTouch;
    }
    if (avatarEl) {
      avatarEl.onclick = handleTouch;
      avatarEl.style.cursor = 'pointer';
    }

    // 🐾 隊伍名單與上陣選擇（身後三排九宮格陣容）
    const rosterListEl = document.getElementById('care-roster-list');
    if (rosterListEl) {
      rosterListEl.innerHTML = '';

      const deployedCount = this.game.getDeployedPets ? this.game.getDeployedPets().length : 1;
      const totalCount = this.game.pets.length;

      // Header summary & batch action bar
      const headerBar = document.createElement('div');
      headerBar.style.display = 'flex';
      headerBar.style.justifyContent = 'space-between';
      headerBar.style.alignItems = 'center';
      headerBar.style.marginBottom = '12px';
      headerBar.style.background = 'rgba(0, 0, 0, 0.3)';
      headerBar.style.padding = '8px 12px';
      headerBar.style.borderRadius = '10px';
      headerBar.style.border = '1px solid rgba(255, 255, 255, 0.08)';

      headerBar.innerHTML = `
        <div style="font-size:12px; color:#cbd5e1;">
          🚩 身後上陣：<strong style="color:#facc15; font-size:14px;">${deployedCount}</strong> / ${totalCount} 隻
          <span style="font-size:11px; color:#94a3b8; margin-left:4px;">(三排九宮格向後排隊)</span>
        </div>
        <div style="display:flex; gap:6px;">
          <button id="btn-deploy-all-roster" class="anime-btn primary-glow" style="font-size:11px; padding:4px 8px;">⚔️ 全員上陣</button>
          <button id="btn-deploy-leader-roster" class="anime-btn" style="font-size:11px; padding:4px 8px;">🐾 僅領隊</button>
        </div>
      `;
      rosterListEl.appendChild(headerBar);

      headerBar.querySelector('#btn-deploy-all-roster').addEventListener('click', (e) => {
        e.stopPropagation();
        this.game.deployAllPets();
      });
      headerBar.querySelector('#btn-deploy-leader-roster').addEventListener('click', (e) => {
        e.stopPropagation();
        this.game.deployOnlyLeader();
      });

      this.game.pets.forEach((p, idx) => {
        const pSpec = PET_SPECIES[p.speciesId] || {};
        const pElem = ELEMENTS[pSpec.element] || { color: '#38bdf8', icon: '✨', name: '全' };
        const isLeader = (idx === this.game.activePetIndex);
        const isDeployed = (p.deployed !== false);

        const card = document.createElement('div');
        card.className = `roster-slot-card ${isLeader ? 'active' : ''}`;
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.gap = '10px';
        card.style.padding = '8px 12px';
        card.style.borderRadius = '12px';
        card.style.marginBottom = '6px';
        card.style.cursor = 'pointer';
        card.style.background = isLeader ? 'rgba(56, 189, 248, 0.18)' : (isDeployed ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.35)');
        card.style.border = `1.5px solid ${isLeader ? pElem.color : (isDeployed ? 'rgba(250, 204, 21, 0.45)' : 'rgba(255, 255, 255, 0.08)')}`;
        card.style.opacity = isDeployed ? '1' : '0.65';

        card.innerHTML = `
          <div style="font-size:26px;">${pSpec.icon || '🐾'}</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:14px; color:#fff;">
              ${p.customName || pSpec.name}
              ${isLeader ? '<span style="color:#facc15; font-size:11px; margin-left:4px;">⭐ 領隊</span>' : ''}
            </div>
            <div style="font-size:11px; color:${pElem.color}">
              Lv.${p.level} • ${pElem.icon} ${pElem.name}
              <span style="margin-left:6px; color:${isDeployed ? '#4ade80' : '#94a3b8'}">
                ${isDeployed ? '● 上陣跟隨中 (身後九宮格)' : '○ 休息待命中'}
              </span>
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            ${!isLeader ? `
              <button class="btn-set-leader-item anime-btn" style="font-size:11px; padding:3px 7px; background:rgba(255,255,255,0.08);" title="設為出戰領隊">
                ⭐ 設領隊
              </button>
            ` : ''}
            <button class="btn-toggle-deploy-item anime-btn ${isDeployed ? 'primary-glow' : ''}" style="font-size:11px; padding:3px 8px; font-weight:700; background:${isDeployed ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.08)'}; border:1px solid ${isDeployed ? '#22c55e' : 'rgba(255,255,255,0.2)'}; color:${isDeployed ? '#86efac' : '#cbd5e1'};">
              ${isLeader ? '🔒 必上陣' : (isDeployed ? '⚔️ 上陣中' : '💤 休息中')}
            </button>
          </div>
        `;

        card.addEventListener('click', () => {
          sound.playClick();
          this.game.activePetIndex = idx;
          this.renderCarePanel();
          this.updateHUD();
        });

        const leaderBtn = card.querySelector('.btn-set-leader-item');
        if (leaderBtn) {
          leaderBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sound.playFanfare();
            this.game.activePetIndex = idx;
            p.deployed = true;
            this.game.rebuildFollowerPets();
            this.renderCarePanel();
            this.updateHUD();
            this.showToast(`⭐ 已設定【${p.customName || pSpec.name}】為領隊出戰魔寵！`);
          });
        }

        const deployBtn = card.querySelector('.btn-toggle-deploy-item');
        if (deployBtn && !isLeader) {
          deployBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.game.togglePetDeploy(idx);
          });
        }

        rosterListEl.appendChild(card);
      });

      // Quick Recruit Button inside Care Panel Roster
      const addMoreBtn = document.createElement('button');
      addMoreBtn.className = 'anime-btn primary-glow';
      addMoreBtn.style.width = '100%';
      addMoreBtn.style.marginTop = '10px';
      addMoreBtn.style.fontSize = '12px';
      addMoreBtn.style.padding = '8px 12px';
      addMoreBtn.innerHTML = '🐾 契約更多魔寵夥伴（自選上陣・無上限跟隨）➔';
      addMoreBtn.addEventListener('click', () => {
        sound.playClick();
        this.openStarterPetSelectModal();
      });
      rosterListEl.appendChild(addMoreBtn);
    }
  }

  spawnHeartFloating(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = '💖';
    heart.style.left = `${x - 15}px`;
    heart.style.top = `${y - 15}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }

  // ==========================================
  // 🧬 3. 進化神殿 (Evolution Modal)
  // ==========================================
  openEvolveModal() {
    this.openModal('modal-evolve');
    this.renderEvolvePanel();
  }

  renderEvolvePanel() {
    const pet = this.game.getActivePet();
    const panel = document.getElementById('evolve-content');
    if (!panel || !pet) return;

    const currentSpec = PET_SPECIES[pet.speciesId];
    if (!currentSpec.evolvesTo) {
      panel.innerHTML = `
        <div class="evolve-max-splash">
          <div style="font-size:72px;">👑 ${currentSpec.icon}</div>
          <h2 style="color:#facc15;">已達到究極形態！</h2>
          <p style="color:#cbd5e1;">${currentSpec.name} 已經達到神話至尊形態，掌控本系頂級奧義！</p>
        </div>
      `;
      return;
    }

    const nextSpec = PET_SPECIES[currentSpec.evolvesTo];
    const req = currentSpec.evolveReq;
    const reqStoneName = CONSUMABLES.find(c => c.id === req.stone)?.name || '進化石';
    const hasStoneCount = this.game.inventory[req.stone] || 0;

    const canEvolve = (pet.level >= req.level && hasStoneCount >= req.stoneCount);

    panel.innerHTML = `
      <div class="evolve-comparison">
        <div class="evolve-card current">
          <div class="evo-avatar">${currentSpec.icon}</div>
          <h4>${currentSpec.name}</h4>
          <span class="badge">Lv.${pet.level}</span>
        </div>
        <div class="evo-arrow">➡️</div>
        <div class="evolve-card next">
          <div class="evo-avatar glow">${nextSpec.icon}</div>
          <h4 style="color:#fde047;">${nextSpec.name}</h4>
          <span class="badge" style="background:#f59e0b;">${nextSpec.title}</span>
        </div>
      </div>

      <div class="evolve-requirements">
        <h3>進階進化需求</h3>
        <div class="req-item ${pet.level >= req.level ? 'ok' : 'fail'}">
          ${pet.level >= req.level ? '✅' : '❌'} 魔寵等級：Lv.${pet.level} / Lv.${req.level}
        </div>
        <div class="req-item ${hasStoneCount >= req.stoneCount ? 'ok' : 'fail'}">
          ${hasStoneCount >= req.stoneCount ? '✅' : '❌'} 消耗素材：${reqStoneName} (${hasStoneCount}/${req.stoneCount})
        </div>
      </div>

      <button id="btn-trigger-evolve" class="anime-btn ${canEvolve ? 'primary-glow' : 'disabled'}" style="margin-top:20px;">
        ✨ 啟動神殿進化儀式
      </button>
    `;

    document.getElementById('btn-trigger-evolve')?.addEventListener('click', () => {
      if (canEvolve) {
        this.doEvolutionAnimation(pet, currentSpec, nextSpec, req);
      } else {
        this.showToast('尚未滿足進化條件！請先提升等級或收集進化石！');
      }
    });
  }

  doEvolutionAnimation(pet, currentSpec, nextSpec, req) {
    sound.playEvolve();
    this.game.inventory[req.stone] -= req.stoneCount;

    const panel = document.getElementById('evolve-content');
    panel.innerHTML = `
      <div class="evolve-ceremony-vortex">
        <div class="magic-circle spin"></div>
        <div class="cosmic-glow"></div>
        <h2 style="color:#fde047; margin-top:20px;">魔力激盪！身形重塑中...</h2>
      </div>
    `;

    setTimeout(() => {
      pet.evolveTo(nextSpec.id);
      this.game.rebuildFollowerPet();
      this.updateHUD();

      sound.playVictory();
      this.showToast(`🎉 恭喜！${currentSpec.name} 成功進化為【${nextSpec.name}】！`);
      this.renderEvolvePanel();
    }, 2500);
  }

  // ==========================================
  // 📖 4. 魔寵圖鑑 (Bestiary Modal)
  // ==========================================
  openBookModal() {
    this.openModal('modal-book');
    this.renderBestiary();
  }

  renderBestiary() {
    const grid = document.getElementById('bestiary-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const allSpecies = Object.values(PET_SPECIES);
    const unlockedCount = allSpecies.filter(s => this.game.discoveredPets.has(s.id)).length;

    document.getElementById('bestiary-progress').innerText = `收集進度：${unlockedCount} / ${allSpecies.length} (${Math.round((unlockedCount / allSpecies.length) * 100)}%)`;

    allSpecies.forEach(spec => {
      const isUnlocked = this.game.discoveredPets.has(spec.id);
      const elem = ELEMENTS[spec.element];
      const rar = RARITIES[spec.rarity];

      const card = document.createElement('div');
      card.className = `bestiary-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="rarity-strip" style="background:${rar.color}"></div>
        <div class="b-avatar">${isUnlocked ? spec.icon : '❓'}</div>
        <div class="b-name">${isUnlocked ? spec.name : '？？？'}</div>
        <div class="b-elem" style="background:${elem.color}">${elem.icon} ${elem.name}</div>
      `;

      card.addEventListener('click', () => {
        if (isUnlocked) {
          this.showPetLoreDetail(spec);
        } else {
          this.showToast('該魔寵尚未發現，快去冒險地圖中探險孵化吧！');
        }
      });
      grid.appendChild(card);
    });
  }

  showPetLoreDetail(spec) {
    const elem = ELEMENTS[spec.element];
    const rar = RARITIES[spec.rarity];
    const detailEl = document.getElementById('bestiary-detail-box');
    if (!detailEl) return;

    detailEl.innerHTML = `
      <div class="detail-header" style="border-left: 5px solid ${rar.color}">
        <span style="font-size:42px;">${spec.icon}</span>
        <div>
          <h3>${spec.name} <span style="font-size:12px; color:${rar.color}">[${rar.name}]</span></h3>
          <span style="color:#94a3b8; font-size:12px;">${spec.title}</span>
        </div>
      </div>
      <p style="color:#e2e8f0; font-size:13px; line-height:1.6; margin:10px 0;">
        ${spec.desc}
      </p>
      <div class="detail-skill-box">
        <strong>⚡ 專屬技能：【${spec.skill.name}】</strong>
        <p style="font-size:12px; color:#cbd5e1; margin:4px 0;">${spec.skill.desc}</p>
      </div>
    `;
  }

  // ==========================================
  // 🗺️ 5. 世界地圖傳送 (World Map / Waypoint Modal)
  // ==========================================
  openMapModal() {
    this.openModal('modal-map');
    const container = document.getElementById('map-zones-grid') || document.getElementById('map-zones-container');
    if (!container) return;
    container.innerHTML = '';

    MAP_ZONES.forEach(zone => {
      const isCurrent = (this.game.world.currentZoneId === zone.id);
      const card = document.createElement('div');
      card.className = `map-zone-card ${isCurrent ? 'active' : ''}`;
      card.style.borderColor = zone.themeColor;
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="zone-icon" style="filter: drop-shadow(0 0 8px ${zone.themeColor})">${zone.icon}</div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="color:${zone.themeColor}; margin:0; font-size:16px;">${zone.name}</h3>
              <span class="waypoint-badge" style="background:${zone.themeColor}33; color:${zone.themeColor}; border:1px solid ${zone.themeColor}; font-size:10px; padding:2px 6px; border-radius:10px;">🌀 傳送石碑已激活</span>
            </div>
            <p style="margin:4px 0; font-size:12px; color:#cbd5e1; line-height:1.4;">${zone.desc}</p>
            <div class="zone-wild-preview" style="font-size:11px; color:#94a3b8;">🐾 出沒魔寵：${zone.wildSpirits.map(id => PET_SPECIES[id]?.name || id).join('、')}</div>
          </div>
        </div>
        <button class="anime-btn ${isCurrent ? 'disabled' : 'primary-glow'}" style="margin-top:8px; width:100%;">
          ${isCurrent ? '📍 當前位置 (駐留中)' : '🌀 啟動石碑・即刻躍遷'}
        </button>
      `;

      card.addEventListener('click', () => {
        if (!isCurrent) {
          this.game.teleportToZone(zone.id);
          this.closeCurrentModal();
        }
      });

      container.appendChild(card);
    });
  }

  // ==========================================
  // 🎒 6. 冒險背包 (Backpack Modal)
  // ==========================================
  openBagModal() {
    this.openModal('modal-bag');
    const grid = document.getElementById('inventory-grid') || document.getElementById('bag-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const allItems = [...CONSUMABLES, ...EGG_TYPES];
    allItems.forEach(item => {
      const count = this.game.inventory[item.id] || 0;
      const card = document.createElement('div');
      card.className = 'bag-slot-card';
      card.innerHTML = `
        <div class="slot-icon">${item.icon}</div>
        <div class="slot-name">${item.name}</div>
        <div class="slot-qty">x${count}</div>
      `;
      grid.appendChild(card);
    });
  }

  // ==========================================
  // ⚔️ 7. 魔寵對戰 (Battle Modal)
  // ==========================================
  openBattleModal(battle) {
    this.battleInstance = battle;
    this.openModal('modal-battle');
    this.updateBattleDisplay();

    const talkBtn = document.getElementById('btn-battle-talk');
    if (talkBtn) talkBtn.onclick = () => battle.playerAction('talk');
    const atkBtn = document.getElementById('btn-battle-atk');
    if (atkBtn) atkBtn.onclick = () => battle.playerAction('basic_attack');
    const skillBtn = document.getElementById('btn-battle-skill');
    if (skillBtn) skillBtn.onclick = () => battle.playerAction('skill');
    const itemBtn = document.getElementById('btn-battle-item');
    if (itemBtn) itemBtn.onclick = () => battle.playerAction('item');
    const runBtn = document.getElementById('btn-battle-run');
    if (runBtn) runBtn.onclick = () => battle.playerAction('escape');
  }

  updateBattleDisplay() {
    if (!this.battleInstance) return;
    const b = this.battleInstance;

    const pNameEl = document.getElementById('battle-player-name');
    if (pNameEl) pNameEl.innerText = `${b.playerPet.species.icon} ${b.playerPet.species.name} (Lv.${b.playerPet.level})`;
    const pHpText = document.getElementById('battle-player-hp-val');
    if (pHpText) pHpText.innerText = `${b.playerPet.hp}/${b.playerPet.maxHp}`;
    const pPct = Math.max(0, Math.min(100, (b.playerPet.hp / b.playerPet.maxHp) * 100));
    const pHpBar = document.getElementById('battle-player-hp-bar');
    if (pHpBar) pHpBar.style.width = `${pPct}%`;

    const eNameEl = document.getElementById('battle-enemy-name');
    if (eNameEl) eNameEl.innerText = `${b.enemyPet.species.icon} ${b.enemyPet.name} (Lv.${b.enemyPet.level})`;
    const eHpText = document.getElementById('battle-enemy-hp-val');
    if (eHpText) eHpText.innerText = `${b.enemyPet.hp}/${b.enemyPet.maxHp}`;
    const ePct = Math.max(0, Math.min(100, (b.enemyPet.hp / b.enemyPet.maxHp) * 100));
    const eHpBar = document.getElementById('battle-enemy-hp-bar');
    if (eHpBar) eHpBar.style.width = `${ePct}%`;

    // Smooth lagging ghost bars
    setTimeout(() => {
      const pGhost = document.getElementById('battle-player-hp-ghost');
      if (pGhost) pGhost.style.width = `${pPct}%`;
      const eGhost = document.getElementById('battle-enemy-hp-ghost');
      if (eGhost) eGhost.style.width = `${ePct}%`;
    }, 320);

    // Speech Quotes from Monster and Player Pet
    const enemySpeech = document.getElementById('battle-enemy-speech');
    if (enemySpeech) {
      enemySpeech.innerText = b.enemyQuote || '「嗷！不要靠近我！」';
      enemySpeech.style.display = 'block';
    }
    const playerSpeech = document.getElementById('battle-player-speech');
    if (playerSpeech) {
      playerSpeech.innerText = b.playerQuote || '「主人小心！我感受到了它體內的混亂濁氣！」';
      playerSpeech.style.display = 'block';
    }

    // Trust Heart Meter
    const trustFill = document.getElementById('battle-trust-fill');
    if (trustFill) trustFill.style.width = `${b.trustMeter || 0}%`;
    const trustVal = document.getElementById('battle-trust-val');
    if (trustVal) trustVal.innerText = `${b.trustMeter || 0}%`;

    const isTurn = b.isPlayerTurn && b.playerPet.hp > 0 && b.enemyPet.hp > 0;
    ['btn-battle-talk', 'btn-battle-atk', 'btn-battle-skill', 'btn-battle-item', 'btn-battle-run'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = !isTurn;
    });

    const skillBtn = document.getElementById('btn-battle-skill');
    if (skillBtn) {
      skillBtn.innerHTML = `⚡ 絕招：${b.playerPet.species.skill.name}`;
    }

    const logBox = document.getElementById('battle-log-ticker');
    if (logBox) {
      logBox.innerHTML = b.log.map(line => `<div class="log-line">${line}</div>`).join('');
    }
  }

  showUltimateCutIn(skillName, avatarIcon = '✨') {
    const cutin = document.getElementById('battle-cutin-overlay');
    const nameEl = document.getElementById('cutin-skill-name');
    const avatarEl = document.getElementById('cutin-char-avatar');
    if (!cutin) return;

    if (nameEl) nameEl.innerText = skillName;
    if (avatarEl) avatarEl.innerText = avatarIcon;

    cutin.style.display = 'flex';
    cutin.classList.remove('cutin-active');
    void cutin.offsetWidth; // trigger reflow
    cutin.classList.add('cutin-active');

    sound.playVictory();

    setTimeout(() => {
      cutin.style.display = 'none';
      cutin.classList.remove('cutin-active');
    }, 1100);
  }

  showFloatingBattleText(targetId, text, color = '#facc15') {
    const target = document.getElementById(targetId);
    const stage = document.querySelector('.battle-arena-stage');
    if (!target || !stage) return;

    const rect = target.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();

    const indicator = document.createElement('div');
    indicator.className = 'dmg-float-indicator';
    indicator.style.color = color;
    indicator.innerText = text;
    indicator.style.left = `${Math.max(10, (rect.left - stageRect.left) + 20)}px`;
    indicator.style.top = `${Math.max(10, (rect.top - stageRect.top))}px`;

    stage.appendChild(indicator);
    setTimeout(() => indicator.remove(), 1200);

    // Screen shake on hit
    stage.classList.add('battle-shake');
    setTimeout(() => stage.classList.remove('battle-shake'), 450);
  }

  closeBattleModal() {
    const modal = document.getElementById('modal-battle');
    if (modal) modal.classList.remove('active');
    this.battleInstance = null;
    this.updateHUD();
  }

  // ==========================================
  // 🔍 8. 古代符文石碑解謎 (Rune Puzzle Modal)
  // ==========================================
  openRunePuzzleModal(runeData) {
    this.openModal('modal-rune');
    const container = document.getElementById('rune-puzzle-content');
    if (!container) return;

    const pet = this.game.getActivePet();
    const petSpec = PET_SPECIES[pet.speciesId];
    const isMatchingElement = (petSpec.element === runeData.zoneId) || (runeData.zoneId === 'forest' && petSpec.element === 'nature');

    container.innerHTML = `
      <div class="rune-symbol-circle pulse">
        <span style="font-size:54px;">🔮</span>
      </div>
      <h3 style="color:#fde047; margin:15px 0 8px 0;">${runeData.name}</h3>
      <p style="color:#cbd5e1; font-size:13px; line-height:1.6;">
        石碑上雕刻著遠古密文：「唯有契合此地的純淨元素精華共鳴，封印之門方能為勇者敞開。」
      </p>

      <div class="resonance-check-card ${isMatchingElement ? 'match' : 'mismatch'}">
        <div>當前守護魔寵：${petSpec.icon} ${petSpec.name} (${ELEMENTS[petSpec.element].name}屬性)</div>
        <div style="font-size:12px; margin-top:5px;">
          ${isMatchingElement ? '✨ 屬性完美共鳴！可以引導魔力注入！' : '⚠️ 屬性不匹配，需攜帶對應屬性魔寵！'}
        </div>
      </div>

      <button id="btn-activate-rune" class="anime-btn ${isMatchingElement ? 'primary-glow' : 'disabled'}" style="margin-top:20px;">
        🌟 引導元素共鳴破解封印
      </button>
    `;

    document.getElementById('btn-activate-rune')?.addEventListener('click', () => {
      if (isMatchingElement) {
        sound.playRuneActivate();
        runeData.activated = true;

        this.game.addItem('egg_rainbow', 1);
        this.game.addItem('donut', 2);
        this.game.coins += 150;

        sound.playVictory();
        this.showToast('🎉 符文禁制破解！獲得【極彩幻境神獸蛋】x1 與 150 金幣！', 4000);
        this.closeCurrentModal();
        this.updateHUD();

        // Unlock Ancient Secret
        SECRET_ARCHIVES.find(s => s.id === 'sec_ancient').unlocked = true;
      } else {
        this.showToast('元素屬性無法共鳴，請嘗試更換對應屬性的魔寵！');
      }
    });
  }

  // --- 🌧️ 天氣 HUD 徽章即時更新 ---
  updateWeatherBadge(text) {
    if (this.elWeatherBadge) {
      this.elWeatherBadge.innerText = text;
    }
  }

  // ==========================================
  // 🍲 9. 幻境烹飪工坊 (Cooking Modal)
  // ==========================================
  openCookingModal() {
    this.openModal('modal-cooking');
    this.renderCookingModal();
  }

  renderCookingModal() {
    const list = document.getElementById('cooking-recipes-list');
    if (!list) return;
    list.innerHTML = '';

    COOKING_RECIPES.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'cooking-recipe-card';
      card.style.cssText = 'background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;';

      const canCook = recipe.ingredients.every(ing => (this.game.inventory[ing.id] || 0) >= ing.count);
      const ingHtml = recipe.ingredients.map(ing => {
        const have = this.game.inventory[ing.id] || 0;
        const itemInfo = CONSUMABLES.find(c => c.id === ing.id) || { name: ing.id, icon: '📦' };
        const color = have >= ing.count ? '#4ade80' : '#f87171';
        return `<span style="display:inline-block; margin-right:10px; font-size:12px; color:${color}; font-weight:600;">${itemInfo.icon} ${itemInfo.name}: ${have}/${ing.count}</span>`;
      }).join('');

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="font-size:36px; background:rgba(255,255,255,0.06); width:54px; height:54px; border-radius:12px; display:flex; align-items:center; justify-content:center;">${recipe.icon}</div>
          <div>
            <div style="font-weight:700; font-size:16px; color:#f8fafc;">${recipe.name}</div>
            <div style="font-size:12px; color:#94a3b8; margin:3px 0 6px 0;">${recipe.desc}</div>
            <div>${ingHtml}</div>
          </div>
        </div>
        <button class="anime-btn ${canCook ? 'success-glow' : 'disabled'}" style="white-space:nowrap; padding:10px 18px; margin-left:12px;">
          ${canCook ? '🍳 慢火烹飪' : '❌ 食材不足'}
        </button>
      `;

      if (canCook) {
        card.querySelector('button')?.addEventListener('click', () => {
          this.game.cookRecipe(recipe);
        });
      }

      list.appendChild(card);
    });
  }

  // ==========================================
  // 🛋️ 10. 溫馨家具商城 (Furniture Modal)
  // ==========================================
  openFurnitureModal() {
    this.openModal('modal-furniture');
    this.renderFurnitureModal();
  }

  renderFurnitureModal() {
    const list = document.getElementById('furniture-items-list');
    const coinEl = document.getElementById('furniture-coin-val');
    if (coinEl) coinEl.innerText = this.game.coins;
    if (!list) return;
    list.innerHTML = '';

    FURNITURE_ITEMS.forEach(item => {
      const card = document.createElement('div');
      card.className = 'furniture-item-card';
      card.style.cssText = 'background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;';

      const canAfford = this.game.coins >= item.price;
      const isBought = item.bought;

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="font-size:36px; background:rgba(255,255,255,0.06); width:54px; height:54px; border-radius:12px; display:flex; align-items:center; justify-content:center;">${item.icon}</div>
          <div>
            <div style="font-weight:700; font-size:16px; color:#f8fafc;">${item.name}</div>
            <div style="font-size:12px; color:#94a3b8; margin:3px 0 4px 0;">${item.desc}</div>
            <div style="font-weight:700; color:#facc15; font-size:13px;">🪙 ${item.price} 金幣</div>
          </div>
        </div>
        <button class="anime-btn ${isBought ? 'disabled' : (canAfford ? 'primary-glow' : 'disabled')}" style="white-space:nowrap; padding:10px 18px; margin-left:12px;">
          ${isBought ? '✅ 已擁有 (裝潢中)' : (canAfford ? '🪙 購買家具' : '金幣不足')}
        </button>
      `;

      if (!isBought && canAfford) {
        card.querySelector('button')?.addEventListener('click', () => {
          this.game.buyFurniture(item);
        });
      }

      list.appendChild(card);
    });
  }
}
