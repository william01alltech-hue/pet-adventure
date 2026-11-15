// Battle System for 《魔寵：幻境之旅》- 心靈對話與魔寵收服增強版
import { ELEMENTS, PET_SPECIES } from './pets_data.js';
import { CHARACTERS } from './character_data.js';
import { sound } from './audio.js';

export class BattleManager {
  constructor(game) {
    this.game = game;
    this.inBattle = false;
    this.playerPet = null;
    this.enemyPet = null;
    this.isPlayerTurn = true;
    this.turnCount = 1;
    this.log = [];
    this.onBattleEnd = null;
    this.trustMeter = 0; // 0-100 心靈親密度
    this.enemyQuote = '';
    this.playerQuote = '';
  }

  // Calculate elemental damage multiplier
  static getElementMultiplier(attackerElem, defenderElem) {
    if (!attackerElem || !defenderElem) return 1.0;
    if (attackerElem === 'shadow' || defenderElem === 'shadow') return 1.25;

    const elemData = ELEMENTS[attackerElem];
    if (elemData) {
      if (elemData.strongAgainst === defenderElem) return 1.5; // 克制！
      if (elemData.weakAgainst === defenderElem) return 0.75; // 被克制
    }
    return 1.0;
  }

  startBattle(playerPetInstance, enemySpeciesId, onEnd) {
    this.inBattle = true;
    this.onBattleEnd = onEnd;
    this.trustMeter = 0;

    // Player Pet snapshot
    this.playerPet = {
      instance: playerPetInstance,
      species: PET_SPECIES[playerPetInstance.speciesId],
      hp: playerPetInstance.currentHp || playerPetInstance.maxHp,
      maxHp: playerPetInstance.maxHp,
      atk: playerPetInstance.atk,
      def: playerPetInstance.def,
      spd: playerPetInstance.spd,
      level: playerPetInstance.level
    };

    // Enemy Pet generation
    const enemySpec = PET_SPECIES[enemySpeciesId] || PET_SPECIES['fire_1'];
    const enemyLevel = Math.max(1, this.playerPet.level + Math.floor(Math.random() * 2) - 1);
    const statScale = 1 + (enemyLevel - 1) * 0.18;

    this.enemyPet = {
      speciesId: enemySpeciesId,
      species: enemySpec,
      name: `野生 ${enemySpec.name}`,
      level: enemyLevel,
      hp: Math.round(enemySpec.baseHp * statScale),
      maxHp: Math.round(enemySpec.baseHp * statScale),
      atk: Math.round(enemySpec.baseAtk * statScale),
      def: Math.round(enemySpec.baseDef * statScale),
      spd: Math.round(enemySpec.baseSpd * statScale)
    };

    this.isPlayerTurn = (this.playerPet.spd >= this.enemyPet.spd);
    this.turnCount = 1;

    // Initial character & monster quotes
    const char = CHARACTERS[this.game.characterId] || CHARACTERS['xingyue'];
    this.playerQuote = `「${char.name}，小心！它身上有異樣的能量波動！」`;

    const elemQuotes = {
      fire: '「吼！滾開！體內的熔岩黑霧在灼燒我……好痛！」',
      ice: '「嘶……寒風在悲鳴……你也是黑霧派來的敵人嗎？」',
      nature: '「沙沙……不要破壞森林……救救我們……」',
      shadow: '「咕嚕……迷宮深處的暗影，在吞噬我的意志……」'
    };
    this.enemyQuote = elemQuotes[enemySpec.element] || '「嗷嗚！不要靠近我！」';

    this.log = [
      `遭遇了 ${this.enemyPet.name} (Lv.${this.enemyPet.level})！`,
      `【心靈感應】：${this.enemyPet.name} 似乎被黑霧纏身，試著與它【💬 心靈對話】吧！`
    ];

    // Trigger UI Open
    if (this.game.ui) {
      this.game.ui.openBattleModal(this);
    }

    if (!this.isPlayerTurn) {
      setTimeout(() => this.executeEnemyTurn(), 1200);
    }
  }

