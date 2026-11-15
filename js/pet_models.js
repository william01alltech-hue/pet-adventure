// Procedural 3D Model Generator for 《魔寵：幻境之旅》
import * as THREE from './three.module.js';

export class PetModelFactory {
  // --- 1. Player Character with Multi-Character Support & Wardrobe Customization ---
  static createPlayer(characterId = 'xingyue', custom = {}) {
    const group = new THREE.Group();
    group.characterId = characterId;

    const hairColorHex = custom.hairColor || (characterId === 'xingyue' ? 0xf1f5f9 : (characterId === 'yeying' ? 0x0f172a : 0xb45309));
    const eyeColorHex = custom.eyeColor || (characterId === 'xingyue' ? 0x38bdf8 : (characterId === 'yeying' ? 0x0284c7 : 0x16a34a));

    // Outfit Colors
    let clothesColorHex = 0x38bdf8;
    let capeColorHex = 0x2563eb;
    const outfitType = custom.outfit || (characterId === 'xingyue' ? 'mage_robe' : (characterId === 'yeying' ? 'knight_coat' : 'druid_dress'));

    switch (outfitType) {
      case 'red_cape':
        clothesColorHex = 0xf8fafc;
        capeColorHex = 0xdc2626; // Big red cloak
        break;
      case 'knight_coat':
        clothesColorHex = 0x1e293b;
        capeColorHex = 0x2563eb;
        break;
      case 'adventurer':
        clothesColorHex = 0x78350f;
        capeColorHex = 0xd97706;
        break;
      case 'classic_dress':
        clothesColorHex = 0x334155;
        capeColorHex = 0x0f766e;
        break;
      case 'wolf_suit':
        clothesColorHex = 0x475569;
        capeColorHex = 0x64748b;
        break;
      case 'mage_robe':
        clothesColorHex = 0xffffff;
        capeColorHex = 0x38bdf8;
        break;
      case 'druid_dress':
        clothesColorHex = 0x22c55e;
        capeColorHex = 0xfef08a;
        break;
    }

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.55 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColorHex, roughness: 0.65 });
    const eyeWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeIrisMat = new THREE.MeshBasicMaterial({ color: eyeColorHex });
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeLashMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.55 });
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xbe123c });

    const clothesMat = new THREE.MeshStandardMaterial({ color: clothesColorHex, roughness: 0.55 });
    const clothesAccentMat = new THREE.MeshStandardMaterial({ color: clothesColorHex, roughness: 0.4, metalness: 0.1 });
    const capeMat = new THREE.MeshStandardMaterial({ color: capeColorHex, roughness: 0.6, side: THREE.DoubleSide });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.25 });
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.7 });
    const bootsMat = new THREE.MeshStandardMaterial({ color: 0x271911, roughness: 0.6 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.3 });

    // === 1. Head & Expressive Anime Face ===
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.25;

    // Sculpted anime head with soft chin
    const headGeo = new THREE.SphereGeometry(0.31, 18, 18);
    headGeo.scale(1, 1.08, 0.96);
    const head = new THREE.Mesh(headGeo, skinMat);
    headGroup.add(head);

    // Chin taper
    const chinGeo = new THREE.ConeGeometry(0.16, 0.2, 8);
    chinGeo.rotateX(Math.PI);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, -0.22, 0.08);
    headGroup.add(chin);

    // Anime Eyes (Large expressive anime eyes with lashes, iris, pupil & double sparkle)
    [-0.105, 0.105].forEach(x => {
      const eyeSide = new THREE.Group();
      eyeSide.position.set(x, 0.03, 0.312);
      eyeSide.rotation.y = (x < 0 ? 0.08 : -0.08);

      // Eye White Backdrop
      const sclera = new THREE.Mesh(new THREE.PlaneGeometry(0.095, 0.125), eyeWhite);
      eyeSide.add(sclera);

      // Upper Eyelash Wing
      const lash = new THREE.Mesh(new THREE.PlaneGeometry(0.105, 0.022), eyeLashMat);
      lash.position.set(0, 0.055, 0.002);
      lash.rotation.z = (x < 0 ? -0.12 : 0.12);
      eyeSide.add(lash);

      // Iris
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.042, 16), eyeIrisMat);
      iris.position.set(0, -0.005, 0.003);
      eyeSide.add(iris);

      // Pupil
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.022, 12), eyePupilMat);
      pupil.position.set(0, -0.005, 0.004);
      eyeSide.add(pupil);

      // Big Sparkle Highlight
      const sparkMain = new THREE.Mesh(new THREE.CircleGeometry(0.015, 8), eyeHighlightMat);
      sparkMain.position.set((x < 0 ? 0.012 : -0.012), 0.016, 0.005);
      eyeSide.add(sparkMain);

      // Tiny Secondary Twinkle
      const sparkSub = new THREE.Mesh(new THREE.CircleGeometry(0.007, 6), eyeHighlightMat);
      sparkSub.position.set((x < 0 ? -0.014 : 0.014), -0.022, 0.005);
      eyeSide.add(sparkSub);

      headGroup.add(eyeSide);

      // Soft Rosy Blush Cheeks
      const blush = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), blushMat);
      blush.position.set(x * 1.55, -0.075, 0.295);
      blush.rotation.y = (x < 0 ? 0.28 : -0.28);
      headGroup.add(blush);
    });

    // Cute Anime Smile Mouth
    const mouthGeo = new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI * 0.85);
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, -0.12, 0.315);
    mouth.rotation.x = Math.PI * 0.95;
    headGroup.add(mouth);

    // Fine Anime Eyebrows
    [-0.105, 0.105].forEach(x => {
      const brow = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.012), eyeLashMat);
      brow.position.set(x, 0.125, 0.31);
      brow.rotation.z = (x < 0 ? 0.08 : -0.08);
      headGroup.add(brow);
    });

    // Elf Pointed Ears for 晨曦 (Chenxi)
    if (characterId === 'chenxi') {
      [-0.32, 0.32].forEach(x => {
        const elfEarGeo = new THREE.ConeGeometry(0.065, 0.25, 6);
        const elfEar = new THREE.Mesh(elfEarGeo, skinMat);
        elfEar.position.set(x, 0.02, -0.03);
        elfEar.rotation.z = (x < 0 ? 1.25 : -1.25);
        elfEar.rotation.x = -0.3;
        headGroup.add(elfEar);
      });
    }

    // === 2. Multi-Layered Flowing Anime Hair ===
    // Hair Back & Top Cap (Tilted back so front forehead and eyes remain completely open and unobstructed)
    const hairCapGeo = new THREE.SphereGeometry(0.33, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.set(0, 0.08, -0.05);
    hairCap.rotation.x = -0.32;
    headGroup.add(hairCap);

    // Back hair volume
    const backHairGeo = new THREE.SphereGeometry(0.33, 14, 14);
    backHairGeo.scale(1.02, 1.05, 0.85);
    const backHair = new THREE.Mesh(backHairGeo, hairMat);
    backHair.position.set(0, 0.02, -0.09);
    headGroup.add(backHair);

    // Playful Anime Ahoge / Cowlick on crown
    const ahoge = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 6, 14, Math.PI * 0.8), hairMat);
    ahoge.position.set(0.04, 0.38, 0.08);
    ahoge.rotation.y = 0.5;
    ahoge.rotation.z = -0.3;
    headGroup.add(ahoge);

    // Face-framing Side Locks (Positioned beside the cheeks, not in front of eyes)
    [-0.28, 0.28].forEach(x => {
      const lockGeo = new THREE.ConeGeometry(0.065, 0.42, 6);
      const lock = new THREE.Mesh(lockGeo, hairMat);
      lock.position.set(x, -0.04, 0.12);
      lock.rotation.z = (x < 0 ? -0.22 : 0.22);
      lock.rotation.x = 0.1;
      headGroup.add(lock);
    });

    // Sweeping Anime Bangs (Arched high above the eyebrows so eyes are 100% visible!)
    const bangOffsets = [
      { x: -0.16, y: 0.24, z: 0.24, rotZ: 0.35, len: 0.11 },
      { x: -0.09, y: 0.26, z: 0.25, rotZ: 0.2, len: 0.10 },
      { x: -0.03, y: 0.27, z: 0.26, rotZ: 0.06, len: 0.09 },
      { x: 0.03, y: 0.27, z: 0.26, rotZ: -0.06, len: 0.09 },
      { x: 0.09, y: 0.26, z: 0.25, rotZ: -0.2, len: 0.10 },
      { x: 0.16, y: 0.24, z: 0.24, rotZ: -0.35, len: 0.11 }
    ];
    bangOffsets.forEach(b => {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.045, b.len, 5), hairMat);
      bang.position.set(b.x, b.y, b.z);
      bang.rotation.z = b.rotZ;
      bang.rotation.x = -0.28;
      headGroup.add(bang);
    });

    // Hairstyle Specific Extensions
    const hStyle = custom.hairStyle || (characterId === 'yeying' ? 'short' : 'long');
    if (hStyle === 'long' || hStyle === 'wavy') {
      for (let s = -2; s <= 2; s++) {
        const hairStrandGeo = new THREE.ConeGeometry(0.1, 0.82, 6);
        const strand = new THREE.Mesh(hairStrandGeo, hairMat);
        strand.position.set(s * 0.11, -0.32, -0.18 - Math.abs(s) * 0.04);
        strand.rotation.x = 0.25;
        strand.rotation.z = s * 0.12;
        headGroup.add(strand);
      }
    } else if (hStyle === 'twintail') {
      [-0.34, 0.34].forEach(tx => {
        const tailMesh = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.58, 6), hairMat);
        tailMesh.position.set(tx, -0.15, -0.1);
        tailMesh.rotation.z = (tx < 0 ? 0.45 : -0.45);
        headGroup.add(tailMesh);

        // Ribbon Tie
        const tie = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 4, 10), goldTrimMat);
        tie.position.set(tx, 0.08, -0.08);
        headGroup.add(tie);
      });
    }

    // Headwear Accessories
    const headwearType = custom.headwear || (characterId === 'xingyue' ? 'magic_halo' : (characterId === 'chenxi' ? 'flower_crown' : 'none'));
    if (headwearType === 'magic_halo') {
      // 星月浮空魔環 (Orbiting celestial ring with 3 star gems)
      const haloGeo = new THREE.TorusGeometry(0.46, 0.022, 8, 28);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(0, 0.15, -0.25);
      headGroup.add(halo);

      for (let g = 0; g < 3; g++) {
        const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.045), goldTrimMat);
        const ang = (g / 3) * Math.PI * 2;
        star.position.set(Math.cos(ang) * 0.46, 0.15 + Math.sin(ang) * 0.46 * 0.3, -0.25);
        headGroup.add(star);
      }
    } else if (headwearType === 'flower_crown') {
      // 晨曦編織花冠
      const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.028, 6, 20), new THREE.MeshStandardMaterial({ color: 0x166534 }));
      wreath.position.set(0, 0.22, 0);
      wreath.rotation.x = Math.PI / 2;
      headGroup.add(wreath);

      const fColors = [0xf472b6, 0xfacc15, 0x38bdf8, 0xf43f5e, 0xa78bfa];
      for (let f = 0; f < 5; f++) {
        const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.048), new THREE.MeshBasicMaterial({ color: fColors[f] }));
        const ang = (f / 5) * Math.PI * 2;
        flower.position.set(Math.cos(ang) * 0.35, 0.24, Math.sin(ang) * 0.35);
        headGroup.add(flower);
      }
    } else if (headwearType === 'red_ribbon') {
      const bowGeo = new THREE.BoxGeometry(0.26, 0.12, 0.08);
      const bow = new THREE.Mesh(bowGeo, new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      bow.position.set(0, 0.38, 0.06);
      headGroup.add(bow);
    }

    group.add(headGroup);

    // === 3. Stylized Contoured Adventurer Outfit (Not primitive blocks!) ===
    const bodyGroup = new THREE.Group();

    // Contoured Tunic / Robe Torso
    const torsoGeo = new THREE.CylinderGeometry(0.21, 0.27, 0.52, 14);
    const torso = new THREE.Mesh(torsoGeo, clothesMat);
    torso.position.y = 0.82;
    bodyGroup.add(torso);

    // Ornate Stand-up Collar with Gold Brooch
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.028, 6, 16, Math.PI * 1.2), clothesAccentMat);
    collar.position.set(0, 1.05, 0.03);
    collar.rotation.x = Math.PI * 0.65;
    bodyGroup.add(collar);

    const brooch = new THREE.Mesh(new THREE.OctahedronGeometry(0.055), goldTrimMat);
    brooch.position.set(0, 1.02, 0.22);
    bodyGroup.add(brooch);

    // Contoured Waist Belt with Gold Buckle & Leather Satchel
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.255, 0.09, 14), leatherMat);
    belt.position.y = 0.68;
    bodyGroup.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.03), goldTrimMat);
    buckle.position.set(0, 0.68, 0.26);
    bodyGroup.add(buckle);

    // Adventurer Belt Pouch
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.08), leatherMat);
    pouch.position.set(0.25, 0.64, 0.08);
    pouch.rotation.y = -0.3;
    bodyGroup.add(pouch);

    // Glowing Mana Vial Hanging on Belt
    const vial = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.06, 4, 8), new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9
    }));
    vial.position.set(-0.25, 0.63, 0.08);
    bodyGroup.add(vial);

    // Flared Skirt / Coat Tails with Gold Hemline
    const skirtGeo = new THREE.ConeGeometry(0.36, 0.32, 14, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, clothesMat);
    skirt.position.y = 0.52;
    bodyGroup.add(skirt);

    const skirtHem = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.018, 4, 18), goldTrimMat);
    skirtHem.position.y = 0.38;
    skirtHem.rotation.x = Math.PI / 2;
    bodyGroup.add(skirtHem);

    // Dual-Layer Flowing Adventurer Cape
    const capeGeo = new THREE.PlaneGeometry(0.48, 0.72, 3, 3);
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 0.78, -0.24);
    cape.rotation.x = 0.22;
    bodyGroup.add(cape);
    group.cape = cape;

    // === 4. Anime Contoured Limbs & Adventurer Boots ===
    // Arms with Lantern Sleeves & Gold Bracers
    const armGroupL = new THREE.Group();
    armGroupL.position.set(-0.32, 0.82, 0);
    const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.44, 8);
    const armL = new THREE.Mesh(armGeo, clothesMat);
    armL.position.y = -0.16;
    armGroupL.add(armL);
    const bracerL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.1, 8), goldTrimMat);
    bracerL.position.y = -0.26;
    armGroupL.add(bracerL);
    bodyGroup.add(armGroupL);
    group.armL = armGroupL;

    const armGroupR = new THREE.Group();
    armGroupR.position.set(0.32, 0.82, 0);
    const armR = new THREE.Mesh(armGeo, clothesMat);
    armR.position.y = -0.16;
    armGroupR.add(armR);
    const bracerR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.1, 8), goldTrimMat);
    bracerR.position.y = -0.26;
    armGroupR.add(bracerR);
    bodyGroup.add(armGroupR);
    group.armR = armGroupR;

    // Legs with Contoured Adventurer Boots & Rolled Cuffs
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.45, 8), clothesMat);
    legL.position.set(-0.13, 0.32, 0);
    bodyGroup.add(legL);
    group.legL = legL;

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.45, 8), clothesMat);
    legR.position.set(0.13, 0.32, 0);
    bodyGroup.add(legR);
    group.legR = legR;

    // Sculpted Boots with Rolled Cuffs, Gold Straps & Curved Soles (Not rectangular boxes!)
    [-0.13, 0.13].forEach(bx => {
      const bootGroup = new THREE.Group();
      bootGroup.position.set(bx, 0.12, 0.02);

      // Folded Leather Cuff
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.025, 6, 14), leatherMat);
      cuff.position.y = 0.08;
      cuff.rotation.x = Math.PI / 2;
      bootGroup.add(cuff);

      // Boot Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.082, 0.16, 8), bootsMat);
      bootGroup.add(shaft);

      // Curved Boot Foot & Sole
      const foot = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, 0.14, 4, 8), bootsMat);
      foot.rotation.x = Math.PI / 2;
      foot.position.set(0, -0.06, 0.06);
      bootGroup.add(foot);

      // Gold Buckle Strap
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.06), goldTrimMat);
      strap.position.set(0, -0.02, 0.07);
      bootGroup.add(strap);

      bodyGroup.add(bootGroup);
    });

    // Signature Character Equipment
    if (characterId === 'xingyue') {
      // 星月：星宿大魔導之杖
      const staff = new THREE.Group();
      staff.position.set(0.38, 0.72, 0.18);
      staff.rotation.x = 0.2;

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.022, 1.25, 8), leatherMat);
      staff.add(shaft);

      const armillary = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 6, 16), goldTrimMat);
      armillary.position.y = 0.62;
      staff.add(armillary);

      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.07), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      gem.position.y = 0.62;
      staff.add(gem);

      bodyGroup.add(staff);
    } else if (characterId === 'yeying') {
      // 夜影：尖刺肩鎧 + 背負名刀
      const pauldron = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 5), silverMat);
      pauldron.position.set(-0.35, 0.95, 0);
      pauldron.rotation.z = -0.55;
      bodyGroup.add(pauldron);

      const katana = new THREE.Group();
      katana.position.set(0.18, 0.88, -0.28);
      katana.rotation.z = 0.58;

      const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.82, 0.03), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      katana.add(scabbard);

      const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.015, 8), goldTrimMat);
      tsuba.position.y = 0.42;
      katana.add(tsuba);

      const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.22, 6), leatherMat);
      hilt.position.y = 0.54;
      katana.add(hilt);

      bodyGroup.add(katana);
    } else if (characterId === 'chenxi') {
      // 晨曦：生靈萬木權杖
      const druidStaff = new THREE.Group();
      druidStaff.position.set(0.38, 0.72, 0.18);
      druidStaff.rotation.x = 0.2;

      const wood = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.03, 1.22, 8), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
      druidStaff.add(wood);

      const branch = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12, Math.PI), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
      branch.position.y = 0.6;
      druidStaff.add(branch);

      const dewdrop = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      dewdrop.position.y = 0.62;
      druidStaff.add(dewdrop);

      bodyGroup.add(druidStaff);
    }

    group.add(bodyGroup);
    return group;
  }

  // --- 2. Pet Spirits Generator ---
  static createPet(speciesId) {
    const group = new THREE.Group();
    group.speciesId = speciesId;
    group.tailGroup = new THREE.Group();
    group.earsGroup = new THREE.Group();
    group.wingsGroup = new THREE.Group();

    switch (speciesId) {
      case 'fire_1':
        this.buildFox(group, 0xef4444, 0xfef08a, 1, 0.75);
        break;
      case 'fire_2':
        this.buildFox(group, 0xdc2626, 0xf97316, 2, 1.0);
        break;
      case 'fire_3':
        this.buildFox(group, 0xb91c1c, 0xfacc15, 9, 1.35, true);
        break;
      case 'ice_1':
        this.buildWolf(group, 0x38bdf8, 0xe0f2fe, 0.75);
        break;
      case 'ice_2':
        this.buildWolf(group, 0x0284c7, 0xbae6fd, 1.05, true);
        break;
      case 'ice_3':
        this.buildWolf(group, 0x0369a1, 0xf0fdf4, 1.4, true, true);
        break;
      case 'nature_1':
        this.buildDeer(group, 0x4ade80, 0xfef08a, 0.75, 1);
        break;
      case 'nature_2':
        this.buildDeer(group, 0x16a34a, 0xfbcfe8, 1.05, 2);
        break;
      case 'nature_3':
        this.buildDeer(group, 0x15803d, 0xf472b6, 1.4, 3, true);
        break;
      case 'shadow_1':
        this.buildDragonBat(group, 0x7e22ce, 0xc084fc, 0.75, false);
        break;
      case 'shadow_2':
        this.buildDragonBat(group, 0x581c87, 0xe879f9, 1.05, false, true);
        break;
      case 'shadow_3':
        this.buildDragonBat(group, 0x3b0764, 0xf43f5e, 1.45, true, true);
        break;
      case 'thunder_1':
        this.buildThunderBeast(group, 0xfacc15, 0x38bdf8, 0.75, 1, false);
        break;
      case 'thunder_2':
        this.buildThunderBeast(group, 0xeab308, 0x06b6d4, 1.05, 2, false);
        break;
      case 'thunder_3':
        this.buildThunderBeast(group, 0xb45309, 0x38bdf8, 1.45, 3, true);
        break;
      case 'light_1':
        this.buildHolyCreature(group, 0xffffff, 0xfacc15, 0.75, 1, false);
        break;
      case 'light_2':
        this.buildHolyCreature(group, 0xfef9c3, 0xf59e0b, 1.08, 2, false);
        break;
      case 'light_3':
        this.buildHolyCreature(group, 0xfffbeb, 0xeab308, 1.45, 3, true);
        break;
      case 'water_1':
        this.buildWaterSpirit(group, 0x38bdf8, 0x06b6d4, 0.75, 1, false);
        break;
      case 'water_2':
        this.buildWaterSpirit(group, 0x0284c7, 0x38bdf8, 1.05, 2, false);
        break;
      case 'water_3':
        this.buildWaterSpirit(group, 0x0369a1, 0x06b6d4, 1.45, 3, true);
        break;
      case 'panda_1':
        this.buildPanda(group, 0.78, 1);
        break;
      case 'panda_2':
        this.buildPanda(group, 1.18, 2);
        break;
      case 'bunny_1':
        this.buildRabbit(group, 0.75);
        break;
      case 'owl_1':
        this.buildOwl(group, 0.75);
        break;
      case 'turtle_1':
        this.buildTurtle(group, 0.82);
        break;
      case 'cat_1':
        this.buildCat(group, 0.75);
        break;
      case 'dog_1':
        this.buildDog(group, 0.78);
        break;
      default:
        this.buildFox(group, 0xef4444, 0xfef08a, 1, 0.8);
        break;
    }

    this.setupPetArticulations(group);
    return group;
  }

  // 🐾 自動綁定肢體關節（小腳、耳朵、翅膀、尾巴），確保 100% 都有生動靈活的關節動作
  static setupPetArticulations(group) {
    if (!group.legs) group.legs = [];
    if (!group.ears) group.ears = [];

    // 若模型未手動註冊小腳，自動遍歷尋找底部的四肢並封裝為可擺動關節 Pivot
    if (group.legs.length === 0) {
      const legCandidates = [];
      group.traverse(child => {
        if (child.isMesh && child.position.y <= 0.28 && child.position.y >= 0.01 && Math.hypot(child.position.x, child.position.z) > 0.08) {
          legCandidates.push(child);
        }
      });
      // 依四個方位選出 4 隻小腳
      legCandidates.slice(0, 4).forEach(mesh => {
        const pivot = new THREE.Group();
        pivot.position.copy(mesh.position);
        mesh.position.set(0, 0, 0);
        if (mesh.parent) {
          mesh.parent.add(pivot);
          pivot.add(mesh);
          group.legs.push(pivot);
        }
      });
    }

    // 耳朵綁定
    if (group.ears.length === 0) {
      const earCandidates = [];
      group.traverse(child => {
        if (child.isMesh && child.position.y >= 0.65 && Math.abs(child.position.z) > 0.06) {
          earCandidates.push(child);
        }
      });
      earCandidates.slice(0, 2).forEach(mesh => {
        const pivot = new THREE.Group();
        pivot.position.copy(mesh.position);
        mesh.position.set(0, 0, 0);
        if (mesh.parent) {
          mesh.parent.add(pivot);
          pivot.add(mesh);
          group.ears.push(pivot);
        }
      });
    }
  }

  // 🐾 魔寵全動態即時運算（小腳前後邁步、耳朵靈巧抖動、尾巴左右歡快搖擺、雙翼拍打）
  static animatePetModel(model, isMoving, now, phase = 0) {
    if (!model) return;

    // 1. 🐾 小腳跑步邁步踏步動畫 (Trotting / Walking Animation)
    if (model.legs && model.legs.length > 0) {
      if (isMoving) {
        const swing = Math.sin(now * 0.013 + phase) * 0.52;
        if (model.legs.length >= 4) {
          model.legs[0].rotation.z = swing;       // 前左
          model.legs[1].rotation.z = -swing;      // 前右
          model.legs[2].rotation.z = -swing;      // 後左
          model.legs[3].rotation.z = swing;       // 後右
        } else {
          model.legs.forEach((l, idx) => {
            l.rotation.z = (idx % 2 === 0 ? swing : -swing);
          });
        }
      } else {
        model.legs.forEach(l => {
          l.rotation.z = THREE.MathUtils.lerp(l.rotation.z, 0, 0.15);
        });
      }
    }

    // 2. 👂 雙耳微動與好奇晃動 (Ears Twitching Animation)
    if (model.ears && model.ears.length > 0) {
      const twitch = Math.sin(now * 0.0035 + phase) * 0.16;
      model.ears.forEach((ear, i) => {
        ear.rotation.z = (i === 0 ? twitch : -twitch);
      });
    }

    // 3. 🦊 大尾巴靈活搖晃 (Tails Wagging Animation)
    if (model.tailGroup) {
      const wagSpeed = isMoving ? 0.016 : 0.006;
      const wagAmp = isMoving ? 0.48 : 0.28;
      model.tailGroup.rotation.y = Math.sin(now * wagSpeed + phase) * wagAmp;
    }

    // 4. 🪽 翅膀拍打拍翅 (Wings Flapping Animation)
    if (model.wingsGroup && model.wingsGroup.children && model.wingsGroup.children.length > 0) {
      const flapSpeed = isMoving ? 0.024 : 0.013;
      const flap = Math.sin(now * flapSpeed + phase) * 0.58;
      model.wingsGroup.children.forEach((w, i) => {
        w.rotation.x = (i % 2 === 0 ? flap : -flap);
        w.rotation.z = (i % 2 === 0 ? flap * 0.35 : -flap * 0.35);
      });
    }
  }

  // --- 🎭 3. Universal Anime Expressive Pet Face Generator ---
  // (Large expressive anime eyes with iris + pupil + double highlight sparkles, cute anime :3/fangs/beak mouths, rosy blushing cheeks, element forehead gems)
  static attachAnimePetFace(target, config = {}) {
    const {
      eyeOffset = { x: 0.52, y: 0.58, z: 0.12 },
      eyeRadius = 0.052,
      eyeColor = 0xf59e0b,
      mouthPos = { x: 0.62, y: 0.48, z: 0 },
      mouthType = 'cat', // 'cat' (:3), 'open', 'beak', 'fangs', 'smile'
      mouthScale = 1.0,
      blushOffset = { x: 0.48, y: 0.49, z: 0.16 },
      blushRadius = 0.045,
      blushColor = 0xf472b6,
      foreheadPos = null,
      foreheadIcon = null // 'flame', 'ice', 'leaf', 'moon', 'thunder', 'star', 'drop'
    } = config;

    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshBasicMaterial({ color: eyeColor });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lashMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
    const blushMat = new THREE.MeshBasicMaterial({ color: blushColor, transparent: true, opacity: 0.65 });
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xbe123c });

    // 1. Anime Sparkle Eyes (Left & Right)
    [-1, 1].forEach(side => {
      const eyeSide = new THREE.Group();
      const z = side * eyeOffset.z;
      eyeSide.position.set(eyeOffset.x, eyeOffset.y, z);
      eyeSide.rotation.y = (side > 0 ? 0.35 : -0.35);

      // Sclera (White base)
      const sclera = new THREE.Mesh(new THREE.PlaneGeometry(eyeRadius * 1.8, eyeRadius * 2.2), whiteMat);
      eyeSide.add(sclera);

      // Upper Eyelash Wing
      const lash = new THREE.Mesh(new THREE.PlaneGeometry(eyeRadius * 2.0, eyeRadius * 0.42), lashMat);
      lash.position.set(0, eyeRadius * 0.95, 0.002);
      lash.rotation.z = (side > 0 ? -0.15 : 0.15);
      eyeSide.add(lash);

      // Colored Iris
      const iris = new THREE.Mesh(new THREE.CircleGeometry(eyeRadius * 0.8, 14), irisMat);
      iris.position.set(0, -eyeRadius * 0.05, 0.003);
      eyeSide.add(iris);

      // Dark Pupil
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(eyeRadius * 0.45, 10), pupilMat);
      pupil.position.set(0, -eyeRadius * 0.05, 0.004);
      eyeSide.add(pupil);

      // Primary Sparkle Highlight
      const spark1 = new THREE.Mesh(new THREE.CircleGeometry(eyeRadius * 0.3, 8), highlightMat);
      spark1.position.set(eyeRadius * 0.22, eyeRadius * 0.3, 0.005);
      eyeSide.add(spark1);

      // Secondary Twinkle Starlet
      const spark2 = new THREE.Mesh(new THREE.CircleGeometry(eyeRadius * 0.16, 6), highlightMat);
      spark2.position.set(-eyeRadius * 0.26, -eyeRadius * 0.35, 0.005);
      eyeSide.add(spark2);

      target.add(eyeSide);

      // Soft Rosy Blush Cheeks
      if (blushOffset) {
        const blush = new THREE.Mesh(new THREE.CircleGeometry(blushRadius, 10), blushMat);
        blush.position.set(blushOffset.x, blushOffset.y, side * blushOffset.z);
        blush.rotation.y = (side > 0 ? 0.42 : -0.42);
        target.add(blush);
      }
    });

    // 2. Cute Anime Mouth
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(mouthPos.x, mouthPos.y, mouthPos.z);
    mouthGroup.scale.set(mouthScale, mouthScale, mouthScale);

    if (mouthType === 'cat') {
      // Iconic anime :3 cat mouth (two connected curved lips)
      [-0.024, 0.024].forEach(mz => {
        const lip = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.006, 4, 10, Math.PI * 0.9), mouthMat);
        lip.position.set(0, 0, mz);
        lip.rotation.y = Math.PI / 2;
        lip.rotation.x = Math.PI * 0.9;
        mouthGroup.add(lip);
      });
      // Cute pink inner mouth tongue
      const tongue = new THREE.Mesh(new THREE.CircleGeometry(0.018, 8), new THREE.MeshBasicMaterial({ color: 0xf472b6 }));
      tongue.position.set(-0.004, -0.014, 0);
      tongue.rotation.y = Math.PI / 2;
      mouthGroup.add(tongue);

    } else if (mouthType === 'fangs') {
      // Cat smile with cute white vampire fangs
      [-0.024, 0.024].forEach(mz => {
        const lip = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.006, 4, 10, Math.PI * 0.9), mouthMat);
        lip.position.set(0, 0, mz);
        lip.rotation.y = Math.PI / 2;
        lip.rotation.x = Math.PI * 0.9;
        mouthGroup.add(lip);

        const fang = new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.03, 4), whiteMat);
        fang.position.set(0.005, -0.016, mz * 0.85);
        fang.rotation.x = Math.PI;
        mouthGroup.add(fang);
      });

    } else if (mouthType === 'open') {
      // Joyful open smiling mouth with pink tongue
      const openGeo = new THREE.SphereGeometry(0.036, 8, 8, 0, Math.PI);
      const openMesh = new THREE.Mesh(openGeo, mouthMat);
      openMesh.rotation.y = Math.PI / 2;
      mouthGroup.add(openMesh);

      const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0xf472b6 }));
      tongue.position.set(0.005, -0.01, 0);
      mouthGroup.add(tongue);

    } else if (mouthType === 'beak') {
      // Cute open bird beak (雷羽 chirping)
      const beakMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
      const upperBeak = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 4), beakMat);
      upperBeak.rotateZ(-Math.PI / 2);
      upperBeak.position.set(0.06, 0.012, 0);
      mouthGroup.add(upperBeak);

      const lowerBeak = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.09, 4), beakMat);
      lowerBeak.rotateZ(-Math.PI / 2 - 0.25);
      lowerBeak.position.set(0.045, -0.024, 0);
      mouthGroup.add(lowerBeak);

    } else {
      // Simple gentle smile
      const smile = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.006, 4, 12, Math.PI * 0.8), mouthMat);
      smile.rotation.y = Math.PI / 2;
      smile.rotation.x = Math.PI * 0.9;
      mouthGroup.add(smile);
    }

    target.add(mouthGroup);

    // 3. Forehead Emblem (Element Crystal Mark)
    if (foreheadPos && foreheadIcon) {
      let markMat;
      let markGeo;
      switch (foreheadIcon) {
        case 'flame':
          markMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
          markGeo = new THREE.ConeGeometry(0.04, 0.09, 4);
          break;
        case 'ice':
          markMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
          markGeo = new THREE.OctahedronGeometry(0.045);
          break;
        case 'moon':
          markMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
          markGeo = new THREE.TorusGeometry(0.04, 0.015, 4, 12, Math.PI * 1.2);
          break;
        case 'thunder':
          markMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
          markGeo = new THREE.ConeGeometry(0.035, 0.1, 3);
          break;
        case 'leaf':
          markMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
          markGeo = new THREE.DodecahedronGeometry(0.04);
          break;
        case 'star':
          markMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
          markGeo = new THREE.OctahedronGeometry(0.05);
          break;
        default:
          markMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
          markGeo = new THREE.SphereGeometry(0.04, 8, 8);
          break;
      }
      const mark = new THREE.Mesh(markGeo, markMat);
      mark.position.set(foreheadPos.x, foreheadPos.y, foreheadPos.z);
      target.add(mark);
    }
  }

  // --- 🔥 1. Fox Builder (小火狐 ➔ 火焰狐 ➔ 九尾炎靈狐) ---
  static buildFox(group, mainColor, accentColor, tailCount = 1, scale = 1, isLegendary = false) {
    const mainMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.55 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65 });
    const accentMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.45 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // Contoured Organic Body
    const bodyGeo = new THREE.SphereGeometry(0.36, 14, 14);
    bodyGeo.scale(1.25, 0.92, 0.92);
    const body = new THREE.Mesh(bodyGeo, mainMat);
    body.position.y = 0.35;
    root.add(body);

    const bellyGeo = new THREE.SphereGeometry(0.29, 12, 12);
    bellyGeo.scale(1.12, 0.82, 0.72);
    const belly = new THREE.Mesh(bellyGeo, whiteMat);
    belly.position.set(0.06, 0.31, 0);
    root.add(belly);

    // Fluffy Sculpted Head
    const headGeo = new THREE.SphereGeometry(0.27, 14, 14);
    const head = new THREE.Mesh(headGeo, mainMat);
    head.position.set(0.36, 0.55, 0);
    root.add(head);

    // Fluffy Cheek Fur Tufts
    [-0.18, 0.18].forEach(z => {
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 4), whiteMat);
      tuft.position.set(0.34, 0.48, z);
      tuft.rotation.x = (z > 0 ? 0.9 : -0.9);
      tuft.rotation.z = -0.3;
      root.add(tuft);
    });

    // Cute White Snout
    const muzzleGeo = new THREE.ConeGeometry(0.12, 0.22, 8);
    muzzleGeo.rotateZ(-Math.PI / 2);
    const muzzle = new THREE.Mesh(muzzleGeo, whiteMat);
    muzzle.position.set(0.56, 0.52, 0);
    root.add(muzzle);

    // Black Button Nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), new THREE.MeshBasicMaterial({ color: 0x111111 }));
    nose.position.set(0.68, 0.52, 0);
    root.add(nose);

    // Sculpted Ears with Dual-Layer Inner Fur
    [-0.14, 0.14].forEach(z => {
      const earGeo = new THREE.ConeGeometry(0.09, 0.25, 5);
      const ear = new THREE.Mesh(earGeo, mainMat);
      ear.position.set(0.36, 0.78, z);
      ear.rotation.z = -0.2;
      ear.rotation.x = z * 0.4;
      root.add(ear);

      const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 5), whiteMat);
      innerEar.position.set(0.38, 0.77, z);
      innerEar.rotation.z = -0.2;
      innerEar.rotation.x = z * 0.4;
      root.add(innerEar);
    });

    // 🎭 Expressive Anime Eyes, :3 Cat Mouth, Rosy Cheeks, Flame Forehead Emblem!
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.52, y: 0.58, z: 0.13 },
      eyeRadius: 0.052,
      eyeColor: isLegendary ? 0xfacc15 : 0xef4444, // Glowing ruby/amber
      mouthPos: { x: 0.65, y: 0.48, z: 0 },
      mouthType: 'cat',
      mouthScale: 0.9,
      blushOffset: { x: 0.48, y: 0.49, z: 0.18 },
      blushRadius: 0.045,
      blushColor: 0xf472b6,
      foreheadPos: { x: 0.46, y: 0.72, z: 0 },
      foreheadIcon: 'flame'
    });

    // Curved Paws
    const pawPositions = [[0.22, -0.15], [0.22, 0.15], [-0.22, -0.15], [-0.22, 0.15]];
    pawPositions.forEach(([x, z]) => {
      const legGeo = new THREE.CylinderGeometry(0.06, 0.052, 0.22, 8);
      const leg = new THREE.Mesh(legGeo, whiteMat);
      leg.position.set(x, 0.11, z);
      root.add(leg);

      const pawFoot = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), whiteMat);
      pawFoot.scale.set(1.2, 0.6, 1);
      pawFoot.position.set(x + 0.03, 0.04, z);
      root.add(pawFoot);
    });

    // Tails (1, 2, or 9 Tails)
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.35, 0.4, 0);

    const angles = [];
    if (tailCount === 1) {
      angles.push({ y: 0, z: 0.4 });
    } else if (tailCount === 2) {
      angles.push({ y: -0.3, z: 0.4 }, { y: 0.3, z: 0.4 });
    } else {
      for (let t = -4; t <= 4; t++) {
        angles.push({ y: t * 0.22, z: 0.35 + Math.abs(t) * 0.08 });
      }
    }

    angles.forEach(ang => {
      const tGroup = new THREE.Group();
      tGroup.rotation.y = ang.y;
      tGroup.rotation.z = ang.z;

      const tailBaseGeo = new THREE.CylinderGeometry(0.08, 0.04, 0.32, 8);
      tailBaseGeo.rotateZ(Math.PI / 2);
      const tailBase = new THREE.Mesh(tailBaseGeo, mainMat);
      tailBase.position.x = -0.15;
      tGroup.add(tailBase);

      const tailFluffGeo = new THREE.SphereGeometry(0.14, 8, 8);
      tailFluffGeo.scale(1.5, 1, 1);
      const tailFluff = new THREE.Mesh(tailFluffGeo, mainMat);
      tailFluff.position.x = -0.35;
      tGroup.add(tailFluff);

      const tipGeo = new THREE.ConeGeometry(0.1, 0.22, 6);
      tipGeo.rotateZ(-Math.PI / 2);
      const tip = new THREE.Mesh(tipGeo, accentMat);
      tip.position.x = -0.52;
      tGroup.add(tip);

      tailGroup.add(tGroup);
    });

    root.add(tailGroup);
    group.tailGroup = tailGroup;

    if (isLegendary) {
      const haloGeo = new THREE.TorusGeometry(0.45, 0.025, 8, 24);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(0.35, 0.85, 0);
      halo.rotation.x = Math.PI / 2;
      root.add(halo);
    }

    group.add(root);
  }

  // --- ❄️ 2. Wolf Builder (雪團 ➔ 冰晶狼 ➔ 極地霜月狼) ---
  // (Smooth organic contoured body, fluffy snow chest, expressive sapphire anime eyes, :3 cat mouth, cheeks)
  static buildWolf(group, mainColor, accentColor, scale = 1, hasSpines = false, isLegendary = false) {
    const mainMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const iceMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.3, transparent: true, opacity: 0.85 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // Contoured Organic Body (Not a rigid box!)
    const bodyGeo = new THREE.SphereGeometry(0.38, 14, 14);
    bodyGeo.scale(1.35, 0.95, 0.92);
    const body = new THREE.Mesh(bodyGeo, mainMat);
    body.position.y = 0.42;
    root.add(body);

    // Fluffy Snow Chest Ruff
    const chestGeo = new THREE.ConeGeometry(0.24, 0.38, 6);
    chestGeo.rotateZ(Math.PI / 2);
    const chest = new THREE.Mesh(chestGeo, whiteMat);
    chest.position.set(0.32, 0.44, 0);
    root.add(chest);

    // Sculpted Head & Cheeks
    const headGeo = new THREE.SphereGeometry(0.28, 14, 14);
    const head = new THREE.Mesh(headGeo, mainMat);
    head.position.set(0.42, 0.62, 0);
    root.add(head);

    // Fluffy Snow Cheek Ruffs
    [-0.18, 0.18].forEach(z => {
      const ruff = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 4), whiteMat);
      ruff.position.set(0.4, 0.55, z);
      ruff.rotation.x = (z > 0 ? 0.95 : -0.95);
      ruff.rotation.z = -0.25;
      root.add(ruff);
    });

    // Cute White Snout
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 8), whiteMat);
    snout.rotateZ(-Math.PI / 2);
    snout.position.set(0.62, 0.58, 0);
    root.add(snout);

    // Dark Button Nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.036, 6, 6), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    nose.position.set(0.74, 0.58, 0);
    root.add(nose);

    // Fluffy Wolf Ears with Soft Inner Lining
    [-0.13, 0.13].forEach(z => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.24, 4), mainMat);
      ear.position.set(0.42, 0.86, z);
      ear.rotation.z = -0.22;
      ear.rotation.x = (z > 0 ? 0.25 : -0.25);
      root.add(ear);

      const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 4), whiteMat);
      innerEar.position.set(0.44, 0.85, z);
      innerEar.rotation.z = -0.22;
      innerEar.rotation.x = (z > 0 ? 0.25 : -0.25);
      root.add(innerEar);
    });

    // 🎭 Expressive Sapphire Anime Eyes, :3 Cat Smile, Rosy Cheeks, Ice Crystal Mark!
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.56, y: 0.64, z: 0.13 },
      eyeRadius: 0.052,
      eyeColor: isLegendary ? 0x0284c7 : 0x38bdf8, // Crystalline ice blue
      mouthPos: { x: 0.70, y: 0.53, z: 0 },
      mouthType: 'cat',
      mouthScale: 0.9,
      blushOffset: { x: 0.52, y: 0.54, z: 0.18 },
      blushRadius: 0.045,
      blushColor: 0xf472b6,
      foreheadPos: { x: 0.52, y: 0.78, z: 0 },
      foreheadIcon: 'ice'
    });

    // Contoured Legs & Paws
    const legCoords = [[0.24, -0.14], [0.24, 0.14], [-0.24, -0.14], [-0.24, 0.14]];
    legCoords.forEach(([x, z]) => {
      const legGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.28, 8);
      const leg = new THREE.Mesh(legGeo, whiteMat);
      leg.position.set(x, 0.16, z);
      root.add(leg);

      const pawFoot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), whiteMat);
      pawFoot.scale.set(1.2, 0.6, 1);
      pawFoot.position.set(x + 0.03, 0.04, z);
      root.add(pawFoot);
    });

    // Fluffy Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.35, 0.45, 0);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.48, 6), mainMat);
    tail.rotation.z = 1.8;
    tailGroup.add(tail);
    const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 6), whiteMat);
    tailTip.position.set(-0.25, -0.15, 0);
    tailTip.rotation.z = 1.8;
    tailGroup.add(tailTip);
    root.add(tailGroup);
    group.tailGroup = tailGroup;

    if (hasSpines) {
      for (let s = -2; s <= 2; s++) {
        const spine = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2 + (2 - Math.abs(s)) * 0.08, 4), iceMat);
        spine.position.set(s * 0.12, 0.65, 0);
        spine.rotation.z = -0.3;
        root.add(spine);
      }
    }

    if (isLegendary) {
      [-1, 1].forEach(side => {
        const wingGeo = new THREE.PlaneGeometry(0.7, 0.45);
        const wingMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.75, side: THREE.DoubleSide });
        const wing = new THREE.Mesh(wingGeo, wingMat);
        wing.position.set(0.1, 0.65, side * 0.35);
        wing.rotation.x = side * 0.5;
        wing.rotation.y = side * 0.2;
        root.add(wing);
      });
    }

    group.add(root);
  }

  // --- Deer Builder ---
  static buildDeer(group, mainColor, accentColor, scale = 1, antlerTier = 1, isLegendary = false) {
    const mainMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.7 });
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const flowerMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.4 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x166534 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    const bodyGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.65, 10);
    bodyGeo.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, mainMat);
    body.position.y = 0.5;
    root.add(body);

    const neckGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.38, 8);
    neckGeo.rotateZ(-0.45);
    const neck = new THREE.Mesh(neckGeo, mainMat);
    neck.position.set(0.28, 0.72, 0);
    root.add(neck);

    const headGeo = new THREE.ConeGeometry(0.15, 0.35, 8);
    headGeo.rotateZ(-Math.PI / 2);
    const head = new THREE.Mesh(headGeo, mainMat);
    head.position.set(0.48, 0.88, 0);
    root.add(head);

    // Cute Pink Button Nose
    const deerNose = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 6), new THREE.MeshBasicMaterial({ color: 0xf472b6 }));
    deerNose.position.set(0.66, 0.88, 0);
    root.add(deerNose);

    // 🎭 Expressive Emerald Anime Eyes, Smiling Mouth, Rosy Cheeks, Leaf Emblem!
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.52, y: 0.92, z: 0.12 },
      eyeRadius: 0.05,
      eyeColor: isLegendary ? 0x22c55e : 0x10b981, // Emerald green
      mouthPos: { x: 0.62, y: 0.83, z: 0 },
      mouthType: 'smile',
      mouthScale: 0.85,
      blushOffset: { x: 0.48, y: 0.84, z: 0.15 },
      blushRadius: 0.04,
      blushColor: 0xfbcfe8,
      foreheadPos: { x: 0.45, y: 1.02, z: 0 },
      foreheadIcon: 'leaf'
    });

    const legGeo = new THREE.CylinderGeometry(0.045, 0.035, 0.52, 6);
    const legPositions = [[0.22, -0.14], [0.22, 0.14], [-0.22, -0.14], [-0.22, 0.14]];
    legPositions.forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, whiteMat);
      leg.position.set(x, 0.26, z);
      root.add(leg);
    });

    [-0.14, 0.14].forEach(z => {
      const mainBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.28 * antlerTier, 6), hornMat);
      mainBranch.position.set(0.42, 1.05 + antlerTier * 0.08, z);
      mainBranch.rotation.z = -0.25;
      mainBranch.rotation.x = (z > 0 ? 0.3 : -0.3);
      root.add(mainBranch);

      if (antlerTier >= 2) {
        const subBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.18, 5), hornMat);
        subBranch.position.set(0.46, 1.18, z * 1.3);
        subBranch.rotation.z = -0.7;
        root.add(subBranch);

        const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.06), flowerMat);
        flower.position.set(0.44, 1.25, z * 1.4);
        root.add(flower);
      }
    });

    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.35, 0.55, 0);
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), whiteMat);
    tailGroup.add(tail);
    root.add(tailGroup);
    group.tailGroup = tailGroup;

    group.add(root);
  }

  // --- 🌙 4. Dragon Bat Builder (紫翼 ➔ 暗影翼獸 ➔ 幻月魔翼) ---
  static buildDragonBat(group, mainColor, accentColor, scale = 1, isDragon = false, hasHorns = false) {
    const mainMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.5 });
    const wingMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.6, side: THREE.DoubleSide });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    const bodyGeo = isDragon ? new THREE.CylinderGeometry(0.25, 0.32, 0.8, 8) : new THREE.SphereGeometry(0.32, 10, 10);
    if (isDragon) bodyGeo.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, mainMat);
    body.position.y = 0.5;
    root.add(body);

    const headGeo = isDragon ? new THREE.ConeGeometry(0.24, 0.5, 6) : new THREE.SphereGeometry(0.26, 10, 10);
    if (isDragon) headGeo.rotateZ(-Math.PI / 2);
    const head = new THREE.Mesh(headGeo, mainMat);
    head.position.set(isDragon ? 0.45 : 0.28, 0.68, 0);
    root.add(head);

    // Cute Bat Ears with Inner Pink Lining
    [-0.14, 0.14].forEach(z => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 4), mainMat);
      ear.position.set(isDragon ? 0.36 : 0.24, 0.92, z);
      ear.rotation.z = -0.25;
      ear.rotation.x = (z > 0 ? 0.35 : -0.35);
      root.add(ear);

      const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 4), new THREE.MeshBasicMaterial({ color: 0xf472b6 }));
      innerEar.position.set(isDragon ? 0.38 : 0.26, 0.91, z);
      innerEar.rotation.z = -0.25;
      innerEar.rotation.x = (z > 0 ? 0.35 : -0.35);
      root.add(innerEar);
    });

    // 🎭 Expressive Amethyst Anime Eyes, Cute Fangs Smiling Mouth, Moon Crest!
    this.attachAnimePetFace(root, {
      eyeOffset: { x: isDragon ? 0.52 : 0.42, y: 0.72, z: 0.12 },
      eyeRadius: 0.05,
      eyeColor: isDragon ? 0xf43f5e : 0xc084fc, // Glowing amethyst/crimson
      mouthPos: { x: isDragon ? 0.66 : 0.52, y: 0.64, z: 0 },
      mouthType: 'fangs',
      mouthScale: 0.9,
      blushOffset: { x: isDragon ? 0.48 : 0.38, y: 0.65, z: 0.16 },
      blushRadius: 0.04,
      blushColor: 0xe879f9,
      foreheadPos: { x: isDragon ? 0.46 : 0.34, y: 0.88, z: 0 },
      foreheadIcon: 'moon'
    });

    if (hasHorns) {
      [-0.16, 0.16].forEach(z => {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 5), new THREE.MeshStandardMaterial({ color: 0x18181b }));
        horn.position.set(isDragon ? 0.35 : 0.22, 0.95, z);
        horn.rotation.z = -0.5;
        horn.rotation.x = (z > 0 ? 0.3 : -0.3);
        root.add(horn);
      });
    }

    const wingsGroup = new THREE.Group();
    [-1, 1].forEach(side => {
      const wingBone = new THREE.Group();
      wingBone.position.set(0, 0.6, side * 0.2);

      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.lineTo(0.3, 0.45);
      wingShape.lineTo(0.7, 0.5);
      wingShape.lineTo(0.55, 0.15);
      wingShape.lineTo(0.4, 0.05);
      wingShape.closePath();

      const wingMesh = new THREE.Mesh(new THREE.ShapeGeometry(wingShape), wingMat);
      wingMesh.rotation.y = (side < 0 ? Math.PI : 0);
      wingMesh.rotation.x = side * 0.25;
      wingBone.add(wingMesh);

      wingsGroup.add(wingBone);
    });

    root.add(wingsGroup);
    group.wingsGroup = wingsGroup;

    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.35, 0.48, 0);
    const tailGeo = new THREE.ConeGeometry(0.08, 0.65, 6);
    tailGeo.rotateZ(Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, mainMat);
    tail.position.x = -0.3;
    tailGroup.add(tail);

    if (isDragon) {
      const spade = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 4), wingMat);
      spade.position.set(-0.65, 0, 0);
      tailGroup.add(spade);
    }

    root.add(tailGroup);
    group.tailGroup = tailGroup;

    group.add(root);
  }

  // --- ⚡ 3. Thunder Beast Builder (雷電系家族：小電喵 ➔ 雷影豹 ➔ 雷帝麒麟) ---
  static buildThunderBeast(group, mainColor, accentColor, scale = 1, stage = 1, isLegendary = false) {
    const mainMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.55 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const sparkMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.2,
      emissive: accentColor,
      emissiveIntensity: 0.6
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.3
    });
    const eyeMat = new THREE.MeshBasicMaterial({ color: isLegendary ? 0x38bdf8 : 0x0284c7 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    if (stage === 1) {
      // 🐱 雷鳴小電喵
      const bodyGeo = new THREE.SphereGeometry(0.32, 12, 12);
      bodyGeo.scale(1.1, 0.9, 0.85);
      const body = new THREE.Mesh(bodyGeo, mainMat);
      body.position.y = 0.32;
      root.add(body);

      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), whiteMat);
      belly.position.set(0.06, 0.28, 0);
      belly.scale.set(1.05, 0.8, 0.65);
      root.add(belly);

      // Chest lightning emblem
      const chestEmblem = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 3), sparkMat);
      chestEmblem.position.set(0.28, 0.32, 0);
      chestEmblem.rotation.z = Math.PI;
      root.add(chestEmblem);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), mainMat);
      head.position.set(0.32, 0.52, 0);
      root.add(head);

      // Feathered Lightning Crest on Crown
      for (let c = -1; c <= 1; c++) {
        const crest = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18 + Math.abs(c) * 0.04, 4), sparkMat);
        crest.position.set(0.32, 0.78, c * 0.08);
        crest.rotation.z = -0.35;
        crest.rotation.x = c * 0.25;
        root.add(crest);
      }

      // 🎭 Expressive Golden Electric Anime Eyes, Chirp Beak/Cat Mouth, Red Cheeks, Lightning Mark!
      this.attachAnimePetFace(root, {
        eyeOffset: { x: 0.46, y: 0.58, z: 0.12 },
        eyeRadius: 0.05,
        eyeColor: 0xeab308, // Glowing electric topaz
        mouthPos: { x: 0.58, y: 0.48, z: 0 },
        mouthType: 'beak',
        mouthScale: 0.9,
        blushOffset: { x: 0.44, y: 0.5, z: 0.17 },
        blushRadius: 0.045,
        blushColor: 0xef4444, // Pikachu-style bright electric red blush cheeks!
        foreheadPos: { x: 0.42, y: 0.72, z: 0 },
        foreheadIcon: 'thunder'
      });

      // Paws
      [[0.2, -0.13], [0.2, 0.13], [-0.18, -0.13], [-0.18, 0.13]].forEach(([x, z]) => {
        const paw = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.2, 8), whiteMat);
        paw.position.set(x, 0.1, z);
        root.add(paw);
      });

      // Zig-Zag Lightning Bolt Tail
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.32, 0.36, 0);

      const seg1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.05), mainMat);
      seg1.position.set(-0.06, 0.08, 0);
      seg1.rotation.z = 0.65;
      tailGroup.add(seg1);

      const seg2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.05), sparkMat);
      seg2.position.set(-0.16, 0.2, 0);
      seg2.rotation.z = -0.85;
      tailGroup.add(seg2);

      const seg3 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.05), mainMat);
      seg3.position.set(-0.25, 0.33, 0);
      seg3.rotation.z = 0.5;
      tailGroup.add(seg3);

      const boltTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), sparkMat);
      boltTip.position.set(-0.32, 0.44, 0);
      tailGroup.add(boltTip);

      root.add(tailGroup);
      group.tailGroup = tailGroup;

    } else if (stage === 2) {
      // 🐆 疾風雷影豹
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.85, 10), mainMat);
      body.rotateZ(Math.PI / 2);
      body.position.y = 0.48;
      root.add(body);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 8), mainMat);
      head.rotateZ(-Math.PI / 2);
      head.position.set(0.55, 0.68, 0);
      root.add(head);

      // Lightning blades on shoulders
      [-0.24, 0.24].forEach(z => {
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 4), sparkMat);
        blade.position.set(0.2, 0.72, z);
        blade.rotation.z = -0.8;
        blade.rotation.x = (z > 0 ? 0.35 : -0.35);
        root.add(blade);
      });

      // Panther Legs
      [[0.32, -0.16], [0.32, 0.16], [-0.3, -0.16], [-0.3, 0.16]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.44, 8), mainMat);
        leg.position.set(x, 0.22, z);
        root.add(leg);
      });

      // Eyes
      [-0.12, 0.12].forEach(z => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), eyeMat);
        eye.position.set(0.58, 0.72, z);
        root.add(eye);
      });

      // Twin Lightning Tails
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.45, 0.55, 0);
      [-0.1, 0.1].forEach(tz => {
        const tMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.65, 6), sparkMat);
        tMesh.position.set(-0.25, 0.15, tz);
        tMesh.rotation.z = 1.2;
        tMesh.rotation.y = tz * 2;
        tailGroup.add(tMesh);
      });
      root.add(tailGroup);
      group.tailGroup = tailGroup;

    } else {
      // 👑⚡ 雷帝天罰麒麟 (Legendary Qilin)
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 1.1, 12), mainMat);
      body.rotateZ(Math.PI / 2);
      body.position.y = 0.75;
      root.add(body);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.65, 8), mainMat);
      neck.rotateZ(-0.55);
      neck.position.set(0.48, 1.05, 0);
      root.add(neck);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.34), mainMat);
      head.position.set(0.78, 1.32, 0);
      root.add(head);

      // Mythical Qilin Twin Lightning Horns
      [-0.15, 0.15].forEach(z => {
        const hornGeo = new THREE.CylinderGeometry(0.03, 0.08, 0.75, 6);
        const horn = new THREE.Mesh(hornGeo, goldMat);
        horn.position.set(0.72, 1.75, z);
        horn.rotation.z = -0.45;
        horn.rotation.x = (z > 0 ? 0.35 : -0.35);
        root.add(horn);

        const hornTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), sparkMat);
        hornTip.position.set(0.55, 2.05, z * 1.3);
        root.add(hornTip);
      });

      // Flowing Electric Mane along spine
      for (let m = 0; m < 5; m++) {
        const mane = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 5), sparkMat);
        mane.position.set(0.35 - m * 0.18, 1.05 - m * 0.08, 0);
        mane.rotation.z = -0.7;
        root.add(mane);
      }

      // Golden Flaming Hooves & Legs
      [[0.4, -0.22], [0.4, 0.22], [-0.4, -0.22], [-0.4, 0.22]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.72, 8), mainMat);
        leg.position.set(x, 0.36, z);
        root.add(leg);

        const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.14, 8), goldMat);
        hoof.position.set(x, 0.07, z);
        root.add(hoof);
      });

      // Eyes
      [-0.18, 0.18].forEach(z => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), eyeMat);
        eye.position.set(0.92, 1.36, z);
        root.add(eye);
      });

      // Giant Celestial Lightning Halo around Qilin
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.045, 8, 24), sparkMat);
      halo.position.set(0, 0.95, 0);
      halo.rotation.x = Math.PI / 2;
      root.add(halo);

      // Majestic Plumed Thunder Tail
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.55, 0.85, 0);

      const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.04, 0.6, 8), mainMat);
      tBase.position.set(-0.25, 0.1, 0);
      tBase.rotation.z = 1.35;
      tailGroup.add(tBase);

      const tTuft = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24), sparkMat);
      tTuft.position.set(-0.52, 0.25, 0);
      tailGroup.add(tTuft);

      root.add(tailGroup);
      group.tailGroup = tailGroup;
    }

    group.add(root);
  }

  // --- ✨ 4. Holy Creature Builder (聖光系家族：聖靈兔 ➔ 聖耀天角獸 ➔ 創世神凰) ---
  static buildHolyCreature(group, mainColor, accentColor, scale = 1, stage = 1, isLegendary = false) {
    const mainMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.45 });
    const goldMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      metalness: 0.85,
      roughness: 0.25,
      emissive: accentColor,
      emissiveIntensity: 0.4
    });
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    if (stage === 1) {
      // 🐰 光之聖靈兔
      const bodyGeo = new THREE.SphereGeometry(0.32, 14, 14);
      bodyGeo.scale(1, 1.1, 0.95);
      const body = new THREE.Mesh(bodyGeo, mainMat);
      body.position.y = 0.35;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 14), mainMat);
      head.position.set(0.18, 0.58, 0);
      root.add(head);

      // Floating Angel Halo
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 20), goldMat);
      halo.position.set(0.18, 0.95, 0);
      halo.rotation.x = Math.PI / 2;
      root.add(halo);

      // Long bunny ears
      [-0.11, 0.11].forEach(z => {
        const earGeo = new THREE.ConeGeometry(0.075, 0.42, 6);
        const ear = new THREE.Mesh(earGeo, mainMat);
        ear.position.set(0.12, 0.88, z);
        ear.rotation.z = -0.25;
        ear.rotation.x = (z > 0 ? 0.3 : -0.3);
        root.add(ear);

        const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.32, 5), new THREE.MeshStandardMaterial({ color: 0xfbcfe8 }));
        innerEar.position.set(0.13, 0.88, z);
        innerEar.rotation.z = -0.25;
        innerEar.rotation.x = (z > 0 ? 0.3 : -0.3);
        root.add(innerEar);
      });

      // 🎭 Expressive Celestial Anime Eyes, Cute :3 Bunny Mouth, Rosy Cheeks, Star Mark!
      this.attachAnimePetFace(root, {
        eyeOffset: { x: 0.36, y: 0.62, z: 0.11 },
        eyeRadius: 0.05,
        eyeColor: 0x38bdf8, // Glowing celestial starlight blue
        mouthPos: { x: 0.44, y: 0.54, z: 0 },
        mouthType: 'cat',
        mouthScale: 0.85,
        blushOffset: { x: 0.34, y: 0.54, z: 0.15 },
        blushRadius: 0.042,
        blushColor: 0xf472b6,
        foreheadPos: { x: 0.32, y: 0.74, z: 0 },
        foreheadIcon: 'star'
      });

      // Angel Wings on Back
      const wingsGroup = new THREE.Group();
      [-1, 1].forEach(side => {
        const wingMesh = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.38, 5), wingMat);
        wingMesh.position.set(-0.1, 0.45, side * 0.22);
        wingMesh.rotation.z = 1.1;
        wingMesh.rotation.x = side * 0.4;
        wingsGroup.add(wingMesh);
      });
      root.add(wingsGroup);
      group.wingsGroup = wingsGroup;

      // Round Puffy Tail
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.3, 0.3, 0);
      const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), mainMat);
      tailGroup.add(tail);
      root.add(tailGroup);
      group.tailGroup = tailGroup;

    } else if (stage === 2) {
      // 🦄 聖耀天角獸 (Radiant Pegacorn)
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.78, 10), mainMat);
      body.rotateZ(Math.PI / 2);
      body.position.y = 0.52;
      root.add(body);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.45, 8), mainMat);
      neck.rotateZ(-0.55);
      neck.position.set(0.32, 0.76, 0);
      root.add(neck);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 8), mainMat);
      head.rotateZ(-Math.PI / 2);
      head.position.set(0.55, 0.95, 0);
      root.add(head);

      // Spiral Golden Unicorn Horn
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.45, 6), goldMat);
      horn.position.set(0.68, 1.22, 0);
      horn.rotation.z = -0.55;
      root.add(horn);

      // Elegant Equine Legs & Gold Hooves
      [[0.28, -0.15], [0.28, 0.15], [-0.28, -0.15], [-0.28, 0.15]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.52, 6), mainMat);
        leg.position.set(x, 0.26, z);
        root.add(leg);

        const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.08, 6), goldMat);
        hoof.position.set(x, 0.04, z);
        root.add(hoof);
      });

      // Spread Feathered Wings
      const wingsGroup = new THREE.Group();
      [-1, 1].forEach(side => {
        const wBone = new THREE.Group();
        wBone.position.set(0, 0.65, side * 0.18);

        const wingGeo = new THREE.PlaneGeometry(0.65, 0.38);
        const wing = new THREE.Mesh(wingGeo, wingMat);
        wing.position.set(-0.15, 0.15, side * 0.2);
        wing.rotation.x = side * 0.6;
        wing.rotation.y = side * 0.3;
        wBone.add(wing);

        wingsGroup.add(wBone);
      });
      root.add(wingsGroup);
      group.wingsGroup = wingsGroup;

      // Flowing Mane & Tail
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.38, 0.56, 0);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.55, 6), goldMat);
      tail.position.set(-0.2, -0.15, 0);
      tail.rotation.z = 1.4;
      tailGroup.add(tail);
      root.add(tailGroup);
      group.tailGroup = tailGroup;

    } else {
      // 👑🕊️ 創世光曦神凰 (Celestial Sun Phoenix)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 14), mainMat);
      body.scale.set(1.2, 0.9, 0.85);
      body.position.y = 0.72;
      root.add(body);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.6, 8), mainMat);
      neck.rotateZ(-0.4);
      neck.position.set(0.35, 1.05, 0);
      root.add(neck);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 8), mainMat);
      head.rotateZ(-Math.PI / 2);
      head.position.set(0.56, 1.28, 0);
      root.add(head);

      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 6), goldMat);
      beak.rotateZ(-Math.PI / 2);
      beak.position.set(0.78, 1.25, 0);
      root.add(beak);

      // Royal Phoenix Crown Feathers
      for (let c = 0; c < 3; c++) {
        const crown = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.35, 4), goldMat);
        crown.position.set(0.45 - c * 0.08, 1.52 + c * 0.05, 0);
        crown.rotation.z = -0.6;
        root.add(crown);
      }

      // Triple Concentric Solar Halos
      [0.6, 0.85, 1.1].forEach((rad, idx) => {
        const halo = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.025, 8, 24), goldMat);
        halo.position.set(-0.1, 0.95, 0);
        halo.rotation.y = Math.PI / 2;
        root.add(halo);
      });

      // Giant Radiant Phoenix Wings
      const wingsGroup = new THREE.Group();
      [-1, 1].forEach(side => {
        const wing = new THREE.Group();
        wing.position.set(0, 0.8, side * 0.25);

        for (let f = 0; f < 4; f++) {
          const feather = new THREE.Mesh(new THREE.ConeGeometry(0.12 - f * 0.02, 0.95 + f * 0.15, 5), f % 2 === 0 ? mainMat : goldMat);
          feather.position.set(-0.15 - f * 0.08, 0.25, side * (0.35 + f * 0.15));
          feather.rotation.z = 1.1 + f * 0.1;
          feather.rotation.x = side * (0.6 + f * 0.08);
          wing.add(feather);
        }

        wingsGroup.add(wing);
      });
      root.add(wingsGroup);
      group.wingsGroup = wingsGroup;

      // 3 Long Flowing Solar Ribbon Tailfeathers
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.48, 0.72, 0);
      [-0.18, 0, 0.18].forEach((tz, idx) => {
        const plume = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.015, 1.2 + Math.abs(tz) * 0.5, 6), goldMat);
        plume.position.set(-0.55 - idx * 0.08, -0.3, tz);
        plume.rotation.z = 1.8;
        plume.rotation.y = tz * 0.5;
        tailGroup.add(plume);

        const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), goldMat);
        jewel.position.set(-1.1 - idx * 0.15, -0.5, tz * 1.5);
        tailGroup.add(jewel);
      });
      root.add(tailGroup);
      group.tailGroup = tailGroup;
    }

    group.add(root);
  }

  // --- 💧 5. Water Spirit Builder (水靈系家族：泡泡 ➔ 海月水精靈 ➔ 滄海蒼龍) ---
  static buildWaterSpirit(group, mainColor, accentColor, scale = 1, stage = 1, isLegendary = false) {
    const waterMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: 0.12,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
      emissive: accentColor,
      emissiveIntensity: 0.25
    });
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75,
      emissive: 0xbae6fd,
      emissiveIntensity: 0.35
    });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.65 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    if (stage === 1) {
      // 💧 泡泡 (純澈水靈史萊姆)
      const bodyGeo = new THREE.SphereGeometry(0.38, 16, 16);
      bodyGeo.scale(1.15, 0.95, 1.05);
      const body = new THREE.Mesh(bodyGeo, waterMat);
      body.position.y = 0.35;
      root.add(body);

      // Droplet Antenna on top
      const antenna = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 8), waterMat);
      antenna.position.set(0, 0.72, 0);
      antenna.rotation.x = -0.3;
      root.add(antenna);

      const dropTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), bubbleMat);
      dropTip.position.set(0, 0.86, -0.06);
      root.add(dropTip);

      // 🎭 Expressive Oceanic Cyan Anime Eyes, Open Laughing Mouth with Tongue, Rosy Cheeks, Water Drop Crest!
      this.attachAnimePetFace(root, {
        eyeOffset: { x: 0.14, y: 0.38, z: 0.38 },
        eyeRadius: 0.056,
        eyeColor: 0x06b6d4, // Oceanic crystal teal
        mouthPos: { x: 0, y: 0.32, z: 0.42 },
        mouthType: 'open',
        mouthScale: 0.95,
        blushOffset: { x: 0.22, y: 0.30, z: 0.36 },
        blushRadius: 0.046,
        blushColor: 0xf472b6,
        foreheadPos: { x: 0, y: 0.58, z: 0.4 },
        foreheadIcon: 'drop'
      });

      // Inner Floating Bubbles inside body
      for (let b = 0; b < 4; b++) {
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.055 + Math.random() * 0.03, 8, 8), bubbleMat);
        bubble.position.set((Math.random() - 0.5) * 0.3, 0.25 + Math.random() * 0.2, (Math.random() - 0.5) * 0.3);
        root.add(bubble);
      }

      // Small water droplet side flippers
      [-0.38, 0.38].forEach(x => {
        const flipper = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 6), waterMat);
        flipper.position.set(x, 0.32, 0.05);
        flipper.rotation.z = (x > 0 ? -1.1 : 1.1);
        root.add(flipper);
      });

    } else if (stage === 2) {
      // 🌊 海月水精靈
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 14), waterMat);
      body.position.y = 0.55;
      root.add(body);

      // Mantle cap
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.4, 0.3, 14), waterMat);
      cap.position.y = 0.72;
      root.add(cap);

      // Trailing water ribbons
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 0.45, 0);
      for (let r = 0; r < 5; r++) {
        const ang = (r / 5) * Math.PI * 2;
        const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.015, 0.65, 6), bubbleMat);
        ribbon.position.set(Math.cos(ang) * 0.3, -0.3, Math.sin(ang) * 0.3);
        tailGroup.add(ribbon);
      }
      root.add(tailGroup);
      group.tailGroup = tailGroup;

    } else {
      // 👑🐉💧 滄海玄冰蒼龍 (Abyssal Leviathan)
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 1.25, 12), waterMat);
      body.rotateZ(Math.PI / 2);
      body.position.y = 0.75;
      root.add(body);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.65, 8), waterMat);
      head.rotateZ(-Math.PI / 2);
      head.position.set(0.65, 0.88, 0);
      root.add(head);

      // Horns
      [-0.15, 0.15].forEach(z => {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.65, 5), bubbleMat);
        horn.position.set(0.5, 1.25, z);
        horn.rotation.z = -0.6;
        root.add(horn);
      });

      // Wave fin wings
      const wingsGroup = new THREE.Group();
      [-1, 1].forEach(side => {
        const fin = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.5), bubbleMat);
        fin.position.set(0.1, 0.8, side * 0.35);
        fin.rotation.x = side * 0.6;
        wingsGroup.add(fin);
      });
      root.add(wingsGroup);
      group.wingsGroup = wingsGroup;

      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.6, 0.75, 0);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.85, 6), waterMat);
      tail.rotation.z = 1.6;
      tailGroup.add(tail);
      root.add(tailGroup);
      group.tailGroup = tailGroup;
    }

    group.add(root);
  }

  // --- 🐼 7. Panda Builder (萌萌小貓熊 ➔ 翠竹巨靈熊) ---
  static buildPanda(group, scale = 1, stage = 1) {
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // Chubby round body
    const bodyGeo = new THREE.SphereGeometry(0.38, 14, 14);
    bodyGeo.scale(1.15, 1.05, 0.98);
    const body = new THREE.Mesh(bodyGeo, whiteMat);
    body.position.y = 0.38;
    root.add(body);

    // Black saddle/shoulders vest
    const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.42, 0.28, 14), blackMat);
    vest.position.set(0.04, 0.42, 0);
    root.add(vest);

    // Round head
    const headGeo = new THREE.SphereGeometry(0.3, 14, 14);
    const head = new THREE.Mesh(headGeo, whiteMat);
    head.position.set(0.32, 0.62, 0);
    root.add(head);

    // Cute Round Black Ears
    [-0.18, 0.18].forEach(z => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), blackMat);
      ear.scale.set(0.7, 1, 1);
      ear.position.set(0.28, 0.88, z);
      root.add(ear);
    });

    // Black patches around eyes
    [-0.12, 0.12].forEach(z => {
      const patch = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), blackMat);
      patch.scale.set(0.8, 1.2, 0.9);
      patch.position.set(0.48, 0.64, z);
      patch.rotation.z = -0.2;
      patch.rotation.y = (z > 0 ? 0.3 : -0.3);
      root.add(patch);
    });

    // Black button nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.038, 6, 6), blackMat);
    nose.position.set(0.61, 0.58, 0);
    root.add(nose);

    // Fresh Green Bamboo shoot in hand
    const bamboo = new THREE.Group();
    bamboo.position.set(0.42, 0.45, 0.16);
    bamboo.rotation.z = 0.5;
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8), greenMat);
    bamboo.add(stalk);
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 4), greenMat);
    leaf.position.set(0, 0.22, 0.04);
    leaf.rotation.x = 0.6;
    bamboo.add(leaf);
    root.add(bamboo);

    // Expressive emerald eyes, :3 cat mouth, blush, leaf emblem
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.51, y: 0.65, z: 0.12 },
      eyeRadius: 0.048,
      eyeColor: 0x10b981,
      mouthPos: { x: 0.58, y: 0.52, z: 0 },
      mouthType: 'cat',
      mouthScale: 0.9,
      blushOffset: { x: 0.44, y: 0.53, z: 0.18 },
      blushRadius: 0.045,
      blushColor: 0xf472b6,
      foreheadPos: { x: 0.42, y: 0.82, z: 0 },
      foreheadIcon: 'leaf'
    });

    // 4 Stubby black paws
    [[0.22, -0.16], [0.22, 0.16], [-0.2, -0.16], [-0.2, 0.16]].forEach(([x, z]) => {
      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), blackMat);
      paw.scale.set(1.1, 0.8, 1);
      paw.position.set(x, 0.08, z);
      root.add(paw);
    });

    // Round tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.35, 0.35, 0);
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), blackMat);
    tailGroup.add(tail);
    root.add(tailGroup);
    group.tailGroup = tailGroup;

    group.add(root);
  }

  // --- 🐰 8. Rabbit Builder (雪絨跳跳兔 / 極地雪兔) ---
  static buildRabbit(group, scale = 1) {
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const pinkMat = new THREE.MeshBasicMaterial({ color: 0xfbcfe8 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // Round puff body
    const bodyGeo = new THREE.SphereGeometry(0.32, 14, 14);
    bodyGeo.scale(1.1, 1, 0.95);
    const body = new THREE.Mesh(bodyGeo, whiteMat);
    body.position.y = 0.32;
    root.add(body);

    // Round head
    const headGeo = new THREE.SphereGeometry(0.25, 14, 14);
    const head = new THREE.Mesh(headGeo, whiteMat);
    head.position.set(0.24, 0.52, 0);
    root.add(head);

    // Long upright bunny ears with pink inner
    [-0.1, 0.1].forEach(z => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.38, 5), whiteMat);
      ear.position.set(0.18, 0.82, z);
      ear.rotation.z = -0.15;
      ear.rotation.x = (z > 0 ? 0.25 : -0.25);
      root.add(ear);

      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.28, 4), pinkMat);
      inner.position.set(0.19, 0.82, z);
      inner.rotation.z = -0.15;
      inner.rotation.x = (z > 0 ? 0.25 : -0.25);
      root.add(inner);
    });

    // Pink button nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.026, 6, 6), pinkMat);
    nose.position.set(0.48, 0.52, 0);
    root.add(nose);

    // Expressive sapphire anime eyes, :3 mouth, blush, ice crystal
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.4, y: 0.56, z: 0.11 },
      eyeRadius: 0.05,
      eyeColor: 0x38bdf8,
      mouthPos: { x: 0.46, y: 0.46, z: 0 },
      mouthType: 'cat',
      mouthScale: 0.85,
      blushOffset: { x: 0.35, y: 0.47, z: 0.15 },
      blushRadius: 0.042,
      blushColor: 0xf472b6,
      foreheadPos: { x: 0.35, y: 0.68, z: 0 },
      foreheadIcon: 'ice'
    });

    // Fluffy cotton ball tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.3, 0.3, 0);
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), whiteMat);
    tailGroup.add(tail);
    root.add(tailGroup);
    group.tailGroup = tailGroup;

    // Soft paws
    [[0.16, -0.12], [0.16, 0.12], [-0.16, -0.12], [-0.16, 0.12]].forEach(([x, z]) => {
      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), whiteMat);
      paw.scale.set(1.2, 0.7, 1);
      paw.position.set(x, 0.05, z);
      root.add(paw);
    });

    group.add(root);
  }

  // --- 🦉 9. Owl Builder (夜羽星光梟 / 智慧守護神梟) ---
  static buildOwl(group, scale = 1) {
    const featherMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    const chestMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // Plump egg-shaped owl body
    const bodyGeo = new THREE.SphereGeometry(0.34, 14, 14);
    bodyGeo.scale(0.95, 1.15, 0.95);
    const body = new THREE.Mesh(bodyGeo, featherMat);
    body.position.y = 0.42;
    root.add(body);

    // White heart-shaped chest plumage
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), chestMat);
    chest.scale.set(0.8, 1, 0.6);
    chest.position.set(0.16, 0.38, 0);
    root.add(chest);

    // Facial disk
    const faceDisk = new THREE.Mesh(new THREE.CircleGeometry(0.2, 14), chestMat);
    faceDisk.position.set(0.26, 0.58, 0);
    faceDisk.rotation.y = Math.PI / 2;
    root.add(faceDisk);

    // Curved amber beak
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.11, 4), goldMat);
    beak.rotateZ(-Math.PI / 2 - 0.2);
    beak.position.set(0.38, 0.54, 0);
    root.add(beak);

    // Feather ear tufts
    [-0.14, 0.14].forEach(z => {
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 4), featherMat);
      tuft.position.set(0.18, 0.82, z);
      tuft.rotation.z = -0.3;
      tuft.rotation.x = (z > 0 ? 0.4 : -0.4);
      root.add(tuft);
    });

    // Big luminous golden anime eyes, blush, moon emblem
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.32, y: 0.62, z: 0.09 },
      eyeRadius: 0.055,
      eyeColor: 0xfbbf24,
      mouthPos: { x: 0.36, y: 0.48, z: 0 },
      mouthType: 'cat',
      mouthScale: 0.8,
      blushOffset: { x: 0.28, y: 0.52, z: 0.14 },
      blushRadius: 0.04,
      blushColor: 0xf472b6,
      foreheadPos: { x: 0.24, y: 0.78, z: 0 },
      foreheadIcon: 'moon'
    });

    // Wings at sides
    const wingsGroup = new THREE.Group();
    [-1, 1].forEach(side => {
      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.45, 5), featherMat);
      wing.position.set(-0.02, 0.42, side * 0.32);
      wing.rotation.z = 1.2;
      wing.rotation.x = side * 0.2;
      wingsGroup.add(wing);
    });
    root.add(wingsGroup);
    group.wingsGroup = wingsGroup;

    // Small claw feet
    [-0.1, 0.1].forEach(z => {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.1, 4), goldMat);
      claw.position.set(0.08, 0.04, z);
      claw.rotation.x = Math.PI / 2;
      root.add(claw);
    });

    group.add(root);
  }

  // --- 🐢 10. Turtle Builder (熔火玄甲龜 / 地火厚甲神龜) ---
  static buildTurtle(group, scale = 1) {
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xf97316, emissiveIntensity: 0.6, roughness: 0.3 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.6 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // Domed obsidian shell
    const shellGeo = new THREE.SphereGeometry(0.42, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.52);
    shellGeo.scale(1.2, 0.85, 1);
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.y = 0.22;
    root.add(shell);

    // Glowing Lava lines on shell
    for (let i = 0; i < 4; i++) {
      const vein = new THREE.Mesh(new THREE.TorusGeometry(0.14 + i * 0.07, 0.018, 4, 12, Math.PI), lavaMat);
      vein.position.set(0, 0.38 + i * 0.04, 0);
      vein.rotation.x = Math.PI / 2;
      root.add(vein);
    }

    // Friendly turtle head
    const headGeo = new THREE.SphereGeometry(0.18, 10, 10);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0.48, 0.28, 0);
    root.add(head);

    // Anime amber eyes, gentle smile, blush, flame emblem
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.54, y: 0.32, z: 0.09 },
      eyeRadius: 0.042,
      eyeColor: 0xf59e0b,
      mouthPos: { x: 0.62, y: 0.24, z: 0 },
      mouthType: 'smile',
      mouthScale: 0.8,
      blushOffset: { x: 0.5, y: 0.25, z: 0.12 },
      blushRadius: 0.035,
      blushColor: 0xf472b6,
      foreheadPos: { x: 0.5, y: 0.42, z: 0 },
      foreheadIcon: 'flame'
    });

    // 4 Stubby flippers/legs
    [[0.28, -0.26], [0.28, 0.26], [-0.28, -0.26], [-0.28, 0.26]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 6), skinMat);
      leg.position.set(x, 0.12, z);
      leg.rotation.z = (x > 0 ? -0.4 : 0.4);
      leg.rotation.x = (z > 0 ? 0.6 : -0.6);
      root.add(leg);
    });

    // Little tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.52, 0.18, 0);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 4), skinMat);
    tail.rotation.z = Math.PI / 2;
    tailGroup.add(tail);
    root.add(tailGroup);
    group.tailGroup = tailGroup;

    group.add(root);
  }

  // --- 🐱 11. Cat Builder (幽夜星月貓 / 雙尾靈貓) ---
  static buildCat(group, scale = 1) {
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // Sleek cat body
    const bodyGeo = new THREE.SphereGeometry(0.32, 12, 12);
    bodyGeo.scale(1.2, 0.88, 0.85);
    const body = new THREE.Mesh(bodyGeo, blackMat);
    body.position.y = 0.32;
    root.add(body);

    // White chest fluff
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), whiteMat);
    chest.scale.set(0.9, 0.7, 0.7);
    chest.position.set(0.12, 0.28, 0);
    root.add(chest);

    // Round cat head
    const headGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const head = new THREE.Mesh(headGeo, blackMat);
    head.position.set(0.32, 0.52, 0);
    root.add(head);

    // Pointed cat ears
    [-0.12, 0.12].forEach(z => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 4), blackMat);
      ear.position.set(0.3, 0.72, z);
      ear.rotation.z = -0.2;
      ear.rotation.x = (z > 0 ? 0.3 : -0.3);
      root.add(ear);

      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 4), new THREE.MeshBasicMaterial({ color: 0xfbcfe8 }));
      inner.position.set(0.32, 0.71, z);
      inner.rotation.z = -0.2;
      inner.rotation.x = (z > 0 ? 0.3 : -0.3);
      root.add(inner);
    });

    // Golden Bell Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 6, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    collar.position.set(0.22, 0.44, 0);
    collar.rotation.y = Math.PI / 2;
    root.add(collar);

    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), goldMat);
    bell.position.set(0.38, 0.4, 0);
    root.add(bell);

    // Whiskers
    [-0.08, 0.08].forEach(z => {
      for (let w = -1; w <= 1; w++) {
        const whisker = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.16, 4), whiteMat);
        whisker.position.set(0.48, 0.48 + w * 0.02, z * 1.5);
        whisker.rotation.z = Math.PI / 2;
        whisker.rotation.y = (z > 0 ? 0.6 : -0.6);
        root.add(whisker);
      }
    });

    // Expressive amethyst anime eyes, :3 cat mouth, blush, moon emblem
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.48, y: 0.55, z: 0.11 },
      eyeRadius: 0.048,
      eyeColor: 0xa855f7,
      mouthPos: { x: 0.54, y: 0.46, z: 0 },
      mouthType: 'cat',
      mouthScale: 0.85,
      blushOffset: { x: 0.42, y: 0.47, z: 0.15 },
      blushRadius: 0.04,
      blushColor: 0xf472b6,
      foreheadPos: { x: 0.38, y: 0.72, z: 0 },
      foreheadIcon: 'moon'
    });

    // 4 Paws with white socks
    [[0.18, -0.12], [0.18, 0.12], [-0.18, -0.12], [-0.18, 0.12]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.22, 6), blackMat);
      leg.position.set(x, 0.11, z);
      root.add(leg);

      const sock = new THREE.Mesh(new THREE.SphereGeometry(0.052, 6, 6), whiteMat);
      sock.position.set(x + 0.02, 0.03, z);
      root.add(sock);
    });

    // Twin Feline Tails
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.32, 0.34, 0);
    [-0.06, 0.06].forEach((tz, i) => {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.42, 6), blackMat);
      t.position.set(-0.16, 0.15, tz);
      t.rotation.z = 1.3;
      t.rotation.y = (i === 0 ? -0.3 : 0.3);
      tailGroup.add(t);
    });
    root.add(tailGroup);
    group.tailGroup = tailGroup;

    group.add(root);
  }

  static buildDog(group, scale = 1) {
    const shibaOrange = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.65 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x059669 });
    const bellMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // Chubby Shiba Dog Body
    const bodyGeo = new THREE.SphereGeometry(0.34, 12, 12);
    bodyGeo.scale(1.22, 0.92, 0.88);
    const body = new THREE.Mesh(bodyGeo, shibaOrange);
    body.position.y = 0.34;
    root.add(body);

    // Cream white belly & chest
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), whiteMat);
    chest.scale.set(0.95, 0.75, 0.75);
    chest.position.set(0.12, 0.3, 0);
    root.add(chest);

    // Big friendly round head
    const headGeo = new THREE.SphereGeometry(0.26, 12, 12);
    const head = new THREE.Mesh(headGeo, shibaOrange);
    head.position.set(0.32, 0.54, 0);
    root.add(head);

    // White cheeks & muzzle
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), whiteMat);
    muzzle.scale.set(1.1, 0.8, 0.9);
    muzzle.position.set(0.48, 0.48, 0);
    root.add(muzzle);

    // Cute black nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), new THREE.MeshBasicMaterial({ color: 0x18181b }));
    nose.position.set(0.58, 0.5, 0);
    root.add(nose);

    // Perky Shiba triangle ears
    const earsGroup = new THREE.Group();
    [-0.12, 0.12].forEach(z => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 4), shibaOrange);
      ear.position.set(0.32, 0.74, z);
      ear.rotation.z = -0.15;
      ear.rotation.x = (z > 0 ? 0.25 : -0.25);
      earsGroup.add(ear);

      const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 4), whiteMat);
      innerEar.position.set(0.34, 0.73, z);
      innerEar.rotation.z = -0.15;
      innerEar.rotation.x = (z > 0 ? 0.25 : -0.25);
      earsGroup.add(innerEar);
    });
    root.add(earsGroup);
    group.earsGroup = earsGroup;

    // Green Bandana / Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.025, 6, 16), collarMat);
    collar.position.set(0.22, 0.45, 0);
    collar.rotation.y = Math.PI / 2;
    root.add(collar);

    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), bellMat);
    bell.position.set(0.38, 0.41, 0);
    root.add(bell);

    // Anime Eyes & White Eyebrow Dots (Classic Shiba eyebrow spots)
    this.attachAnimePetFace(root, {
      eyeOffset: { x: 0.49, y: 0.57, z: 0.12 },
      eyeRadius: 0.046,
      eyeColor: 0x78350f,
      mouthPos: { x: 0.54, y: 0.45, z: 0 },
      mouthType: 'cat',
      mouthScale: 0.9,
      blushOffset: { x: 0.44, y: 0.49, z: 0.16 },
      blushRadius: 0.045,
      blushColor: 0xfb7185,
      foreheadPos: { x: 0.38, y: 0.74, z: 0 },
      foreheadIcon: 'star'
    });

    // Shiba eyebrow dots
    [-0.08, 0.08].forEach(z => {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), whiteMat);
      dot.scale.set(0.6, 0.8, 1);
      dot.position.set(0.48, 0.65, z);
      root.add(dot);
    });

    // 4 Sturdy Paws
    [[0.18, -0.13], [0.18, 0.13], [-0.18, -0.13], [-0.18, 0.13]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.24, 6), shibaOrange);
      leg.position.set(x, 0.12, z);
      root.add(leg);

      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.058, 6, 6), whiteMat);
      paw.position.set(x + 0.02, 0.03, z);
      root.add(paw);
    });

    // Curled Shiba Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.32, 0.42, 0);
    const tailGeo = new THREE.TorusGeometry(0.12, 0.05, 8, 16, Math.PI * 1.35);
    const tailMesh = new THREE.Mesh(tailGeo, shibaOrange);
    tailMesh.rotation.y = Math.PI / 2;
    tailMesh.rotation.x = 0.4;
    tailGroup.add(tailMesh);
    root.add(tailGroup);
    group.tailGroup = tailGroup;

    group.add(root);
  }

  // --- 🏷️ 12. 3D Floating Nameplate Badge Sprite ---
  static createNameBadge(nameText, levelText, iconText, colorHex = '#38bdf8') {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 56;
    const ctx = canvas.getContext('2d');

    // Rounded rectangle background - sleek and compact
    const rx = 4, ry = 4, rw = 232, rh = 48, rad = 24;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(rx + rad, ry);
    ctx.lineTo(rx + rw - rad, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
    ctx.lineTo(rx + rw, ry + rh - rad);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
    ctx.lineTo(rx + rad, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
    ctx.lineTo(rx, ry + rad);
    ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text: Icon + Name
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${iconText} ${nameText}`, 16, 28);

    // Text: Level badge
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = colorHex;
    ctx.textAlign = 'right';
    ctx.fillText(`${levelText}`, 222, 28);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.72, 0.17, 1);
    return sprite;
  }
}
