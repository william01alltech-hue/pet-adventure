// 3D World & Environment Generator for 《魔寵：幻境之旅》
import * as THREE from './three.module.js';
import { MAP_ZONES, PET_SPECIES, ELEMENTS } from './pets_data.js';
import { PetModelFactory } from './pet_models.js';
import { sound } from './audio.js';

export class WorldManager {
  constructor(scene) {
    this.scene = scene;
    this.currentZoneId = 'forest';
    this.zoneGroup = new THREE.Group();
    this.scene.add(this.zoneGroup);

    this.interactables = [];
    this.wildMonsters = [];
    this.particles = [];
  }

  loadZone(zoneId) {
    this.currentZoneId = zoneId;
    const zoneData = MAP_ZONES.find(z => z.id === zoneId) || MAP_ZONES[0];

    // Clear existing props
    while (this.zoneGroup.children.length > 0) {
      const obj = this.zoneGroup.children[0];
      this.zoneGroup.remove(obj);
    }
    this.interactables = [];
    this.wildMonsters = [];
    this.particles = [];

    // Setup Fog, Sky Background & Lighting colors
    this.scene.fog = new THREE.FogExp2(zoneData.fogColor, zoneData.fogDensity);
    this.scene.background = new THREE.Color(zoneData.skyColor || 0xbae6fd);

    // 1. Terrain Ground
    const groundGeo = new THREE.CircleGeometry(150, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: zoneData.groundColor,
      roughness: 0.85
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    this.zoneGroup.add(ground);

    // Decorative inner ground ring
    const ringGeo = new THREE.RingGeometry(8, 22, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: zoneData.ambientLight,
      roughness: 0.9,
      transparent: true,
      opacity: 0.45
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.02;
    this.zoneGroup.add(ring);

    this.lavaAreas = [];
    this.fruitTrees = [];
    this.waterMeshes = [];

    // 1.5. 高低起伏立體地形 (Layered Hills, Natural Slopes & Elevation Paths)
    this.buildTerrainElevations(zoneId, zoneData);

    // 2. Zone Specific Features & Props
    switch (zoneId) {
      case 'home':
        this.buildHomeProps();
        break;
      case 'water_lake':
        this.buildWaterLakeProps();
        break;
      case 'forest':
        this.buildForestProps();
        break;
      case 'tundra':
        this.buildTundraProps();
        break;
      case 'volcano':
        this.buildVolcanoProps();
        break;
      case 'ruins':
        this.buildRuinsProps();
        break;
      case 'thunder_crag':
        this.buildThunderCragProps();
        break;
      case 'celestial_shrine':
        this.buildCelestialShrineProps();
        break;
    }

    // 3. Central Sanctuary Platform & Ancient Rune Pillar
    this.buildRunePillar(zoneData);

    // 3.5. 遠古幻境傳送石碑 (Teleport Waypoint Monolith)
    this.buildTeleportMonolith(zoneData);

    // 4. Scatter Gatherables (Berries, Crystals, Pet Eggs)
    this.spawnGatherables(zoneId);

    // 5. Spawn Roaming Wild Monsters
    this.spawnWildMonsters(zoneData);

    // 6. Atmospheric Floating Particles
    this.spawnAtmosphereParticles(zoneId);
  }

  // --- 🌳 迷霧森林特色景觀 ---
  buildForestProps() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const mushroomMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5 }); // Glowing blue shrooms