  // --- 玩家執行戰鬥/對話行動 ---
  playerAction(actionType, extraData) {
    if (!this.inBattle || !this.isPlayerTurn) return;
    this.isPlayerTurn = false;

    const char = CHARACTERS[this.game.characterId] || CHARACTERS['xingyue'];

    if (actionType === 'talk') {
      // 💬 心靈溝通 / 讓它跟我說話
      sound.playHeal();
      this.trustMeter = Math.min(100, this.trustMeter + 50);

      const talkLines = {
        xingyue: `星月柔聲道：「不要怕，我是星月，這是星光的力量，讓我為你驅散黑霧的痛苦……」`,
        yeying: `夜影冷靜凝視：「冷靜下來，我看見了纏繞你的濁氣源頭，我們不是敵人。」`,
        chenxi: `晨曦輕撫雙手：「（施展生命祝福）大自然的精靈在守護著你，放鬆心神，痛痛飛走了……」`
      };
      this.playerQuote = `「跟我說話吧，我能聽懂你的心聲！」`;

      if (this.trustMeter < 100) {
        this.enemyQuote = `「（愣住）……你、你聽得懂我說話？！我感覺腦海裡的黑霧稍微消散了一點……」`;
        this.log.unshift(`💬 ${talkLines[this.game.characterId] || talkLines.xingyue}`);
        this.log.unshift(`💖 ${this.enemyPet.name} 感受到了溫暖的善意，心靈親密度上升至 ${this.trustMeter}%！`);
        this.game.ui?.showFloatingBattleText('battle-enemy-avatar', `💖 +50% 心靈感應！`, '#f472b6');
        this.game.ui?.updateBattleDisplay();

        // 敵方回合（猶豫攻擊或降低傷害）
        setTimeout(() => {
          this.executeEnemyHesitate();
        }, 1200);
        return;
      } else {
        // 心靈親密度達到100% -> 成功感化收服！
        sound.playVictory();
        this.enemyQuote = `「好舒服的光芒……黑霧徹底離開我了！你救了我，我願意跟你一起走！」`;
        this.log.unshift(`🎉【心靈相通・成功收服！】${this.enemyPet.name} 徹底被感化，決定跟隨你踏上冒險！`);

        const newPet = this.game.addNewPet(this.enemyPet.speciesId);
        this.game.coins += 40;
        this.game.playerPetAffection = 85;

        this.game.ui?.updateBattleDisplay();
        setTimeout(() => {
          this.game.ui?.showToast(`✨ 成功將【${newPet.customName}】收服為同行新魔寵！可隨時在養成面板中互動！`, 6000);
          this.endBattle(true);
        }, 2200);
        return;
      }

    } else if (actionType === 'basic_attack') {
      const baseDmg = this.playerPet.atk * 0.95;
      const mult = BattleManager.getElementMultiplier(this.playerPet.species.element, this.enemyPet.species.element);
      const defenseReduction = Math.max(0.2, 1 - (this.enemyPet.def * 0.005));
      const damage = Math.round(Math.max(10, (baseDmg - this.enemyPet.def * 0.3) * mult * defenseReduction));

      this.enemyPet.hp = Math.max(0, this.enemyPet.hp - damage);
      sound.playClick();

      let effMsg = '';
      if (mult > 1.2) effMsg = ' 💥 效果絕佳！';
      else if (mult < 0.9) effMsg = ' 💦 效果欠佳...';

      this.playerQuote = `「接招吧！這是夥伴的力量！」`;
      this.enemyQuote = `「可惡……黑霧在催促我反擊！」`;

      this.log.unshift(`${this.playerPet.species.name} 施展普通攻擊，造成 ${damage} 點傷害！${effMsg}`);
      this.game.ui?.showFloatingBattleText('battle-enemy-avatar', `-${damage}`, '#f87171');
      this.game.ui?.updateBattleDisplay();
      this.checkBattleStatus();

    } else if (actionType === 'skill') {
      const skill = this.playerPet.species.skill;
      const baseDmg = this.playerPet.atk * (skill.power / 40);
      const mult = BattleManager.getElementMultiplier(this.playerPet.species.element, this.enemyPet.species.element);
      const damage = Math.round(Math.max(18, baseDmg * mult));

      this.enemyPet.hp = Math.max(0, this.enemyPet.hp - damage);

      // Play specific skill sound
      if (this.playerPet.species.element === 'fire') sound.playFireball();
      else if (this.playerPet.species.element === 'ice') sound.playFreeze();
      else if (this.playerPet.species.element === 'nature') sound.playHeal();
      else sound.playShadowPulse();

      // Check self heal if skill has healRatio
      if (skill.healRatio) {
        const healAmt = Math.round(this.playerPet.maxHp * skill.healRatio);
        this.playerPet.hp = Math.min(this.playerPet.maxHp, this.playerPet.hp + healAmt);
        this.playerPet.instance.currentHp = this.playerPet.hp;
        this.log.unshift(`✨ 治癒之光綻放！生命值回復 ${healAmt} 點！`);
      }

      let effMsg = '';
      if (mult > 1.2) effMsg = ' 🌟 元素克制！爆擊重創！';
      else if (mult < 0.9) effMsg = ' 🛡️ 屬性受阻...';

      this.playerQuote = `「感受幻境元素的洗禮吧——【${skill.name}】！」`;
      this.enemyQuote = `「好強烈的元素衝擊……嗚啊！」`;

      this.log.unshift(`${this.playerPet.species.name} 施放絕招【${skill.name}】，爆發 ${damage} 點元素傷害！${effMsg}`);
      this.game.ui?.showUltimateCutIn(`【${skill.name}】`, this.playerPet.species.icon);
      this.game.ui?.showFloatingBattleText('battle-enemy-avatar', `-${damage} 💥 絕招！`, '#facc15');
      this.game.ui?.updateBattleDisplay();
      this.checkBattleStatus();

    } else if (actionType === 'item') {
      // Use Berry in battle
      const healAmt = Math.round(this.playerPet.maxHp * 0.45);
      this.playerPet.hp = Math.min(this.playerPet.maxHp, this.playerPet.hp + healAmt);
      this.playerPet.instance.currentHp = this.playerPet.hp;
      sound.playFeed();

      this.playerQuote = `「吃顆甜蜜漿果，體力恢復過來了！」`;
      this.log.unshift(`投餵了恢復漿果，回復了 ${healAmt} 點生命值！`);
      this.game.ui?.showFloatingBattleText('battle-player-avatar', `+${healAmt} 💖 回復`, '#4ade80');
      this.game.ui?.updateBattleDisplay();
      this.checkBattleStatus();

    } else if (actionType === 'escape') {
      sound.playClick();
      this.playerQuote = `「暫時撤退，下次再與你溝通！」`;
      this.log.unshift('💨 成功逃離了戰鬥！');
      this.game.ui?.updateBattleDisplay();
      setTimeout(() => this.endBattle(false), 900);
      return;
    }

    if (this.inBattle && this.enemyPet.hp > 0) {
      setTimeout(() => this.executeEnemyTurn(), 1100);
    }
  }