    // Giant Sacred Tree in background
    const sacredTrunk = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 3.2, 16, 12), trunkMat);
    sacredTrunk.position.set(0, 8, -38);
    this.zoneGroup.add(sacredTrunk);

    const sacredFoliage = new THREE.Mesh(new THREE.DodecahedronGeometry(8, 1), foliageMat);
    sacredFoliage.position.set(0, 18, -38);
    this.zoneGroup.add(sacredFoliage);

    // 24 Forest Trees around perimeter
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const rad = 25 + Math.random() * 35;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      const th = 4 + Math.random() * 3;
      const tTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, th, 8), trunkMat);
      tTrunk.position.y = th / 2;
      tree.add(tTrunk);

      const fGeo = new THREE.ConeGeometry(2.2 + Math.random() * 1.2, 4 + Math.random() * 2, 7);
      const tFoliage = new THREE.Mesh(fGeo, foliageMat);
      tFoliage.position.y = th + 1.8;
      tree.add(tFoliage);

      this.zoneGroup.add(tree);
    }

    // Glowing Bioluminescent Mushrooms
    for (let m = 0; m < 15; m++) {
      const mx = (Math.random() - 0.5) * 40;
      const mz = (Math.random() - 0.5) * 40;
      if (Math.hypot(mx, mz) < 8) continue;

      const shroom = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), mushroomMat);
      shroom.position.set(mx, 0.35, mz);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.4, 6), trunkMat);
      stem.position.set(mx, 0.2, mz);
      this.zoneGroup.add(shroom, stem);
    }
  }

  // --- ❄️ 永凍冰原特色景觀 ---
  buildTundraProps() {
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9
    });

    // Towering Glacier Spikes
    for (let i = 0; i < 20; i++) {
      const ang = (i / 20) * Math.PI * 2;
      const rad = 28 + Math.random() * 32;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const h = 6 + Math.random() * 8;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(1.2 + Math.random() * 0.8, h, 5), iceMat);
      spike.position.set(x, h / 2, z);
      spike.rotation.y = Math.random() * Math.PI;
      spike.rotation.z = (Math.random() - 0.5) * 0.2;
      this.zoneGroup.add(spike);
    }

    // Floating Ice Crystals
    for (let c = 0; c < 12; c++) {
      const cx = (Math.random() - 0.5) * 45;
      const cz = (Math.random() - 0.5) * 45;
      if (Math.hypot(cx, cz) < 9) continue;

      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), iceMat);
      crystal.position.set(cx, 1.2 + Math.random() * 0.5, cz);
      crystal.rotation.set(0.3, Math.random(), 0.2);
      this.zoneGroup.add(crystal);
    }
  }

  // --- ⛰️ 1.5. 8大生態體系專屬立體山貌（依據體系特色打造完全不同的山色與地貌）---
  buildTerrainElevations(zoneId, zoneData) {
    switch (zoneId) {
      case 'home':
        this.buildHomeMountains(zoneData);
        break;
      case 'forest':
        this.buildForestMountains(zoneData);
        break;
      case 'water_lake':
        this.buildWaterLakeMountains(zoneData);
        break;
      case 'tundra':
        this.buildTundraMountains(zoneData); // ❄️ 真正的照片同款富士雪山與極地冰川！
        break;
      case 'volcano':
        this.buildVolcanoMountains(zoneData); // 🔥 熾熱活火山與熔岩池！
        break;
      case 'thunder_crag':
        this.buildThunderCragMountains(zoneData); // ⚡ 險峻雷霆紫黑劍峰！
        break;
      case 'ruins':
        this.buildRuinsMountains(zoneData); // 🌙 暗夜虛空黑曜方尖斷崖！
        break;
      case 'celestial_shrine':
        this.buildCelestialMountains(zoneData); // ✨ 白玉神聖金頂聖山！
        break;
      default:
        this.buildHomeMountains(zoneData);
        break;
    }
  }

  // 🏡 1. 溫馨小家：青翠田園疊巒與果園草丘（純綠田園，無雪頂）
  buildHomeMountains(zoneData) {
    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.88,
      flatShading: true
    });
    const lightGreenMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.85,
      flatShading: true
    });

    // 北方遠景溫柔青翠青山
    const northMount = new THREE.Group();
    northMount.position.set(0, 0, -86);
    const nCone = new THREE.Mesh(new THREE.ConeGeometry(36, 26, 18), greenMat);
    nCone.position.y = 13;
    northMount.add(nCone);
    const nTop = new THREE.Mesh(new THREE.ConeGeometry(18, 12, 18), lightGreenMat);
    nTop.position.y = 20;
    northMount.add(nTop);
    this.zoneGroup.add(northMount);

    // 兩側連綿田園青巒
    [-60, 60].forEach((x, i) => {
      const hillGroup = new THREE.Group();
      hillGroup.position.set(x, 0, -75);
      const h1 = new THREE.Mesh(new THREE.ConeGeometry(28, 20, 16), greenMat);
      h1.position.y = 10;
      hillGroup.add(h1);
      this.zoneGroup.add(hillGroup);
    });

    // 側翼與後方舒緩草丘
    [[-75, 10], [75, 10], [-55, 60], [55, 60]].forEach(([hx, hz]) => {
      const gHill = new THREE.Mesh(new THREE.ConeGeometry(22, 15, 14), lightGreenMat);
      gHill.position.set(hx, 7.5, hz);
      this.zoneGroup.add(gHill);
    });
  }

  // 🌳 2. 迷霧森林：古木盤根翡翠靈峰（喀斯特石柱與巨木冠蓋）
  buildForestMountains(zoneData) {
    const mossRockMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.9,
      flatShading: true
    });
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.8
    });

    // 4 座挺拔古老神木青石靈峰
    const spireCoords = [
      [0, -82, 32, 16],
      [-52, -65, 26, 14],
      [52, -65, 28, 15],
      [-65, 20, 22, 12],
      [65, 20, 24, 13]
    ];

    spireCoords.forEach(([sx, sz, sh, sr]) => {
      const spire = new THREE.Group();
      spire.position.set(sx, 0, sz);

      // 石柱山體
      const column = new THREE.Mesh(new THREE.CylinderGeometry(sr * 0.55, sr, sh, 14), mossRockMat);
      column.position.y = sh / 2;
      spire.add(column);

      // 山頂巨樹冠蓋 (Ancient Giant Canopy atop mountain)
      const topTree = new THREE.Mesh(new THREE.SphereGeometry(sr * 0.75, 10, 8), canopyMat);
      topTree.scale.set(1.4, 0.7, 1.4);
      topTree.position.y = sh + 1.5;
      spire.add(topTree);

      this.zoneGroup.add(spire);
    });
  }

  // 💧 3. 碧波水澤：水墨青碧水巒與流瀑水霧（宛如灕江陽朔倒映湖中）
  buildWaterLakeMountains(zoneData) {
    const waterPeakMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1, // 天青水墨藍
      roughness: 0.75,
      metalness: 0.1,
      flatShading: true
    });
    const waterfallMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.85
    });

    // 湖泊後方秀麗水墨群峰，環抱湖面
    const lakePeaks = [
      [0, -85, 36, 18, true], // 正中央高聳主水峰，帶有飛瀑！
      [-48, -72, 28, 14, false],
      [48, -72, 30, 15, false],
      [-72, -30, 22, 12, false],
      [72, -30, 24, 13, false]
    ];

    lakePeaks.forEach(([px, pz, ph, pr, hasFall]) => {
      const peakGroup = new THREE.Group();
      peakGroup.position.set(px, 0, pz);

      // 秀麗修長錐柱水峰
      const peakGeo = new THREE.ConeGeometry(pr, ph, 16);
      const peakMesh = new THREE.Mesh(peakGeo, waterPeakMat);
      peakMesh.position.y = ph / 2;
      peakGroup.add(peakMesh);

      // 晶瑩流瀉瀑布 (Cascading Waterfall)
      if (hasFall) {
        const fallGeo = new THREE.PlaneGeometry(3.5, ph * 0.72);
        const fall = new THREE.Mesh(fallGeo, waterfallMat);
        fall.position.set(0, ph * 0.42, pr * 0.55);
        peakGroup.add(fall);

        // 瀑布水花霧氣
        const mist = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.45 }));
        mist.position.set(0, 1.5, pr * 0.58);
        peakGroup.add(mist);
      }

      this.zoneGroup.add(peakGroup);
    });
  }

  // ❄️ 4. 永凍冰原：照片同款 100% 富士雪山主峰與極地冰川連峰！
  buildTundraMountains(zoneData) {
    // 🗻 正北方遠景巍峨富士雪山主峰（照片同款！高達 44 單位，白雪皚皚冠頂 + 深靛藍山體 + 晨曦霧環！）
    this.buildFujiMountain(0, -90, 44, 38, 0, false, true);

    // 東西兩側巍峨富士雪山副峰
    this.buildFujiMountain(-58, -82, 32, 28, -0.2, false, false);
    this.buildFujiMountain(58, -82, 34, 29, 0.2, false, false);

    // 四周環抱冰川雪峰
    [[-80, -10, 22, 20], [80, -10, 24, 22], [-65, 55, 20, 18], [65, 55, 22, 20]].forEach(([ix, iz, ih, ir]) => {
      this.buildFujiMountain(ix, iz, ih, ir, 0.4, false, false);
    });

    // 晶瑩剔透冰川冰刺
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.35,
      transparent: true,
      opacity: 0.85
    });
    for (let c = 0; c < 8; c++) {
      const cang = (c / 8) * Math.PI * 2;
      const crad = 35 + (c % 2) * 10;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(2.5, 9, 5), iceMat);
      spike.position.set(Math.cos(cang) * crad, 4.5, Math.sin(cang) * crad);
      spike.rotation.set(0.15, Math.random(), 0.15);
      this.zoneGroup.add(spike);
    }
  }

  // 🔥 5. 熔火炎巢：熾熱烈焰活火山與滾燙熔岩池
  buildVolcanoMountains(zoneData) {
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
      flatShading: true
    });
    const lavaVeinMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const craterGlowMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });

    // 正中央巍峨活火山主峰 (Giant Active Volcano)
    const volcanoGroup = new THREE.Group();
    volcanoGroup.position.set(0, 0, -88);

    // 火山廣角下身 (Flared Volcanic Base)
    const vBase = new THREE.Mesh(new THREE.CylinderGeometry(18, 36, 18, 20), obsidianMat);
    vBase.position.y = 9;
    volcanoGroup.add(vBase);

    // 火山上半身 (Steep Upper Slopes)
    const vMid = new THREE.Mesh(new THREE.CylinderGeometry(9, 18, 14, 20), obsidianMat);
    vMid.position.y = 18 + 7;
    volcanoGroup.add(vMid);

    // 滾燙火山口 (Glowing Magma Caldera)
    const caldera = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 9, 3, 20), obsidianMat);
    caldera.position.y = 18 + 14 + 1.5;
    volcanoGroup.add(caldera);

    // 火山口熾熱熔岩湖心 (Lava Pool in Crater)
    const craterLava = new THREE.Mesh(new THREE.CircleGeometry(7.2, 16), craterGlowMat);
    craterLava.rotateX(-Math.PI / 2);
    craterLava.position.y = 18 + 14 + 3.01;
    volcanoGroup.add(craterLava);

    // 山壁熔岩淌流脈絡 (Flowing Lava Veins down volcano)
    for (let v = 0; v < 8; v++) {
      const vang = (v / 8) * Math.PI * 2;
      const vein = new THREE.Mesh(new THREE.BoxGeometry(1.6, 22, 0.4), lavaVeinMat);
      vein.position.set(Math.cos(vang) * 14, 18, Math.sin(vang) * 14);
      vein.rotation.y = -vang;
      vein.rotation.z = 0.28;
      volcanoGroup.add(vein);
    }
    this.zoneGroup.add(volcanoGroup);

    // 四周環繞焦黑黑曜石火山群峰
    [[-58, -75, 24, 18], [58, -75, 26, 20], [-75, 0, 20, 16], [75, 0, 20, 16]].forEach(([vx, vz, vh, vr]) => {
      const crag = new THREE.Mesh(new THREE.ConeGeometry(vr, vh, 12), obsidianMat);
      crag.position.set(vx, vh / 2, vz);
      this.zoneGroup.add(crag);
    });
  }

  // ⚡ 6. 雷霆裂谷：紫黑玄武岩險峻石劍峰
  buildThunderCragMountains(zoneData) {
    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b, // 深邃紫黑玄武岩
      roughness: 0.85,
      flatShading: true
    });
    const thunderPillarMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    // 險峻立體插天石劍柱群
    const pillars = [
      [0, -82, 38, 12],
      [-45, -70, 30, 10],
      [45, -70, 32, 10],
      [-65, -15, 26, 9],
      [65, -15, 28, 9],
      [-50, 45, 22, 8],
      [50, 45, 24, 8]
    ];

    pillars.forEach(([px, pz, ph, pr]) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(px, 0, pz);

      const column = new THREE.Mesh(new THREE.ConeGeometry(pr, ph, 5), basaltMat);
      column.position.y = ph / 2;
      pGroup.add(column);

      // 尖頂雷光引雷晶石 (Lightning Rod Crystal)
      const topSpire = new THREE.Mesh(new THREE.OctahedronGeometry(2.2, 0), thunderPillarMat);
      topSpire.position.y = ph + 1.2;
      pGroup.add(topSpire);

      this.zoneGroup.add(pGroup);
    });
  }

  // 🌙 7. 暗月遺跡：虛空黑曜斷崖與方尖古代神山
  buildRuinsMountains(zoneData) {
    const voidRockMat = new THREE.MeshStandardMaterial({
      color: 0x0f0b1e, // 幽深暗夜黑
      roughness: 0.92,
      flatShading: true
    });
    const runeGlowMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

    const cliffs = [
      [0, -84, 34, 22],
      [-55, -72, 28, 18],
      [55, -72, 28, 18],
      [-70, 15, 24, 16],
      [70, 15, 24, 16]
    ];

    cliffs.forEach(([cx, cz, ch, cr]) => {
      const cGroup = new THREE.Group();
      cGroup.position.set(cx, 0, cz);

      // 方塊崩裂感的古代方尖斷崖 (Ancient Monolith Cliffs)
      const blockBase = new THREE.Mesh(new THREE.BoxGeometry(cr * 1.5, ch * 0.75, cr * 1.5), voidRockMat);
      blockBase.position.y = ch * 0.375;
      cGroup.add(blockBase);

      const blockTop = new THREE.Mesh(new THREE.ConeGeometry(cr * 0.9, ch * 0.5, 4), voidRockMat);
      blockTop.position.y = ch * 0.75 + ch * 0.25;
      blockTop.rotation.y = Math.PI / 4;
      cGroup.add(blockTop);

      // 幽夜紫晶印記
      const runeEye = new THREE.Mesh(new THREE.OctahedronGeometry(2, 0), runeGlowMat);
      runeEye.position.set(0, ch * 0.6, cr * 0.78);
      cGroup.add(runeEye);

      this.zoneGroup.add(cGroup);
    });
  }

  // ✨ 8. 星光神殿：白玉浮空神聖金頂聖山
  buildCelestialMountains(zoneData) {
    const whiteMarbleMat = new THREE.MeshStandardMaterial({
      color: 0xfafaf9, // 純淨漢白玉
      roughness: 0.45,
      flatShading: true
    });
    const holyGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // 神聖金頂
      metalness: 0.85,
      roughness: 0.2
    });

    const shrines = [
      [0, -86, 36, 24, true], // 正北方中央大聖山
      [-54, -70, 28, 18, false],
      [54, -70, 28, 18, false],
      [-70, 20, 22, 15, false],
      [70, 20, 22, 15, false]
    ];

    shrines.forEach(([sx, sz, sh, sr, isMain]) => {
      const sGroup = new THREE.Group();
      sGroup.position.set(sx, 0, sz);

      // 白玉山體
      const marbleCone = new THREE.Mesh(new THREE.ConeGeometry(sr, sh * 0.75, 8), whiteMarbleMat);
      marbleCone.position.y = (sh * 0.75) / 2;
      sGroup.add(marbleCone);

      // 輝煌金頂 (Golden Summit Peak)
      const goldPeak = new THREE.Mesh(new THREE.ConeGeometry(sr * 0.35, sh * 0.35, 8), holyGoldMat);
      goldPeak.position.y = sh * 0.75 + (sh * 0.35) / 2;
      sGroup.add(goldPeak);

      // 神聖懸浮金環 (Celestial Aureole Halo)
      if (isMain) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(12, 0.8, 8, 24), holyGoldMat);
        ring.position.y = sh + 2;
        ring.rotation.x = Math.PI / 2;
        sGroup.add(ring);
      }

      this.zoneGroup.add(sGroup);
    });
  }

  // --- 🗻 單座富士雪山構造（專供永凍冰原與雪山體系調用：深靛藍紫山身 + 晶瑩雪冠 + 垂落雪舌紋 + 晨曦霧環）---
  buildFujiMountain(x, z, height = 36, radius = 32, rot = 0, isVolcano = false, isMain = false) {
    const fujiGroup = new THREE.Group();
    fujiGroup.position.set(x, 0, z);
    fujiGroup.rotation.y = rot;

    // 1. 山體底色：照片同款深邃優雅的富士靛藍/群青紫灰 (Deep Indigo Blue / Cobalt Slate)
    const bodyColor = 0x2b3e70;
    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.82,
      metalness: 0.08,
      flatShading: true
    });

    // 分為平滑過渡的三段火山錐曲線（裙邊 -> 陡坡 -> 雪頂）
    const baseH = height * 0.42;
    const midH = height * 0.32;
    const snowH = height * 0.26;

    const rBottom = radius;
    const rMid = radius * 0.48;
    const rTop = radius * 0.22;

    // 1.1 富士山裙邊下坡 (Flared Base Skirt)
    const baseGeo = new THREE.CylinderGeometry(rMid, rBottom, baseH, 24);
    const baseMesh = new THREE.Mesh(baseGeo, bodyMat);
    baseMesh.position.y = baseH / 2;
    baseMesh.receiveShadow = true;
    fujiGroup.add(baseMesh);

    // 1.2 富士山腰陡坡 (Steeper Mid Slope)
    const midGeo = new THREE.CylinderGeometry(rTop, rMid, midH, 24);
    const midMesh = new THREE.Mesh(midGeo, bodyMat);
    midMesh.position.y = baseH + midH / 2;
    midMesh.receiveShadow = true;
    fujiGroup.add(midMesh);

    // 2. 富士白雪皚皚冠頂 (Snow-capped Summit Cap - Pure White)
    const snowMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.12,
      flatShading: true
    });

    const snowGeo = new THREE.ConeGeometry(rTop * 1.05, snowH, 24);
    const snowCap = new THREE.Mesh(snowGeo, snowMat);
    snowCap.position.y = baseH + midH + snowH / 2;
    fujiGroup.add(snowCap);

    // 3. 富士山脊雪舌垂降紋路
    for (let s = 0; s < 10; s++) {
      const sAngle = (s / 10) * Math.PI * 2 + (s % 2) * 0.2;
      const tongueLen = snowH * (0.85 + (s % 3) * 0.35);
      const tongueR = rTop * (0.28 + (s % 2) * 0.1);
      const tongueGeo = new THREE.ConeGeometry(tongueR, tongueLen, 4);
      const tongue = new THREE.Mesh(tongueGeo, snowMat);

      const tx = Math.cos(sAngle) * (rTop * 0.92);
      const tz = Math.sin(sAngle) * (rTop * 0.92);
      tongue.position.set(tx, baseH + midH - tongueLen * 0.28, tz);
      tongue.rotation.z = Math.cos(sAngle) * 0.32;
      tongue.rotation.x = -Math.sin(sAngle) * 0.32;
      fujiGroup.add(tongue);
    }

    // 4. 山腰晨光輕霧雲霞環
    const mistGeo = new THREE.TorusGeometry(radius * 0.65, isMain ? 2.2 : 1.5, 8, 32);
    const mistMat = new THREE.MeshBasicMaterial({
      color: 0xe0e7ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const mist = new THREE.Mesh(mistGeo, mistMat);
    mist.rotation.x = Math.PI / 2;
    mist.position.y = baseH + 0.5;
    fujiGroup.add(mist);

    this.zoneGroup.add(fujiGroup);
    return fujiGroup;
  }

  // --- 🏡 溫馨小家特色景觀 (My Home: Cabin, Orchard Fruit Trees, Cooking Cauldron, Bed & Relax Patio) ---
  buildHomeProps() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.7 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
    const glowWindowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 });

    // 1. 溫馨木屋主體 (Cozy Log Cabin)
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 0, -20);

    const houseBody = new THREE.Mesh(new THREE.BoxGeometry(11, 4.6, 9), woodMat);
    houseBody.position.y = 2.3;
    houseBody.castShadow = true;
    houseBody.receiveShadow = true;
    cabinGroup.add(houseBody);

    // 經典雙面尖頂紅瓦屋頂
    const roofGeo = new THREE.ConeGeometry(8.5, 3.8, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 6.2;
    roof.scale.set(1.15, 1, 0.95);
    cabinGroup.add(roof);

    // 暖心石砌煙囪
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.5, 1.2), stoneMat);
    chimney.position.set(3.4, 6.2, -1.8);
    cabinGroup.add(chimney);

    // 木屋大門與銅把手
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.0, 0.2), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
    door.position.set(0, 1.5, 4.55);
    cabinGroup.add(door);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 }));
    knob.position.set(0.65, 1.5, 4.68);
    cabinGroup.add(knob);

    // 發光小窗戶
    [-3.2, 3.2].forEach(wx => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.15), glowWindowMat);
      win.position.set(wx, 2.5, 4.55);
      cabinGroup.add(win);
    });

    // 門廊階梯與掛燈
    const porch = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 2.5), woodMat);
    porch.position.set(0, 0.2, 5.2);
    cabinGroup.add(porch);

    this.zoneGroup.add(cabinGroup);

    // 2. 🍎 結滿果實的果樹果園 (Adjacent Orchard with Apple & Orange Trees)
    const orchardTrees = [
      { type: 'apple', name: '蜜糖紅蘋果樹', icon: '🍎', x: 12, z: -16, fruitColor: 0xef4444 },
      { type: 'apple', name: '蜜糖紅蘋果樹', icon: '🍎', x: 17, z: -11, fruitColor: 0xef4444 },
      { type: 'orange', name: '陽光金蜜柑樹', icon: '🍊', x: 10, z: -8, fruitColor: 0xf97316 },
      { type: 'orange', name: '陽光金蜜柑樹', icon: '🍊', x: 15, z: -5, fruitColor: 0xf97316 }
    ];

    orchardTrees.forEach((tData, idx) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tData.x, 0, tData.z);

      // 樹幹
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 3.2, 8), woodMat);
      trunk.position.y = 1.6;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // 茂密圓球樹冠
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.8 + Math.random() * 0.3, 10, 10), new THREE.MeshStandardMaterial({
        color: tData.type === 'orange' ? 0x16a34a : 0x15803d,
        roughness: 0.65
      }));
      foliage.position.y = 3.8;
      foliage.castShadow = true;
      treeGroup.add(foliage);

      // 枝頭掛滿成熟鮮果
      const fruitMat = new THREE.MeshStandardMaterial({ color: tData.fruitColor, roughness: 0.3 });
      for (let f = 0; f < 6; f++) {
        const fang = (f / 6) * Math.PI * 2;
        const frad = 1.45 + (f % 2) * 0.3;
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), fruitMat);
        fruit.position.set(Math.cos(fang) * frad, 3.4 + Math.sin(f * 1.5) * 0.6, Math.sin(fang) * frad);
        treeGroup.add(fruit);
      }

      this.zoneGroup.add(treeGroup);

      // 註冊為可採集/搖樹果樹互動點
      this.interactables.push({
        type: 'fruit_tree',
        id: `tree_${tData.type}_${idx}`,
        fruitType: tData.type,
        name: `${tData.icon} ${tData.name}【按 E 搖樹採摘】`,
        position: new THREE.Vector3(tData.x, 1.2, tData.z),
        mesh: treeGroup
      });
    });

    // 3. 🍳 門前戶外烹飪大鍋 (Cooking Cauldron on Fire Pit)
    const cauldronGroup = new THREE.Group();
    cauldronGroup.position.set(0, 0, -11.5);

    // 石圈柴火灶
    const hearth = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.28, 8, 16), stoneMat);
    hearth.rotation.x = Math.PI / 2;
    hearth.position.y = 0.2;
    cauldronGroup.add(hearth);

    // 燃燒木柴與溫暖火苗
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.8, 6), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
    flame.position.y = 0.45;
    cauldronGroup.add(flame);

    // 黑色三腳大鐵鍋
    const potMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.4 });
    const pot = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), potMat);
    pot.position.y = 0.85;
    cauldronGroup.add(pot);

    // 滾沸的金黃美味湯汁
    const stew = new THREE.Mesh(new THREE.CircleGeometry(0.7, 12), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    stew.rotation.x = -Math.PI / 2;
    stew.position.y = 0.82;
    cauldronGroup.add(stew);

    // 攪拌長勺
    const ladle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 6), woodMat);
    ladle.position.set(0.2, 1.2, 0);
    ladle.rotation.z = 0.4;
    cauldronGroup.add(ladle);

    this.zoneGroup.add(cauldronGroup);

    // 註冊烹飪大鍋互動點
    this.interactables.push({
      type: 'cooking',
      name: '🍲 溫馨大烹飪鍋【按 E 烹調料理大餐】',
      position: new THREE.Vector3(0, 0.8, -11.5),
      mesh: cauldronGroup
    });

    // 4. 🛏️ 戶外露台與雲朵雙人暖床 (Relaxation Deck with Cloud Bed)
    const deckGroup = new THREE.Group();
    deckGroup.position.set(-13, 0, -14);

    const deckFloor = new THREE.Mesh(new THREE.BoxGeometry(7, 0.35, 7), woodMat);
    deckFloor.position.y = 0.18;
    deckGroup.add(deckFloor);

    // 雲朵暖床
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 3.4), woodMat);
    bedFrame.position.set(0, 0.5, 0);
    deckGroup.add(bedFrame);

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 3.2), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    mattress.position.set(0, 0.75, 0);
    deckGroup.add(mattress);

    const blanket = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.3, 2.2), new THREE.MeshStandardMaterial({ color: 0xf472b6 }));
    blanket.position.set(0, 0.85, 0.4);
    deckGroup.add(blanket);

    const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.28, 0.8), new THREE.MeshStandardMaterial({ color: 0xbae6fd }));
    pillow.position.set(0, 0.95, -1.1);
    deckGroup.add(pillow);

    // 魔寵暖心小窩
    const petCushion = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0xfef08a }));
    petCushion.position.set(2.2, 0.35, 1.2);
    deckGroup.add(petCushion);

    this.zoneGroup.add(deckGroup);

    // 註冊睡覺恢復床鋪
    this.interactables.push({
      type: 'bed',
      name: '🛏️ 雲朵雙人暖床【按 E 安睡休息恢復活力】',
      position: new THREE.Vector3(-13, 0.8, -14),
      mesh: deckGroup
    });

    // 白木柵欄環繞小家
    for (let f = -18; f <= 18; f += 3.6) {
      if (Math.abs(f) < 4) continue; // 留出道口
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 0.18), fenceMat);
      post.position.set(f, 0.6, -3);
      this.zoneGroup.add(post);

      const bar = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.14, 0.08), fenceMat);
      bar.position.set(f - 1.8, 0.8, -3);
      this.zoneGroup.add(bar);
    }
  }

  // --- 💧 碧波水澤特色景觀 (Water Realm: Serene Lake, Floating Lilies, Wooden Fishing Pier) ---
  buildWaterLakeProps() {
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.08,
      metalness: 0.25,
      transparent: true,
      opacity: 0.86
    });
    const woodPierMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const lilyMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
    const flowerMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 });

    // 1. 廣闊清澈大湖泊 (Central Serene Lake)
    const lakeGeo = new THREE.CylinderGeometry(23, 23, 0.4, 32);
    const lake = new THREE.Mesh(lakeGeo, waterMat);
    lake.position.set(0, 0.08, -10);
    this.zoneGroup.add(lake);
    this.waterMeshes.push(lake);

    // 湖底微深漸變
    const lakeBed = new THREE.Mesh(new THREE.CircleGeometry(24, 32), new THREE.MeshStandardMaterial({ color: 0x0e7490 }));
    lakeBed.rotateX(-Math.PI / 2);
    lakeBed.position.set(0, 0.04, -10);
    this.zoneGroup.add(lakeBed);

    // 漂浮荷葉與粉嫩荷花
    for (let l = 0; l < 16; l++) {
      const lang = (l / 16) * Math.PI * 2 + Math.random() * 0.4;
      const lrad = 7 + Math.random() * 12;
      const lx = Math.cos(lang) * lrad;
      const lz = -10 + Math.sin(lang) * lrad;

      const pad = new THREE.Mesh(new THREE.CircleGeometry(0.85 + Math.random() * 0.4, 10), lilyMat);
      pad.rotateX(-Math.PI / 2);
      pad.position.set(lx, 0.12, lz);
      this.zoneGroup.add(pad);

      if (l % 2 === 0) {
        const blossom = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.35, 6), flowerMat);
        blossom.position.set(lx, 0.26, lz);
        this.zoneGroup.add(blossom);
      }
    }

    // 2. 🎣 木質延伸釣魚棧道碼頭 (Wooden Fishing Pier)
    const pierGroup = new THREE.Group();
    pierGroup.position.set(0, 0, 0);

    // 棧道橋面從岸邊延伸至湖面中央
    const pierDeck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 14), woodPierMat);
    pierDeck.position.set(0, 0.35, -4);
    pierDeck.castShadow = true;
    pierDeck.receiveShadow = true;
    pierGroup.add(pierDeck);

    // 水中木樁支撐柱
    for (let z = 2; z >= -10; z -= 3.5) {
      [-1.4, 1.4].forEach(x => {
        const piling = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.2, 8), woodPierMat);
        piling.position.set(x, 0.2, z);
        pierGroup.add(piling);
      });
    }

    // 棧道盡頭釣魚平台 (釣魚小圓凳、魚竿、復古掛燈)
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.5, 8), woodPierMat);
    stool.position.set(0, 0.72, -9.8);
    pierGroup.add(stool);

    // 斜靠在木樁旁的釣竿
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 3.2, 6), new THREE.MeshStandardMaterial({ color: 0x92400e }));
    rod.position.set(0.8, 1.6, -10.2);
    rod.rotation.x = -0.55;
    rod.rotation.z = 0.2;
    pierGroup.add(rod);

    // 復古暖光釣魚燈
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    lamp.position.set(-0.9, 1.1, -10.2);
    pierGroup.add(lamp);

    this.zoneGroup.add(pierGroup);

    // 註冊釣魚互動點
    this.interactables.push({
      type: 'fishing',
      name: '🎣 碧波湖釣魚台【按 E 揮竿釣魚】',
      position: new THREE.Vector3(0, 0.6, -9.5),
      mesh: pierGroup
    });
  }

  // --- 🔥 炎龍火山特色景觀 (Overhauled: Steep Crags, Dangerous Lava Pools & Lava Lord Boss Crater) ---
  buildVolcanoProps() {
    const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 });
    const lavaMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xef4444,
      emissiveIntensity: 0.9,
      roughness: 0.4
    });

    // 1. 險峻黑曜石環形峭壁
    for (let i = 0; i < 22; i++) {
      const ang = (i / 22) * Math.PI * 2;
      const rad = 28 + Math.random() * 32;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const crag = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5 + Math.random() * 2.5), obsidianMat);
      crag.position.set(x, 2.5, z);
      crag.scale.set(1, 2.8, 1);
      crag.castShadow = true;
      this.zoneGroup.add(crag);
    }

    // 2. 🌋 危險熾熱熔岩池（真實傷害區域！踩到會灼傷扣血）
    this.lavaAreas = [
      { x: -14, z: 8, r: 6.2 },
      { x: 15, z: -8, r: 6.8 },
      { x: 0, z: -26, r: 10.5 } // 火山深處中央大熔岩湖
    ];

    this.lavaAreas.forEach(area => {
      // 熔岩池表面
      const lavaPool = new THREE.Mesh(new THREE.CylinderGeometry(area.r, area.r, 0.35, 24), lavaMat);
      lavaPool.position.set(area.x, 0.08, area.z);
      this.zoneGroup.add(lavaPool);

      // 黑曜石碎岩圈環繞
      for (let r = 0; r < 8; r++) {
        const rang = (r / 8) * Math.PI * 2;
        const rx = area.x + Math.cos(rang) * (area.r + 0.6);
        const rz = area.z + Math.sin(rang) * (area.r + 0.6);
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.5), obsidianMat);
        rock.position.set(rx, 0.4, rz);
        this.zoneGroup.add(rock);
      }
    });

    // 3. 👑 火山口深處：熔岩領主王座與守護巨獸祭壇
    const altarGroup = new THREE.Group();
    altarGroup.position.set(0, 0, -26);

    const throneBase = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5.5, 1.8, 12), obsidianMat);
    throneBase.position.y = 0.9;
    altarGroup.add(throneBase);

    // 燃燒的熔岩火炬柱
    [-3.2, 3.2].forEach(tx => {
      const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3.2, 8), obsidianMat);
      torch.position.set(tx, 1.6, 0);
      altarGroup.add(torch);

      const fireSphere = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
      fireSphere.position.set(tx, 3.4, 0);
      altarGroup.add(fireSphere);
    });

    this.zoneGroup.add(altarGroup);
  }

  // --- 🌙 暗月遺跡特色景觀 ---
  buildRuinsProps() {
    const ruinStoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
    const runeGlowMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });

    // Broken Ancient Pillars
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const rad = 24 + Math.random() * 32;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const h = 3 + Math.random() * 5;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, h, 8), ruinStoneMat);
      pillar.position.set(x, h / 2, z);
      pillar.rotation.z = (Math.random() - 0.5) * 0.15;
      this.zoneGroup.add(pillar);

      // Glowing rune rings around pillars
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.04, 6, 12), runeGlowMat);
      ring.position.set(x, h * 0.7, z);
      ring.rotation.x = Math.PI / 2;
      this.zoneGroup.add(ring);
    }

    // Floating Monolith Fragments
    for (let f = 0; f < 8; f++) {
      const fx = (Math.random() - 0.5) * 35;
      const fz = (Math.random() - 0.5) * 35;
      if (Math.hypot(fx, fz) < 10) continue;

      const monolith = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.5), ruinStoneMat);
      monolith.position.set(fx, 2.8 + Math.random() * 1.5, fz);
      monolith.rotation.set(0.2, 0.4, 0.1);
      this.zoneGroup.add(monolith);
    }
  }

  // --- ⚡ 雷霆裂谷特色景觀 (Thunder Crag Props) ---
  buildThunderCragProps() {
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.85 });
    const lightningMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.75,
      roughness: 0.2
    });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 });

    // 16 Electrified Basalt Obelisks with Lightning Rings
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const rad = 25 + Math.random() * 32;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const h = 5 + Math.random() * 6;
      const obelisk = new THREE.Mesh(new THREE.BoxGeometry(0.9, h, 0.9), basaltMat);
      obelisk.position.set(x, h / 2, z);
      obelisk.rotation.y = Math.random() * Math.PI;
      this.zoneGroup.add(obelisk);

      // Glowing lightning rings
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.05, 6, 12), lightningMat);
      ring.position.set(x, h * 0.75, z);
      ring.rotation.x = Math.PI / 2;
      this.zoneGroup.add(ring);
    }

    // Floating Levitating Magnetic Boulders
    for (let b = 0; b < 10; b++) {
      const bx = (Math.random() - 0.5) * 42;
      const bz = (Math.random() - 0.5) * 42;
      if (Math.hypot(bx, bz) < 9) continue;

      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1 + Math.random() * 0.6), basaltMat);
      boulder.position.set(bx, 2.8 + Math.random() * 2.5, bz);
      boulder.rotation.set(Math.random(), Math.random(), Math.random());
      this.zoneGroup.add(boulder);

      const sparkGlow = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), lightningMat);
      sparkGlow.position.set(bx, 2.8 + Math.random() * 2.5 + 0.9, bz);
      this.zoneGroup.add(sparkGlow);
    }
  }

  // --- ✨ 星光神殿特色景觀 (Celestial Shrine Props) ---
  buildCelestialShrineProps() {
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.35
    });
    const starlightMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9
    });

    // 14 Pure White Marble Celestial Pillars with Gold Capitals
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2;
      const rad = 26 + Math.random() * 28;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const pGroup = new THREE.Group();
      pGroup.position.set(x, 0, z);

      const h = 6 + Math.random() * 3;
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), goldMat);
      base.position.y = 0.2;
      pGroup.add(base);

      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, h, 12), marbleMat);
      col.position.y = h / 2 + 0.4;
      pGroup.add(col);

      const capital = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.1), goldMat);
      capital.position.y = h + 0.65;
      pGroup.add(capital);

      const starlightOrb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), starlightMat);
      starlightOrb.position.y = h + 1.2;
      pGroup.add(starlightOrb);

      this.zoneGroup.add(pGroup);
    }

    // Floating Celestial Star Polyhedrons
    for (let s = 0; s < 8; s++) {
      const sx = (Math.random() - 0.5) * 38;
      const sz = (Math.random() - 0.5) * 38;
      if (Math.hypot(sx, sz) < 10) continue;

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), goldMat);
      star.position.set(sx, 3.2 + Math.random() * 2, sz);
      star.rotation.set(0.3, Math.random(), 0.2);
      this.zoneGroup.add(star);
    }
  }

  // --- 🌀 遠古幻境傳送石碑 (Teleport Waypoint Monolith) ---
  buildTeleportMonolith(zoneData) {
    const monolithGroup = new THREE.Group();
    // Position conveniently near sanctuary platform
    monolithGroup.position.set(4.8, 0, 2.8);

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 });
    const runeGlowMat = new THREE.MeshStandardMaterial({
      color: zoneData.themeColor,
      emissive: zoneData.themeColor,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const portalGlowMat = new THREE.MeshStandardMaterial({
      color: zoneData.themeColor,
      emissive: zoneData.themeColor,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });

    // 1. Octagonal Carved Stone Dais
    const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 0.35, 8), stoneMat);
    dais.position.y = 0.175;
    dais.receiveShadow = true;
    monolithGroup.add(dais);

    // Glowing runic circle on dais
    const runeRing = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.35, 24), runeGlowMat);
    runeRing.rotation.x = -Math.PI / 2;
    runeRing.position.y = 0.36;
    monolithGroup.add(runeRing);

    // 2. Central Stele / Monolith Pillar
    const pillarGeo = new THREE.BoxGeometry(0.65, 3.6, 0.65);
    const pillar = new THREE.Mesh(pillarGeo, stoneMat);
    pillar.position.y = 1.95;
    pillar.castShadow = true;
    monolithGroup.add(pillar);

    // Carved rune inlays on 4 sides of the stele
    [-0.34, 0.34].forEach(x => {
      const runeStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 2.4), runeGlowMat);
      runeStrip.position.set(x, 1.95, 0);
      runeStrip.rotation.y = (x > 0 ? Math.PI / 2 : -Math.PI / 2);
      monolithGroup.add(runeStrip);
    });
    [-0.34, 0.34].forEach(z => {
      const runeStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 2.4), runeGlowMat);
      runeStrip.position.set(0, 1.95, z);
      runeStrip.rotation.y = (z > 0 ? 0 : Math.PI);
      monolithGroup.add(runeStrip);
    });

    // 3. Floating Spinning Magical Teleport Portal Ring
    const portalRing = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.08, 12, 32), portalGlowMat);
    portalRing.position.set(0, 2.3, 0);
    monolithGroup.add(portalRing);

    // 4. Floating Swirling Core Crystal in center of ring
    const coreCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), runeGlowMat);
    coreCrystal.position.set(0, 2.3, 0);
    monolithGroup.add(coreCrystal);

    // PointLight casting magical glow
    const pLight = new THREE.PointLight(zoneData.themeColor, 2.0, 9);
    pLight.position.set(0, 2.3, 0);
    monolithGroup.add(pLight);

    // 5. Orbiting Sentinel Runestones
    const orbitStones = [];
    for (let s = 0; s < 3; s++) {
      const sMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18), runeGlowMat);
      monolithGroup.add(sMesh);
      orbitStones.push(sMesh);
    }

    this.zoneGroup.add(monolithGroup);

    // Store reference for animation in update()
    this.teleportMonolithData = {
      group: monolithGroup,
      portalRing: portalRing,
      coreCrystal: coreCrystal,
      orbitStones: orbitStones
    };

    // Add interactive waypoint trigger
    this.interactables.push({
      id: 'teleport_monolith_' + zoneData.id,
      name: '遠古幻境傳送石碑',
      type: 'teleport_waypoint',
      zoneId: zoneData.id,
      zoneName: zoneData.name,
      position: new THREE.Vector3(4.8, 1.2, 2.8),
      mesh: monolithGroup,
      hint: `【E / 點擊】啟動遠古傳送石碑 (傳送至其他區域)`
    });
  }

  // --- 🔍 古代元素符文石柱與封印神壇 (Rune Puzzle Pillar) ---
  buildRunePillar(zoneData) {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const runeMat = new THREE.MeshBasicMaterial({ color: zoneData.themeColor });

    // Central Sanctuary Pedestal
    const baseGeo = new THREE.CylinderGeometry(4.5, 5.2, 0.4, 16);
    const base = new THREE.Mesh(baseGeo, stoneMat);
    base.position.set(0, 0.2, 0);
    this.zoneGroup.add(base);

    // Ancient Obelisk
    const obeliskGeo = new THREE.CylinderGeometry(0.45, 0.75, 4.2, 4);
    const obelisk = new THREE.Mesh(obeliskGeo, stoneMat);
    obelisk.position.set(0, 2.3, 0);
    this.zoneGroup.add(obelisk);

    // Glowing Elemental Rune Crest
    const crest = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55), runeMat);
    crest.position.set(0, 4.6, 0);
    this.zoneGroup.add(crest);

    // Interactive Rune Object
    const runeObj = {
      id: zoneData.runeId,
      name: zoneData.runeName,
      type: 'rune_puzzle',
      zoneId: zoneData.id,
      position: new THREE.Vector3(0, 1.5, 0),
      mesh: crest,
      activated: false,
      hint: `【E / 點擊】解開 ${zoneData.runeName} 封印機關`
    };
    this.interactables.push(runeObj);

    // 7 Elemental Crystals encircling the central sanctuary pedestal
    const crystalColors = [0xef4444, 0x38bdf8, 0x22c55e, 0xa855f7, 0xfacc15, 0x06b6d4, 0xf43f5e];
    for (let c = 0; c < 7; c++) {
      const cAng = (c / 7) * Math.PI * 2;
      const cx = Math.cos(cAng) * 3.4;
      const cz = Math.sin(cAng) * 3.4;
      const cMat = new THREE.MeshStandardMaterial({
        color: crystalColors[c],
        roughness: 0.1,
        transparent: true,
        opacity: 0.88,
        emissive: crystalColors[c],
        emissiveIntensity: 0.4
      });
      const cGeo = new THREE.ConeGeometry(0.25, 0.9, 5);
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(cx, 0.65, cz);
      this.zoneGroup.add(cMesh);
    }

    // In Volcano zone: Spawn companion emissaries around the Ancient Temple Altar
    if (zoneData.id === 'volcano') {
      this.spawnTempleCompanions();
    }

    // Spawn 3D Sanctuary Wardrobe Mirror in the zone
    this.buildSanctuaryMirror();
  }

  // --- 🪞 3D 幻境穿衣之鏡 (Sanctuary Wardrobe Mirror) ---
  buildSanctuaryMirror() {
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(-4.5, 0, 3.2);

    // Carpet rug
    const rug = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.7, 0.05, 24),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 })
    );
    rug.position.y = 0.02;
    mirrorGroup.add(rug);

    // Wooden mirror frame
    const frame = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.12, 10, 24),
      new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.5 })
    );
    frame.position.y = 1.6;
    mirrorGroup.add(frame);

    // Reflective glass mirror pane
    const mirrorGlass = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 24),
      new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        metalness: 0.9,
        roughness: 0.05,
        transparent: true,
        opacity: 0.88,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.25
      })
    );
    mirrorGlass.position.y = 1.6;
    mirrorGroup.add(mirrorGlass);

    // Mirror Wooden Stand
    const standL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: 0x854d0e }));
    standL.position.set(-1.1, 0.8, 0);
    mirrorGroup.add(standL);

    const standR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: 0x854d0e }));
    standR.position.set(1.1, 0.8, 0);
    mirrorGroup.add(standR);

    this.zoneGroup.add(mirrorGroup);

    this.interactables.push({
      id: 'sanctuary_wardrobe_mirror',
      name: '幻境穿衣之鏡',
      type: 'wardrobe_mirror',
      position: new THREE.Vector3(-4.5, 1.2, 3.2),
      mesh: mirrorGroup,
      hint: '【E / 點擊】照看穿衣之鏡 (開啟時裝衣櫥)'
    });
  }

  // --- 👥 炎龍神殿盟友夥伴 (Temple Companion NPCs) ---
  spawnTempleCompanions() {
    // Companion 1: 夜影 (Yeying)
    const yeyingNpc = PetModelFactory.createPlayer('yeying');
    yeyingNpc.position.set(-2.5, 0.4, 2.0);
    yeyingNpc.rotation.y = 0.5;
    this.zoneGroup.add(yeyingNpc);
    this.interactables.push({
      id: 'npc_yeying',
      name: '巡林游俠・夜影',
      type: 'companion_npc',
      position: new THREE.Vector3(-2.5, 0.4, 2.0),
      mesh: yeyingNpc,
      dialog: '「古代日記最後一頁的密碼已經解開……只要我們三人的心靈連繫在一起，任何黑霧都無法阻擋我們前進。」'
    });

    // Companion 2: 晨曦 (Chenxi)
    const chenxiNpc = PetModelFactory.createPlayer('chenxi');
    chenxiNpc.position.set(2.5, 0.4, 2.0);
    chenxiNpc.rotation.y = -0.5;
    this.zoneGroup.add(chenxiNpc);
    this.interactables.push({
      id: 'npc_chenxi',
      name: '森之精靈・晨曦',
      type: 'companion_npc',
      position: new THREE.Vector3(2.5, 0.4, 2.0),
      mesh: chenxiNpc,
      dialog: '「大自然的精靈們正在為我們歌唱！魔寵體內的黑霧毒素已被生命祝福撫平，讓我們一起出發吧！」'
    });
  }

  // --- 🍓 散落資源生成 (Gatherables: Berries, Crystals, Pet Eggs) ---
  spawnGatherables(zoneId) {
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, transparent: true, opacity: 0.9 });
    const eggMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });

    // 1. Berry Bushes (8 per map)
    for (let b = 0; b < 8; b++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 10 + Math.random() * 22;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const bushGroup = new THREE.Group();
      bushGroup.position.set(x, 0.4, z);

      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55), woodMat);
      bushGroup.add(foliage);

      for (let i = 0; i < 4; i++) {
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), berryMat);
        berry.position.set((Math.random() - 0.5) * 0.6, 0.2 + Math.random() * 0.3, (Math.random() - 0.5) * 0.6);
        bushGroup.add(berry);
      }
      this.zoneGroup.add(bushGroup);

      this.interactables.push({
        id: `berry_${b}`,
        name: '幻境彩虹漿果叢',
        type: 'gatherable',
        itemType: 'berry',
        itemCount: 2,
        position: new THREE.Vector3(x, 0.5, z),
        mesh: bushGroup,
        collected: false,
        hint: '【E / 點擊】採集幻境彩虹漿果 🍇'
      });
    }

    // 2. Elemental Crystals (6 per map)
    const stoneTypeMap = {
      forest: 'nature_stone',
      tundra: 'ice_stone',
      volcano: 'fire_stone',
      ruins: 'shadow_stone',
      thunder_crag: 'thunder_stone',
      celestial_shrine: 'light_stone'
    };
    const stoneItem = stoneTypeMap[zoneId] || 'nature_stone';

    for (let c = 0; c < 6; c++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 12 + Math.random() * 25;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const crystalGroup = new THREE.Group();
      crystalGroup.position.set(x, 0.4, z);

      for (let s = 0; s < 3; s++) {
        const h = 0.5 + Math.random() * 0.4;
        const shard = new THREE.Mesh(new THREE.ConeGeometry(0.15, h, 5), crystalMat);
        shard.position.set((s - 1) * 0.2, h / 2, (Math.random() - 0.5) * 0.2);
        shard.rotation.z = (s - 1) * 0.25;
        crystalGroup.add(shard);
      }
      this.zoneGroup.add(crystalGroup);

      this.interactables.push({
        id: `crystal_${c}`,
        name: '元素魔晶礦脈',
        type: 'gatherable',
        itemType: stoneItem,
        itemCount: 1,
        position: new THREE.Vector3(x, 0.4, z),
        mesh: crystalGroup,
        collected: false,
        hint: '【E / 點擊】開採元素進化石 💎'
      });
    }

    // 3. Rare Pet Egg Nest (2 per map)
    const eggTypeMap = {
      forest: 'egg_nature',
      tundra: 'egg_ice',
      volcano: 'egg_fire',
      ruins: 'egg_shadow',
      thunder_crag: 'egg_thunder',
      celestial_shrine: 'egg_light'
    };
    const eggItem = eggTypeMap[zoneId] || 'egg_nature';

    for (let e = 0; e < 2; e++) {
      const ang = (e === 0 ? 0.8 : 3.8) + (Math.random() - 0.5) * 0.4;
      const rad = 16 + Math.random() * 12;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;

      const eggNest = new THREE.Group();
      eggNest.position.set(x, 0.25, z);

      // Nest
      const nest = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 6, 12), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      nest.rotation.x = Math.PI / 2;
      eggNest.add(nest);

      // Egg
      const eggGeo = new THREE.SphereGeometry(0.28, 10, 10);
      eggGeo.scale(1, 1.35, 1);
      const eggMesh = new THREE.Mesh(eggGeo, eggMat);
      eggMesh.position.y = 0.22;
      eggNest.add(eggMesh);

      this.zoneGroup.add(eggNest);

      this.interactables.push({
        id: `egg_${e}`,
        name: '野外魔寵蛋窩',
        type: 'gatherable',
        itemType: eggItem,
        itemCount: 1,
        position: new THREE.Vector3(x, 0.3, z),
        mesh: eggNest,
        collected: false,
        hint: '【E / 點擊】抱起野生魔寵蛋 🥚'
      });
    }
  }

  // --- 🐾 單隻野生動物生成 ---
  spawnSingleWildAnimal(speciesId, x, z) {
    const monster = PetModelFactory.createPet(speciesId);
    monster.position.set(x, 0, z);

    const spec = PET_SPECIES[speciesId];
    const elem = spec ? ELEMENTS[spec.element] : null;
    const badge = PetModelFactory.createNameBadge(
      spec ? spec.name : speciesId,
      '野生動物',
      elem ? elem.icon : '🐾',
      elem ? elem.color : '#38bdf8'
    );
    badge.position.y = 0.58;
    monster.add(badge);

    this.zoneGroup.add(monster);

    const isHopper = speciesId === 'bunny_1' || speciesId === 'owl_1' || speciesId === 'thunder_1';
    const isFlyer = speciesId.startsWith('shadow') || speciesId === 'light_1' || speciesId === 'owl_1';
    const isWaddler = speciesId.startsWith('panda') || speciesId === 'turtle_1';

    const animalEntry = {
      id: `wild_${speciesId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      speciesId: speciesId,
      name: spec ? spec.name : speciesId,
      icon: spec ? spec.icon : '🐾',
      mesh: monster,
      basePos: new THREE.Vector3(x, 0, z),
      targetPos: new THREE.Vector3(x, 0, z),
      moveTimer: Math.random() * 2.5,
      speed: isWaddler ? 1.2 : (isHopper ? 2.5 : 1.9 + Math.random() * 0.7),
      isHopper: isHopper,
      isFlyer: isFlyer,
      isWaddler: isWaddler,
      seed: Math.random() * 100,
      lifetime: 0
    };

    this.wildMonsters.push(animalEntry);
    return animalEntry;
  }

  // --- ⚔️ 野生遊蕩動物與魔物生態 (Wild Animals & Spirits Ecosystem) ---
  spawnWildMonsters(zoneData) {
    this.currentZoneData = zoneData;
    this.maxWildAnimals = 22; // 維持理想生態數量上限，既熱鬧又維持平衡
    this.minWildAnimals = 16;
    this.animalSpawnTimer = 0;

    const spirits = zoneData.wildSpirits || [];
    const totalAnimalsToSpawn = spirits.length * 3 + 2; // 18~20 animals per map zone
    let animalIdx = 0;

    spirits.forEach((speciesId, sIdx) => {
      // 3 to 4 individuals per animal species for rich density
      const count = (sIdx % 2 === 0) ? 4 : 3;

      for (let i = 0; i < count; i++) {
        // Distribute in a ring around the map (rad 8 to 32)
        const angle = (animalIdx / totalAnimalsToSpawn) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
        const rad = 8.5 + Math.random() * 24.5;
        const x = Math.cos(angle) * rad;
        const z = Math.sin(angle) * rad;

        this.spawnSingleWildAnimal(speciesId, x, z);
        animalIdx++;
      }
    });
  }

  // --- ✨ 飄浮環境粒子 (Atmospheric Shimmer Particles) ---
  spawnAtmosphereParticles(zoneId) {
    const pCount = 50;
    const pGeo = new THREE.DodecahedronGeometry(0.12);
    const pColorMap = {
      forest: 0x86efac,
      tundra: 0xbae6fd,
      volcano: 0xfca5a5,
      ruins: 0xd8b4fe,
      thunder_crag: 0xfef08a,
      celestial_shrine: 0xfef9c3
    };
    const pMat = new THREE.MeshBasicMaterial({ color: pColorMap[zoneId] || 0xffffff, transparent: true, opacity: 0.65 });

    for (let i = 0; i < pCount; i++) {
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set(
        (Math.random() - 0.5) * 60,
        1 + Math.random() * 6,
        (Math.random() - 0.5) * 60
      );
      this.zoneGroup.add(p);
      this.particles.push({
        mesh: p,
        velY: 0.2 + Math.random() * 0.3,
        seed: Math.random() * 10
      });
    }
  }

  update(delta, playerPos = null) {
    // 0. Animate 3D 遠古傳送石碑 (Teleport Waypoint Monolith)
    if (this.teleportMonolithData) {
      const { portalRing, coreCrystal, orbitStones } = this.teleportMonolithData;
      if (portalRing) {
        portalRing.rotation.y += 0.022;
        portalRing.rotation.z += 0.012;
      }
      if (coreCrystal) {
        coreCrystal.rotation.x += 0.028;
        coreCrystal.rotation.y += 0.035;
        coreCrystal.position.y = 2.3 + Math.sin(Date.now() * 0.003) * 0.14;
      }
      if (orbitStones && orbitStones.length > 0) {
        const time = Date.now() * 0.0018;
        orbitStones.forEach((stone, idx) => {
          const ang = time + (idx * Math.PI * 2) / orbitStones.length;
          stone.position.set(
            Math.cos(ang) * 1.5,
            2.3 + Math.sin(time * 2.5 + idx) * 0.28,
            Math.sin(ang) * 1.5
          );
          stone.rotation.y += 0.04;
        });
      }
    }

    // 1. Animate particles
    this.particles.forEach(p => {
      p.mesh.position.y += p.velY * delta;
      p.mesh.position.x += Math.sin(Date.now() * 0.001 + p.seed) * delta * 0.3;
      if (p.mesh.position.y > 7.5) {
        p.mesh.position.y = 0.5;
      }
    });

    // 2. Animate Wild Animals & Monsters (wandering around base positions)
    this.wildMonsters.forEach(m => {
      m.moveTimer -= delta;
      if (m.moveTimer <= 0) {
        m.moveTimer = 2.5 + Math.random() * 3.5;
        const wanderDist = m.isWaddler ? 4.5 : 7.0;
        const rx = (Math.random() - 0.5) * wanderDist;
        const rz = (Math.random() - 0.5) * wanderDist;
        m.targetPos.set(m.basePos.x + rx, 0, m.basePos.z + rz);
      }

      const curPos = m.mesh.position;
      const toTarget = new THREE.Vector3().subVectors(m.targetPos, curPos);
      toTarget.y = 0;
      const dist = toTarget.length();
      const isMoving = dist > 0.25;

      if (isMoving) {
        toTarget.normalize();
        curPos.addScaledVector(toTarget, m.speed * delta);
        const lookAngle = Math.atan2(toTarget.z, toTarget.x);
        m.mesh.rotation.y = -lookAngle;

        // Custom locomotion animations per animal archetype
        if (m.isFlyer) {
          m.mesh.position.y = 0.75 + Math.sin(Date.now() * 0.004 + m.seed) * 0.22;
          m.mesh.rotation.z = Math.sin(Date.now() * 0.006) * 0.12;
        } else if (m.isHopper) {
          // Dynamic high-bounce hopping for rabbits & owls
          m.mesh.position.y = Math.abs(Math.sin(Date.now() * 0.012 * m.speed)) * 0.32;
        } else if (m.isWaddler) {
          // Adorable rolling waddle for pandas & turtles
          m.mesh.position.y = Math.abs(Math.sin(Date.now() * 0.007 * m.speed)) * 0.08;
          m.mesh.rotation.z = Math.sin(Date.now() * 0.009 * m.speed) * 0.12;
        } else {
          // Energetic run for quadruped foxes, wolves & deers
          m.mesh.position.y = Math.abs(Math.sin(Date.now() * 0.009 * m.speed)) * 0.16;
        }
      } else {
        // Idle breathing / resting
        if (m.isFlyer) {
          m.mesh.position.y = 0.65 + Math.sin(Date.now() * 0.0025 + m.seed) * 0.15;
        } else if (m.isHopper) {
          m.mesh.position.y = 0;
          m.mesh.rotation.z = Math.sin(Date.now() * 0.003 + m.seed) * 0.04;
        } else {
          m.mesh.position.y = Math.sin(Date.now() * 0.002 + m.seed) * 0.02;
          m.mesh.rotation.z = 0;
        }
      }

      // 🐾 全身活潑關節動態（小腳前後邁步踏步、耳朵抖動、尾巴靈動搖擺、翅膀拍打）
      PetModelFactory.animatePetModel(m.mesh, isMoving, Date.now(), m.seed);

      // 🔊 靠近玩家時發出可愛專屬叫聲
      if (playerPos && m.mesh.position.distanceTo(playerPos) < 4.2) {
        if (!m.cryCooldown || Date.now() - m.cryCooldown > 6500) {
          m.cryCooldown = Date.now();
          sound.playPetCry(m.speciesId);
        }
      }
    });

    // 3. 🐾 動物生態動態循環生成（持續自然循環，維持平衡生態）
    this.animalSpawnTimer = (this.animalSpawnTimer || 0) + delta;
    if (this.animalSpawnTimer >= 3.8) {
      this.animalSpawnTimer = 0;
      const spirits = this.currentZoneData ? this.currentZoneData.wildSpirits : null;
      if (spirits && spirits.length > 0) {
        if (this.wildMonsters.length < (this.maxWildAnimals || 22)) {
          const randomSpecies = spirits[Math.floor(Math.random() * spirits.length)];
          const ang = Math.random() * Math.PI * 2;
          const rad = 22 + Math.random() * 9;
          this.spawnSingleWildAnimal(randomSpecies, Math.cos(ang) * rad, Math.sin(ang) * rad);
        }
      }
    }
  }

  // 🔥 熔岩危險判定（踩到熔岩造成燙傷與扣血）
  checkLavaHazard(pos) {
    if (this.currentZoneId !== 'volcano' || !this.lavaAreas || this.lavaAreas.length === 0) return false;
    for (const area of this.lavaAreas) {
      const d = Math.hypot(pos.x - area.x, pos.z - area.z);
      if (d < area.r) return true;
    }
    return false;
  }

  // 🍎 搖晃果樹掉落鮮果
  shakeFruitTree(treeObj) {
    if (!treeObj) return null;
    if (treeObj.shakeCooldown && Date.now() - treeObj.shakeCooldown < 3500) return null;
    treeObj.shakeCooldown = Date.now();
    sound.playTreeShake();
    setTimeout(() => sound.playFruitDrop(), 160);

    // 樹身彈性晃動視覺特效
    if (treeObj.mesh) {
      let t = 0;
      const originRotZ = treeObj.mesh.rotation.z;
      const interval = setInterval(() => {
        t += 0.22;
        treeObj.mesh.rotation.z = originRotZ + Math.sin(t * 14) * 0.08 * Math.exp(-t * 0.8);
        if (t > 2.0) {
          clearInterval(interval);
          treeObj.mesh.rotation.z = originRotZ;
        }
      }, 30);
    }

    const count = 2 + Math.floor(Math.random() * 2);
    const item = treeObj.fruitType || 'apple';
    const name = item === 'orange' ? '陽光金蜜柑' : '蜜糖紅蘋果';
    return { item, count, name };
  }

  findNearestInteractive(playerPos, maxDist = 4.2) {
    let closest = null;
    let minDist = maxDist;

    // 1. Gatherables, Trees, Cauldron, Bed, Fishing Pier and Runes
    for (const obj of this.interactables) {
      if (obj.collected) continue;
      const pos = obj.position || (obj.mesh ? obj.mesh.position : null);
      if (!pos) continue;
      const d = playerPos.distanceTo(pos);
      if (d < minDist) {
        minDist = d;
        closest = {
          type: (obj.type === 'gatherable' ? 'gathering' : obj.type),
          data: obj,
          position: pos,
          dist: d
        };
      }
    }

    // 2. Wild Monsters
    for (const m of this.wildMonsters) {
      if (!m.mesh || !m.mesh.parent) continue;
      const d = playerPos.distanceTo(m.mesh.position);
      if (d < minDist) {
        minDist = d;
        closest = {
          type: 'monster',
          data: m,
          position: m.mesh.position,
          dist: d
        };
      }
    }

    return closest;
  }

  gatherResource(target) {
    const obj = target.data || target;
    if (!obj || obj.collected) return null;
    obj.collected = true;
    if (obj.mesh) {
      this.zoneGroup.remove(obj.mesh);
    }
    return {
      item: obj.itemType,
      count: obj.itemCount || 1,
      name: obj.name
    };
  }
}