  // --- 對話後的猶豫回合 ---
  executeEnemyHesitate() {
    if (!this.inBattle || this.enemyPet.hp <= 0) return;

    this.enemyQuote = `「……你的眼神很溫柔，我下不去手……再和我說說話好嗎？」`;
    this.log.unshift(`🌿 ${this.enemyPet.name} 受到感化陷入深思，放棄了本輪攻擊！`);
    this.turnCount++;
    this.isPlayerTurn = true;
    this.game.ui?.updateBattleDisplay();
  }

  // --- 敵方回合 ---
  executeEnemyTurn() {
    if (!this.inBattle || this.enemyPet.hp <= 0) return;

    const enemySkill = this.enemyPet.species.skill;
    const useSkill = Math.random() < 0.6;

    let damage = 0;
    if (useSkill && enemySkill) {
      const baseDmg = this.enemyPet.atk * (enemySkill.power / 42);
      const mult = BattleManager.getElementMultiplier(this.enemyPet.species.element, this.playerPet.species.element);
      damage = Math.round(Math.max(12, baseDmg * mult));

      if (this.enemyPet.species.element === 'fire') sound.playFireball();
      else if (this.enemyPet.species.element === 'ice') sound.playFreeze();
      else if (this.enemyPet.species.element === 'nature') sound.playHeal();
      else sound.playShadowPulse();

      this.enemyQuote = `「受死吧！黑霧之怒——【${enemySkill.name}】！」`;
      this.log.unshift(`${this.enemyPet.name} 施放了技能【${enemySkill.name}】，造成 ${damage} 點傷害！`);
    } else {
      const baseDmg = this.enemyPet.atk * 0.88;
      const mult = BattleManager.getElementMultiplier(this.enemyPet.species.element, this.playerPet.species.element);
      damage = Math.round(Math.max(8, baseDmg * mult));
      sound.playClick();

      this.enemyQuote = `「嗷嗚！別想靠近這座神殿！」`;
      this.log.unshift(`${this.enemyPet.name} 發動猛烈撞擊，造成 ${damage} 點傷害！`);
      this.game.ui?.showFloatingBattleText('battle-player-avatar', `-${damage}`, '#ef4444');
    }

    this.playerPet.hp = Math.max(0, this.playerPet.hp - damage);
    this.playerPet.instance.currentHp = this.playerPet.hp;
    this.turnCount++;
    this.isPlayerTurn = true;

    this.game.ui?.updateBattleDisplay();
    this.checkBattleStatus();
  }

  // --- 檢查勝負狀態 ---
  checkBattleStatus() {
    if (this.enemyPet.hp <= 0) {
      // 戰鬥勝利！
      sound.playVictory();
      const expReward = 35 + this.enemyPet.level * 15;
      const coinReward = 20 + this.enemyPet.level * 8;

      this.enemyQuote = `「黑霧……終於散去了……謝謝你……」`;
      this.log.unshift(`🎉 勝利！驅散了 ${this.enemyPet.name} 體內的濁氣！獲得 ${expReward} 經驗值，${coinReward} 金幣！`);
      this.playerPet.instance.gainExp(expReward);
      this.game.coins += coinReward;

      // 掉落進化石或魔寵蛋機率
      if (Math.random() < 0.5) {
        const dropStone = `${this.enemyPet.species.element}_stone`;
        this.game.addItem(dropStone, 1);
        this.log.unshift(`🎁 額外掉落了珍稀素材：【${dropStone}】x1！`);
      }
      if (Math.random() < 0.3) {
        const dropEgg = `egg_${this.enemyPet.species.element}`;
        this.game.addItem(dropEgg, 1);
        this.log.unshift(`🥚 幸運拾獲了野生魔寵蛋：【${dropEgg}】x1！`);
      }

      this.game.ui?.updateBattleDisplay();
      setTimeout(() => this.endBattle(true), 1800);

    } else if (this.playerPet.hp <= 0) {
      // 戰鬥力竭
      this.log.unshift(`💔 ${this.playerPet.species.name} 體力不支倒下了...`);
      this.playerPet.instance.currentHp = 1; // 保留1血
      this.game.ui?.updateBattleDisplay();
      setTimeout(() => this.endBattle(false), 1600);
    }
  }

  endBattle(isWin) {
    this.inBattle = false;
    if (this.game.ui) {
      this.game.ui.closeBattleModal();
    }
    if (this.onBattleEnd) {
      this.onBattleEnd(isWin);
    }
  }
}
