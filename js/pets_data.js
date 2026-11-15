// Complete Pet Database for 《魔寵：幻境之旅》

export const ELEMENTS = {
  fire: {
    id: 'fire',
    name: '火',
    icon: '🔥',
    color: '#ef4444',
    bg: 'linear-gradient(135deg, #f87171, #dc2626)',
    strongAgainst: 'nature',
    weakAgainst: 'ice',
    desc: '狂暴烈焰，克制森林，受制於冰霜'
  },
  ice: {
    id: 'ice',
    name: '冰',
    icon: '❄️',
    color: '#38bdf8',
    bg: 'linear-gradient(135deg, #38bdf8, #0284c7)',
    strongAgainst: 'fire',
    weakAgainst: 'nature',
    desc: '極寒冰霜，克制烈焰，受制於自然'
  },
  nature: {
    id: 'nature',
    name: '木',
    icon: '🌿',
    color: '#22c55e',
    bg: 'linear-gradient(135deg, #4ade80, #16a34a)',
    strongAgainst: 'ice',
    weakAgainst: 'fire',
    desc: '繁茂自然，克制冰霜，受制於烈焰'
  },
  shadow: {
    id: 'shadow',
    name: '暗',
    icon: '🌙',
    color: '#c084fc',
    bg: 'linear-gradient(135deg, #c084fc, #7e22ce)',
    strongAgainst: 'all',
    weakAgainst: 'all',
    desc: '神秘深淵，對所有屬性造成1.25倍傷害，自身也受1.25倍傷害'
  },
  thunder: {
    id: 'thunder',
    name: '雷',
    icon: '⚡',
    color: '#eab308',
    bg: 'linear-gradient(135deg, #facc15, #ca8a04)',
    strongAgainst: 'ice',
    weakAgainst: 'shadow',
    desc: '狂暴雷霆，迅疾狂野，暴擊麻痺，克制冰霜'
  },
  light: {
    id: 'light',
    name: '光',
    icon: '✨',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #fde047, #f59e0b)',
    strongAgainst: 'shadow',
    weakAgainst: 'fire',
    desc: '聖潔輝光，奇蹟治癒，克制暗夜，受制於烈火'
  },
  water: {
    id: 'water',
    name: '水',
    icon: '💧',
    color: '#06b6d4',
    bg: 'linear-gradient(135deg, #38bdf8, #0284c7)',
    strongAgainst: 'fire',
    weakAgainst: 'thunder',
    desc: '柔和清泉，滋潤萬物，克制烈焰，受制於雷霆'
  }
};

export const RARITIES = {
  common: { id: 'common', name: '普通', color: '#94a3b8', border: '#cbd5e1', stars: 1, hatchRate: 0.55 },
  rare: { id: 'rare', name: '稀有', color: '#38bdf8', border: '#0284c7', stars: 2, hatchRate: 0.30 },
  epic: { id: 'epic', name: '史詩', color: '#c084fc', border: '#9333ea', stars: 3, hatchRate: 0.12 },
  legendary: { id: 'legendary', name: '傳說', color: '#facc15', border: '#eab308', stars: 4, hatchRate: 0.03 }
};

export const PET_SPECIES = {
  // 🔥 火焰系家族
  fire_1: {
    id: 'fire_1',
    name: '烈焰小火狐',
    title: '初火之靈',
    element: 'fire',
    rarity: 'rare',
    stage: 1,
    icon: '🦊',
    modelKey: 'flame_fox',
    baseHp: 180,
    baseAtk: 42,
    baseDef: 24,
    baseSpd: 36,
    skill: {
      id: 'fireball',
      name: '火焰球',
      icon: '🔥',
      power: 45,
      cooldown: 3.0,
      desc: '吐出熾熱高溫火球轟擊目標，造成巨額火焰傷害！'
    },
    evolvesTo: 'fire_2',
    evolveReq: { level: 10, stone: 'fire_stone', stoneCount: 2 },
    desc: '誕生於熔岩裂隙邊緣的小靈狐，蓬鬆的大尾巴跳動著溫柔的火苗，非常依賴主人的撫摸。',
    quote: '嗷嗚～暖呼呼的火苗照亮黑夜！'
  },
  fire_2: {
    id: 'fire_2',
    name: '赤炎靈狐',
    title: '烈焰舞者',
    element: 'fire',
    rarity: 'epic',
    stage: 2,
    icon: '🦊🔥',
    modelKey: 'blaze_vulpix',
    baseHp: 320,
    baseAtk: 78,
    baseDef: 45,
    baseSpd: 65,
    skill: {
      id: 'flame_ring',
      name: '熾火旋風',
      icon: '🌪️🔥',
      power: 85,
      cooldown: 5.0,
      desc: '旋轉身軀召喚環繞烈焰旋渦，連續灼燒前方魔物！'
    },
    evolvesTo: 'fire_3',
    evolveReq: { level: 25, stone: 'fire_stone', stoneCount: 5 },
    desc: '身體纏繞著赤金烈焰緞帶，行動如疾風閃電，所經之處綻放永不熄滅的紅蓮花。',
    quote: '烈焰將焚盡一切黑暗！'
  },
  fire_3: {
    id: 'fire_3',
    name: '炎獄九尾神狐',
    title: '日曜太陽神獸',
    element: 'fire',
    rarity: 'legendary',
    stage: 3,
    icon: '👑🦊',
    modelKey: 'nine_tailed_fox',
    baseHp: 650,
    baseAtk: 155,
    baseDef: 88,
    baseSpd: 110,
    skill: {
      id: 'solar_meteor',
      name: '天火九尾天隕',
      icon: '☄️🔥',
      power: 180,
      cooldown: 8.0,
      desc: '九條絢爛火尾引導宇宙天火流星轟炸，產生毀滅級大爆炸！'
    },
    evolvesTo: null,
    desc: '古代神話中的祥瑞神獸，身披九道神火天尾，掌控太陽天火之力，唯有最真摯的心能獲得它的認可。',
    quote: '以日曜神火之名，守護幻境和平！'
  },

  // ❄️ 冰霜系家族
  ice_1: {
    id: 'ice_1',
    name: '霜雪小藍狼',
    title: '寒霜幼崽',
    element: 'ice',
    rarity: 'rare',
    stage: 1,
    icon: '🐺',
    modelKey: 'frost_pup',
    baseHp: 200,
    baseAtk: 38,
    baseDef: 30,
    baseSpd: 32,
    skill: {
      id: 'frost_nova',
      name: '冰凍術',
      icon: '❄️',
      power: 42,
      cooldown: 3.0,
      desc: '凝結空氣中的水汽化作尖銳冰晶突刺，有機率凍結敵方！'
    },
    evolvesTo: 'ice_2',
    evolveReq: { level: 10, stone: 'ice_stone', stoneCount: 2 },
    desc: '生長於永凍冰原的可愛雪狼，鼻尖和肉球總是涼絲絲的，最喜歡在雪地裡打滾。',
    quote: '嗷嗚～冰涼的微風陪伴你！'
  },
  ice_2: {
    id: 'ice_2',
    name: '晶霜雪狼',
    title: '極寒行者',
    element: 'ice',
    rarity: 'epic',
    stage: 2,
    icon: '🐺❄️',
    modelKey: 'glacial_wolf',
    baseHp: 350,
    baseAtk: 72,
    baseDef: 58,
    baseSpd: 55,
    skill: {
      id: 'blizzard_shards',
      name: '暴風冰錐',
      icon: '🌨️',
      power: 80,
      cooldown: 5.0,
      desc: '召喚暴風雪凝聚無數懸浮冰矛射擊敵方陣線！'
    },
    evolvesTo: 'ice_3',
    evolveReq: { level: 25, stone: 'ice_stone', stoneCount: 5 },
    desc: '背部長出透明如鑽石的寒冰棘刺，步伐堅定，冷靜沉穩地守護夥伴。',
    quote: '冰封千里，寒芒如霜！'
  },
  ice_3: {
    id: 'ice_3',
    name: '極光冥霜狼王',
    title: '北境絕對零度',
    element: 'ice',
    rarity: 'legendary',
    stage: 3,
    icon: '👑🐺',
    modelKey: 'aurora_fenrir',
    baseHp: 680,
    baseAtk: 142,
    baseDef: 110,
    baseSpd: 98,
    skill: {
      id: 'absolute_zero',
      name: '絕對零度',
      icon: '🌌❄️',
      power: 175,
      cooldown: 8.0,
      desc: '凍結時間與空間的終極寒冰領域，令對手完全封凍在冰棺中！'
    },
    evolvesTo: null,
    desc: '冰原傳說的頂點，巨大的身姿籠罩在七彩極光中，額前的永凍神石散發無窮寒霜神力。',
    quote: '在極光之下，萬物皆歸永恆之寂。'
  },

  // 🌿 森林系家族
  nature_1: {
    id: 'nature_1',
    name: '綠芽小木鹿',
    title: '森林精靈',
    element: 'nature',
    rarity: 'rare',
    stage: 1,
    icon: '🦌',
    modelKey: 'sprout_fawn',
    baseHp: 220,
    baseAtk: 32,
    baseDef: 35,
    baseSpd: 30,
    skill: {
      id: 'nature_heal',
      name: '治癒術',
      icon: '🌿✨',
      power: 36,
      healRatio: 0.25,
      cooldown: 3.5,
      desc: '綻放純淨自然精華，攻擊敵方同時回復我方 25% 生命值！'
    },
    evolvesTo: 'nature_2',
    evolveReq: { level: 10, stone: 'nature_stone', stoneCount: 2 },
    desc: '嫩綠色的小鹿角上長著三瓣幸運草，眼神清澈純真，喜歡吃甜甜的幻境漿果。',
    quote: '呦呦～草木的清香能撫慰傷痛！'
  },
  nature_2: {
    id: 'nature_2',
    name: '靈木仙鹿',
    title: '碧綠翡翠守護者',
    element: 'nature',
    rarity: 'epic',
    stage: 2,
    icon: '🦌🌸',
    modelKey: 'verdant_deer',
    baseHp: 380,
    baseAtk: 65,
    baseDef: 68,
    baseSpd: 50,
    skill: {
      id: 'thorn_bind',
      name: '荊棘纏繞',
      icon: '🌱',
      power: 75,
      cooldown: 5.0,
      desc: '從地底召喚生機盎然的遠古藤蔓，纏繞並勒緊敵人！'
    },
    evolvesTo: 'nature_3',
    evolveReq: { level: 25, stone: 'nature_stone', stoneCount: 5 },
    desc: '鹿角長成華麗的古木枝枒，開滿永不凋謝的櫻粉仙花，蹄下生草，百鳥環繞。',
    quote: '森林的心跳，就是大地的脈動。'
  },
  nature_3: {
    id: 'nature_3',
    name: '翡翠千花鹿神',
    title: '大地生靈至尊',
    element: 'nature',
    rarity: 'legendary',
    stage: 3,
    icon: '👑🦌',
    modelKey: 'emerald_guardian',
    baseHp: 750,
    baseAtk: 130,
    baseDef: 125,
    baseSpd: 85,
    skill: {
      id: 'gaia_blessing',
      name: '大地恩賜生靈裁決',
      icon: '🌸🌳',
      power: 160,
      healRatio: 0.40,
      cooldown: 8.0,
      desc: '召喚世界之樹神木虛影，天罰萬物並使全體隊友生命大量再生！'
    },
    evolvesTo: null,
    desc: '整座迷霧森林的創生神明，古樹鹿角上掛著星辰果實，散發令人心馳神往的聖潔生機。',
    quote: '生生不息，乃是自然的至理。'
  },

  // 🌙 暗影系家族
  shadow_1: {
    id: 'shadow_1',
    name: '月影小夜蝠',
    title: '暗夜幼靈',
    element: 'shadow',
    rarity: 'rare',
    stage: 1,
    icon: '🦇',
    modelKey: 'shadow_bat',
    baseHp: 170,
    baseAtk: 46,
    baseDef: 20,
    baseSpd: 45,
    skill: {
      id: 'shadow_illusion',
      name: '暗影幻術',
      icon: '🌙',
      power: 48,
      cooldown: 3.0,
      desc: '化身虛幻紫霧分身撲擊，造成無視防禦的暗影傷害！'
    },
    evolvesTo: 'shadow_2',
    evolveReq: { level: 10, stone: 'shadow_stone', stoneCount: 2 },
    desc: '扇動著毛茸茸的小惡魔肉翼，一雙神秘紫水晶般的眼眸，喜歡在月光下悄悄倒掛。',
    quote: '吱吱～黑暗並不可怕，它是夜的斗篷！'
  },
  shadow_2: {
    id: 'shadow_2',
    name: '冥月影魅',
    title: '月蝕幻影',
    element: 'shadow',
    rarity: 'epic',
    stage: 2,
    icon: '🦇🌙',
    modelKey: 'eclipse_shade',
    baseHp: 310,
    baseAtk: 88,
    baseDef: 40,
    baseSpd: 78,
    skill: {
      id: 'void_pulse',
      name: '虛空暗影波',
      icon: '🔮',
      power: 90,
      cooldown: 5.0,
      desc: '釋放共振超音波撕裂空間，衝擊對手靈魂！'
    },
    evolvesTo: 'shadow_3',
    evolveReq: { level: 25, stone: 'shadow_stone', stoneCount: 5 },
    desc: '長出四對深邃的幽影翼刃，身體介於虛實之間，在陰影中穿梭無痕。',
    quote: '黑夜的凝視，將洞悉一切虛妄。'
  },
  shadow_3: {
    id: 'shadow_3',
    name: '終焉暗月魔龍',
    title: '虛空星界主宰',
    element: 'shadow',
    rarity: 'legendary',
    stage: 3,
    icon: '👑🐉',
    modelKey: 'oblivion_dragon',
    baseHp: 640,
    baseAtk: 165,
    baseDef: 82,
    baseSpd: 115,
    skill: {
      id: 'singularity_burst',
      name: '終焉黑洞湮滅',
      icon: '🕳️🌙',
      power: 195,
      cooldown: 8.0,
      desc: '在戰場中心凝聚微型引力黑洞，吞噬撕扯敵方一切防禦！'
    },
    evolvesTo: null,
    desc: '自古老暗月遺跡破封而出的太古魔龍，翼展如深邃星空，呼吸間吞吐幽冥暗物質。',
    quote: '在無盡的深淵面前，臣服吧！'
  },

  // ⚡ 雷電系家族
  thunder_1: {
    id: 'thunder_1',
    name: '雷鳴小電喵',
    title: '奔雷靈貓',
    element: 'thunder',
    rarity: 'rare',
    stage: 1,
    icon: '🐱⚡',
    modelKey: 'thunder_cat',
    baseHp: 185,
    baseAtk: 46,
    baseDef: 22,
    baseSpd: 48,
    skill: {
      id: 'thunder_spark',
      name: '霹靂疾電掌',
      icon: '⚡🐾',
      power: 46,
      cooldown: 2.8,
      desc: '揮動蓄滿靜電肉球拍擊目標，高機率觸發連鎖麻痺暴擊！'
    },
    evolvesTo: 'thunder_2',
    evolveReq: { level: 10, stone: 'thunder_stone', stoneCount: 2 },
    desc: '尾巴宛如一道曲折金色閃電的小靈貓，耳尖跳躍著青藍電弧，生氣時渾身毛髮會蓬鬆炸開。',
    quote: '喵嗚～小心被本喵的靜電電到唷！'
  },
  thunder_2: {
    id: 'thunder_2',
    name: '疾風雷影豹',
    title: '極速破空者',
    element: 'thunder',
    rarity: 'epic',
    stage: 2,
    icon: '🐆⚡',
    modelKey: 'volt_panther',
    baseHp: 330,
    baseAtk: 86,
    baseDef: 44,
    baseSpd: 82,
    skill: {
      id: 'volt_dash',
      name: '奔雷破空刺',
      icon: '⚡🌪️',
      power: 92,
      cooldown: 4.8,
      desc: '化身金色雷霆閃光穿梭戰場，連續斬裂敵方防線！'
    },
    evolvesTo: 'thunder_3',
    evolveReq: { level: 25, stone: 'thunder_stone', stoneCount: 5 },
    desc: '肩胛兩側生出高頻震盪的雷光刃角，奔跑時如流光劃破長夜，雙尾揮動間風雷激盪。',
    quote: '雷馳電掣，無可匹敵！'
  },
  thunder_3: {
    id: 'thunder_3',
    name: '雷帝天罰麒麟',
    title: '萬鈞乾坤天尊',
    element: 'thunder',
    rarity: 'legendary',
    stage: 3,
    icon: '👑⚡',
    modelKey: 'raikiri_qilin',
    baseHp: 660,
    baseAtk: 168,
    baseDef: 90,
    baseSpd: 120,
    skill: {
      id: 'raikiri_heaven',
      name: '九天神雷天罰降世',
      icon: '⚡🌌',
      power: 198,
      cooldown: 7.8,
      desc: '召喚九天玄天神雷神柱貫穿雲霄，將戰場化為雷帝神罰領域！'
    },
    evolvesTo: null,
    desc: '掌控九天神雷的太古祥瑞麒麟神獸，四足踏火雷金雲，雙角流淌天罰正氣，威震諸天。',
    quote: '乾坤萬象，唯吾雷霆代天行道！'
  },

  // ✨ 聖光系家族
  light_1: {
    id: 'light_1',
    name: '光之聖靈兔',
    title: '初曦聖白靈',
    element: 'light',
    rarity: 'rare',
    stage: 1,
    icon: '🐰✨',
    modelKey: 'lumina_bunny',
    baseHp: 210,
    baseAtk: 35,
    baseDef: 32,
    baseSpd: 38,
    skill: {
      id: 'holy_light',
      name: '聖光普照',
      icon: '✨🕊️',
      power: 40,
      healRatio: 0.28,
      cooldown: 3.2,
      desc: '降下溫暖柔和的聖潔白光，淨化對手的同時回復己方生命值！'
    },
    evolvesTo: 'light_2',
    evolveReq: { level: 10, stone: 'light_stone', stoneCount: 2 },
    desc: '長著小小天使羽翼與漂浮金光光環的聖靈雪兔，眼神純真無瑕，能嗅出世間最溫暖的善良。',
    quote: '咕咕～願聖光守護你的每一個夢境！'
  },
  light_2: {
    id: 'light_2',
    name: '聖耀天角獸',
    title: '神聖秩序守護者',
    element: 'light',
    rarity: 'epic',
    stage: 2,
    icon: '🦄✨',
    modelKey: 'radiant_pegacorn',
    baseHp: 360,
    baseAtk: 70,
    baseDef: 65,
    baseSpd: 62,
    skill: {
      id: 'celestial_shield',
      name: '天界神聖護印',
      icon: '🛡️✨',
      power: 78,
      healRatio: 0.35,
      cooldown: 5.0,
      desc: '召喚神聖金色秩序光盾，折射敵方攻擊並給予強力反制！'
    },
    evolvesTo: 'light_3',
    evolveReq: { level: 25, stone: 'light_stone', stoneCount: 5 },
    desc: '頭頂生有琉璃螺旋聖角，展開璀璨晶透天馬羽翼，踏著金色光塵在雲海奔馳。',
    quote: '以天角之誓，驅散一切陰霾。'
  },
  light_3: {
    id: 'light_3',
    name: '創世光曦神凰',
    title: '太陽天曜聖母',
    element: 'light',
    rarity: 'legendary',
    stage: 3,
    icon: '👑🕊️',
    modelKey: 'sun_phoenix',
    baseHp: 720,
    baseAtk: 152,
    baseDef: 105,
    baseSpd: 108,
    skill: {
      id: 'supernova_genesis',
      name: '創世光曦超新星',
      icon: '☀️🕊️',
      power: 185,
      healRatio: 0.45,
      cooldown: 8.0,
      desc: '化身創世初生的神聖金烏太陽，照耀整片幻境宇宙，涅槃重生並重創所有魔障！'
    },
    evolvesTo: null,
    desc: '自星光神殿頂端神聖金蛋涅槃誕生的永恆神凰，三道日光天羽拖曳九天星宿，光芒萬丈。',
    quote: '破曉初開，光明永存於心！'
  },

  // 💧 水靈系家族（泡泡）
  water_1: {
    id: 'water_1',
    name: '碧水靈萌（泡泡）',
    title: '純澈水靈萌獸',
    element: 'water',
    rarity: 'rare',
    stage: 1,
    icon: '💧🫧',
    modelKey: 'bubble_slime',
    baseHp: 195,
    baseAtk: 36,
    baseDef: 32,
    baseSpd: 34,
    skill: {
      id: 'bubble_spray',
      name: '碧波水靈泡泡彈',
      icon: '🫧💧',
      power: 44,
      healRatio: 0.15,
      cooldown: 2.9,
      desc: '吐出漫天晶瑩剔透的七彩水泡彈幕，治癒己方的同時阻礙敵方視野！'
    },
    evolvesTo: 'water_2',
    evolveReq: { level: 10, stone: 'water_stone', stoneCount: 2 },
    desc: '在清澈泉水旁歡快彈跳的水之精靈，身體如果凍般晶瑩柔軟，最喜歡吐出彩色小泡泡讓人撫摸。',
    quote: '波波～咕嚕嚕！清涼純淨的水花陪伴你！'
  },
  water_2: {
    id: 'water_2',
    name: '海月水精靈',
    title: '潮汐漫步者',
    element: 'water',
    rarity: 'epic',
    stage: 2,
    icon: '🌊💧',
    modelKey: 'tidal_spirit',
    baseHp: 340,
    baseAtk: 74,
    baseDef: 60,
    baseSpd: 58,
    skill: {
      id: 'tidal_surge',
      name: '碧海潮汐怒浪',
      icon: '🌊✨',
      power: 84,
      healRatio: 0.25,
      cooldown: 4.9,
      desc: '召喚奔騰不息的海靈潮汐波濤，捲席戰場並全面滋養隊友！'
    },
    evolvesTo: 'water_3',
    evolveReq: { level: 25, stone: 'water_stone', stoneCount: 5 },
    desc: '周身環繞著飄逸的透明海月水袖，在水流與半空中宛若芭蕾舞者般優雅滑行。',
    quote: '潮起潮落，皆是大海溫柔的歌聲。'
  },
  water_3: {
    id: 'water_3',
    name: '滄海玄冰蒼龍',
    title: '深海太古龍神',
    element: 'water',
    rarity: 'legendary',
    stage: 3,
    icon: '👑🐉💧',
    modelKey: 'abyssal_leviathan',
    baseHp: 710,
    baseAtk: 148,
    baseDef: 112,
    baseSpd: 96,
    skill: {
      id: 'leviathan_maelstrom',
      name: '太古萬頃滄海大漩渦',
      icon: '🌀🌊',
      power: 188,
      healRatio: 0.38,
      cooldown: 7.9,
      desc: '掀起吞噬天地的深海逆流大漩渦，重創所有對手並令全隊獲得水流護盾！'
    },
    evolvesTo: null,
    desc: '沉睡於萬米深海秘境古遺址的太古蒼龍，通體湛藍如深淵翡翠，掌控世界上所有江河湖海的脈動。',
    quote: '浩瀚汪洋，承載萬物生機與終極奧秘！'
  },

  // 🐼 熊貓家族（憨態可掬的森林守護者）
  panda_1: {
    id: 'panda_1',
    name: '萌萌小貓熊',
    title: '竹林靈童',
    element: 'nature',
    rarity: 'common',
    stage: 1,
    icon: '🐼',
    modelKey: 'panda_cub',
    baseHp: 220,
    baseAtk: 36,
    baseDef: 34,
    baseSpd: 24,
    skill: {
      id: 'bamboo_smash',
      name: '脆竹萌萌擊',
      icon: '🎋💥',
      power: 65,
      healRatio: 0.15,
      cooldown: 4.0,
      desc: '抱著新鮮脆竹向前翻滾砸擊，並恢復自身少量生命！'
    },
    evolvesTo: 'panda_2',
    desc: '生活在迷霧森林青竹坡的呆萌小貓熊，圓滾滾的身子特別喜歡在草地上打滾。',
    quote: '哢嚓哢嚓……竹子真甜，你要吃一口嗎？'
  },
  panda_2: {
    id: 'panda_2',
    name: '翠竹巨靈熊',
    title: '太極林境武尊',
    element: 'nature',
    rarity: 'rare',
    stage: 2,
    icon: '🐼🎋',
    modelKey: 'bamboo_panda',
    baseHp: 380,
    baseAtk: 68,
    baseDef: 58,
    baseSpd: 38,
    skill: {
      id: 'taichi_palm',
      name: '太極生生八卦掌',
      icon: '☯️🍃',
      power: 105,
      healRatio: 0.22,
      cooldown: 5.2,
      desc: '借力打力，以太極青木罡氣震退周圍一切魔物！'
    },
    evolvesTo: null,
    desc: '深諳大自然陰陽平衡之道的林間長者，揮舞合抱粗的翡翠竹竿。',
    quote: '以柔克剛，萬物皆有其心！'
  },

  // 🐰 雪絨跳跳兔（軟綿綿的極地萌寵）
  bunny_1: {
    id: 'bunny_1',
    name: '雪絨跳跳兔',
    title: '極地絨球',
    element: 'ice',
    rarity: 'common',
    stage: 1,
    icon: '🐰',
    modelKey: 'snow_bunny',
    baseHp: 165,
    baseAtk: 38,
    baseDef: 22,
    baseSpd: 46,
    skill: {
      id: 'bunny_hop_kick',
      name: '旋風飛雪踢',
      icon: '❄️💨',
      power: 58,
      healRatio: 0.1,
      cooldown: 3.5,
      desc: '敏捷地高高躍起，用裹著雪粉的軟萌後腿連環蹬擊！'
    },
    evolvesTo: null,
    desc: '永凍冰原雪丘上的可愛小兔，長耳朵一抖一抖的，跑起來像個滾動的棉花糖。',
    quote: '噗啾！今天也是活力滿滿的一天～'
  },

  // 🦉 智慧夜羽梟（靜夜的守望者）
  owl_1: {
    id: 'owl_1',
    name: '夜羽星光梟',
    title: '靜夜智慧使者',
    element: 'shadow',
    rarity: 'rare',
    stage: 1,
    icon: '🦉',
    modelKey: 'star_owl',
    baseHp: 185,
    baseAtk: 46,
    baseDef: 26,
    baseSpd: 38,
    skill: {
      id: 'owl_star_gaze',
      name: '星瞳透視之眼',
      icon: '👁️✨',
      power: 72,
      healRatio: 0.12,
      cooldown: 4.2,
      desc: '睜開璀璨的金色雙眸，洞察對手破綻並射出暗夜羽刃！'
    },
    evolvesTo: null,
    desc: '棲息於暗月遺跡古樹之巔的睿智猛禽，安靜地眨著大眼睛守護著森林的秘密。',
    quote: '星宿正在低語，未知在前方等待著你……'
  },

  // 🐢 熔火玄甲龜（烈焰火山的厚重長老）
  turtle_1: {
    id: 'turtle_1',
    name: '熔火玄甲龜',
    title: '地火堅甲',
    element: 'fire',
    rarity: 'rare',
    stage: 1,
    icon: '🐢',
    modelKey: 'lava_turtle',
    baseHp: 260,
    baseAtk: 35,
    baseDef: 55,
    baseSpd: 18,
    skill: {
      id: 'magma_shell',
      name: '熾熱熔岩巨甲',
      icon: '🛡️🌋',
      power: 60,
      healRatio: 0.25,
      cooldown: 4.8,
      desc: '縮入滾燙的黑曜石龜殼，釋放地火環衝擊並獲得高額減傷！'
    },
    evolvesTo: null,
    desc: '炎龍火山岩漿池邊慢悠悠散步的長壽烏龜，龜背上流淌著溫熱的熔岩紋路。',
    quote: '走得慢一點，才能看清楚世界的風景呀。'
  },

  // 🐱 星月靈貓（優雅靈動的夜行小精靈）
  cat_1: {
    id: 'cat_1',
    name: '幽夜星月貓',
    title: '月影魅影',
    element: 'shadow',
    rarity: 'rare',
    stage: 1,
    icon: '🐱',
    modelKey: 'moon_cat',
    baseHp: 175,
    baseAtk: 49,
    baseDef: 23,
    baseSpd: 45,
    skill: {
      id: 'shadow_pounce',
      name: '月影魅影撲擊',
      icon: '🐾🌙',
      power: 76,
      healRatio: 0.14,
      cooldown: 3.8,
      desc: '化作一道紫色流光突襲撲倒敵人，必定造成暴擊傷害！'
    },
    evolvesTo: null,
    desc: '神秘莫測的雙尾黑貓，脖子上掛著金色鈴鐺，走路輕巧無聲。',
    quote: '喵嗚～抓住你的影子囉！'
  },

  // 🐶 暖心萌柴犬（溫馨小家的忠誠守護者）
  dog_1: {
    id: 'dog_1',
    name: '暖心萌柴犬',
    title: '忠誠守護者',
    element: 'nature',
    rarity: 'common',
    stage: 1,
    icon: '🐶',
    modelKey: 'shiba_dog',
    baseHp: 210,
    baseAtk: 42,
    baseDef: 30,
    baseSpd: 42,
    skill: {
      id: 'dog_bark_rush',
      name: '元氣汪汪衝刺',
      icon: '🐾✨',
      power: 65,
      healRatio: 0.12,
      cooldown: 3.5,
      desc: '歡快地搖著捲尾巴狂奔衝擊，為主人與身邊夥伴注入元氣！'
    },
    evolvesTo: null,
    desc: '家門口最熱情忠誠的柴犬夥伴，看見主人回家就會興奮地轉圈圈搖尾巴。',
    quote: '汪汪！主人你回來啦～今天也要一起冒險！'
  }
};

// 冒險大地圖區域設定（生態純粹化，火系只出火系，水系只出水系，並加入「我的家」與「碧波水澤」）
export const MAP_ZONES = [
  {
    id: 'home',
    name: '溫馨小家',
    icon: '🏡',
    themeColor: '#ec4899',
    ambientLight: 0xfef08a,
    groundColor: 0x4ade80,
    skyColor: 0xbae6fd,
    fogColor: 0xdcfce7,
    fogDensity: 0.0035,
    wildSpirits: ['bunny_1', 'cat_1', 'dog_1'],
    runeId: 'rune_home',
    runeName: '溫馨守護靈石',
    desc: '你的專屬溫馨農舍與冒險莊園！周圍有結滿甜美果實的果園，門前設有烹飪大鍋，屋內可佈置華麗家具並安睡休息。'
  },
  {
    id: 'forest',
    name: '迷霧森林',
    icon: '🌳',
    themeColor: '#22c55e',
    ambientLight: 0x86efac,
    groundColor: 0x2e7d32,
    skyColor: 0xa7f3d0,
    fogColor: 0x86efac,
    fogDensity: 0.015,
    wildSpirits: ['nature_1', 'nature_2', 'panda_1', 'bunny_1'],
    runeId: 'rune_nature',
    runeName: '翡翠自然符文',
    desc: '古老神木參天，飄散著綠意螢火與生機花粉，純淨的木系翡翠靈鹿與小熊貓在青翠草坡間穿梭玩耍。'
  },
  {
    id: 'water_lake',
    name: '碧波水澤',
    icon: '💧',
    themeColor: '#06b6d4',
    ambientLight: 0xbae6fd,
    groundColor: 0x38bdf8,
    skyColor: 0x7dd3fc,
    fogColor: 0xbae6fd,
    fogDensity: 0.0038,
    wildSpirits: ['water_1', 'water_2', 'turtle_1'],
    runeId: 'rune_water',
    runeName: '潮汐清泉符文',
    desc: '碧波微瀾的無瑕清澈大湖，荷葉漂浮，水波粼粼。湖邊是絕佳的釣魚聖地，棲息著純淨的水靈仙獸與靈甲玄龜。'
  },
  {
    id: 'volcano',
    name: '熔火炎巢 (火的家)',
    icon: '🔥',
    themeColor: '#ef4444',
    ambientLight: 0xfecaca,
    groundColor: 0x3f1505,
    skyColor: 0xf87171,
    fogColor: 0xfca5a5,
    fogDensity: 0.02,
    wildSpirits: ['fire_1', 'fire_2', 'fire_3'],
    runeId: 'rune_fire',
    runeName: '日曜烈火符文',
    desc: '熾烈火山岩壁與流動的滾燙熔岩！【注意：踏入熔岩會被灼傷扣血！】深處棲息著無比強大的炎獄九尾神狐與熔岩領主守護Boss。'
  },
  {
    id: 'tundra',
    name: '永凍冰原',
    icon: '❄️',
    themeColor: '#38bdf8',
    ambientLight: 0xbae6fd,
    groundColor: 0xe0f2fe,
    skyColor: 0x7dd3fc,
    fogColor: 0xbae6fd,
    fogDensity: 0.018,
    wildSpirits: ['ice_1', 'ice_2', 'ice_3'],
    runeId: 'rune_ice',
    runeName: '永凍寒霜符文',
    desc: '亙古不化的晶瑩冰原與巍峨雪峰，極地雪狼幼崽與極光冰靈在晶瑩雪坡間歡快奔馳。'
  },
  {
    id: 'ruins',
    name: '暗月遺跡',
    icon: '🌙',
    themeColor: '#c084fc',
    ambientLight: 0xe9d5ff,
    groundColor: 0x2e1065,
    skyColor: 0x581c87,
    fogColor: 0x7e22ce,
    fogDensity: 0.022,
    wildSpirits: ['shadow_1', 'shadow_2', 'shadow_3'],
    runeId: 'rune_shadow',
    runeName: '深淵暗月符文',
    desc: '懸浮的遠古石柱與神秘暗紫星盤，暗影龍蝠與幽夜靈獸在黑夜之中守護著遠古禁忌封印。'
  },
  {
    id: 'thunder_crag',
    name: '雷霆裂谷',
    icon: '⚡',
    themeColor: '#eab308',
    ambientLight: 0xfef08a,
    groundColor: 0x1e1b4b,
    skyColor: 0x312e81,
    fogColor: 0x4338ca,
    fogDensity: 0.016,
    wildSpirits: ['thunder_1', 'thunder_2', 'thunder_3'],
    runeId: 'rune_thunder',
    runeName: '萬鈞雷霆符文',
    desc: '高聳險峻的黑曜石峽谷，翻滾著萬鈞雷霆閃光，金甲雷靈獸在此吸納天地至陽雷電神力。'
  },
  {
    id: 'celestial_shrine',
    name: '星光神殿',
    icon: '✨',
    themeColor: '#f59e0b',
    ambientLight: 0xfef3c7,
    groundColor: 0xffedd5,
    skyColor: 0xfde68a,
    fogColor: 0xfef08a,
    fogDensity: 0.012,
    wildSpirits: ['light_1', 'light_2', 'light_3'],
    runeId: 'rune_light',
    runeName: '創世光曦符文',
    desc: '懸浮於浩瀚雲海之上的神聖純白殿堂，七彩光華流轉，純白聖角獸與晨曦天馬在雲霧中悠然翱翔。'
  }
];

// 消耗道具與養成物品（加入水果、魚類與料理）
export const CONSUMABLES = [
  { id: 'apple', name: '蜜糖紅蘋果', icon: '🍎', exp: 25, satiety: 30, affection: 8, desc: '自家果園搖落的清甜蘋果，咬下去汁多味美！' },
  { id: 'orange', name: '陽光金蜜柑', icon: '🍊', exp: 30, satiety: 35, affection: 10, desc: '果園新鮮摘採的香甜蜜柑，富含滿滿維他命精華。' },
  { id: 'berry', name: '幻境彩虹漿果', icon: '🍇', exp: 20, satiety: 25, affection: 5, desc: '生長於森林灌木的甘甜果實，魔寵最愛的小零嘴。' },
  { id: 'fish_rainbow', name: '彩虹金鱗魚', icon: '🐟✨', exp: 45, satiety: 40, affection: 15, desc: '在碧波水澤湖邊釣起的稀有彩虹魚，鱗片閃爍七彩光芒。' },
  { id: 'fish_blue', name: '清泉水靈魚', icon: '🐟💧', exp: 35, satiety: 30, affection: 12, desc: '生長於清涼湖泊深處的鮮嫩靈魚。' },
  { id: 'fish_fire', name: '熾火飛魚', icon: '🐟🔥', exp: 60, satiety: 50, affection: 20, desc: '在溫泉湖泊邊緣偶爾跳躍的稀有火紅游魚。' },
  { id: 'dish_grilled_fish', name: '香煎彩虹烤魚', icon: '🍱', exp: 160, satiety: 100, affection: 40, desc: '用自家烹飪鍋慢火烘烤的極品烤魚，香氣四溢，魔寵吃了激動得尾巴直搖！' },
  { id: 'dish_fruit_pie', name: '蘋果香橙金黃派', icon: '🥧', exp: 180, satiety: 100, affection: 45, desc: '用果園新鮮蘋果與蜜柑烘焙的暖暖酥派，親密度大暴漲！' },
  { id: 'dish_royal_feast', name: '幻境海陸全席大餐', icon: '🍲', exp: 350, satiety: 100, affection: 80, desc: '集合果園鮮果與碧波靈魚的頂級奢華料理，所有魔寵全員爭先恐後搶著吃！' },
  { id: 'candy', name: '魔晶星光糖果', icon: '🍬', exp: 50, satiety: 50, affection: 15, desc: '濃縮微量元素精華的星形硬糖，能大幅提振魔寵精神！' },
  { id: 'donut', name: '皇家黃金甜甜圈', icon: '🍩', exp: 120, satiety: 100, affection: 35, desc: '皇家糕點師特別烘焙的極品點心，食用後親密度飆升！' },
  { id: 'fire_stone', name: '熾熱火晶石', icon: '💎🔥', type: 'stone', element: 'fire', desc: '純淨的火元素晶石，用於火焰魔寵的進階進化。' },
  { id: 'ice_stone', name: '永霜冰晶石', icon: '💎❄️', type: 'stone', element: 'ice', desc: '萬年不融的冰寒晶石，用於冰霜魔寵的進階進化。' },
  { id: 'nature_stone', name: '翠玉生靈石', icon: '💎🌿', type: 'stone', element: 'nature', desc: '蘊含大地無盡生機的綠寶石，用於森林魔寵的進階進化。' },
  { id: 'shadow_stone', name: '幽冥暗月石', icon: '💎🌙', type: 'stone', element: 'shadow', desc: '吸納黑夜星芒的深紫寶玉，用於暗影魔寵的進階進化。' },
  { id: 'thunder_stone', name: '雷鳴霆晶石', icon: '💎⚡', type: 'stone', element: 'thunder', desc: '凝結天雷正氣的耀金晶石，用於雷電魔寵的進階進化。' },
  { id: 'light_stone', name: '創世聖光石', icon: '💎✨', type: 'stone', element: 'light', desc: '蘊藏純粹初曦神聖光芒的無瑕晶石，用於聖光魔寵的進階進化。' },
  { id: 'water_stone', name: '深海潮汐石', icon: '💎💧', type: 'stone', element: 'water', desc: '匯聚百川靈脈的碧藍寶石，用於水靈魔寵的進階進化。' }
];

// 🎣 魚種資料庫
export const FISH_TYPES = [
  { id: 'fish_blue', name: '清泉水靈魚', icon: '🐟💧', rarity: '普通', chance: 0.55 },
  { id: 'fish_rainbow', name: '彩虹金鱗魚', icon: '🐟✨', rarity: '稀有', chance: 0.30 },
  { id: 'fish_fire', name: '熾火飛魚', icon: '🐟🔥', rarity: '史詩', chance: 0.15 }
];

// 🍳 烹飪食譜清單
export const COOKING_RECIPES = [
  {
    id: 'dish_grilled_fish',
    name: '香煎彩虹烤魚',
    icon: '🍱',
    ingredients: [{ id: 'fish_rainbow', count: 1 }, { id: 'berry', count: 1 }],
    resultItem: 'dish_grilled_fish',
    desc: '將新鮮彩虹魚佐以幻境漿果香煎，魔寵的最愛大餐！'
  },
  {
    id: 'dish_fruit_pie',
    name: '蘋果香橙金黃派',
    icon: '🥧',
    ingredients: [{ id: 'apple', count: 2 }, { id: 'orange', count: 1 }],
    resultItem: 'dish_fruit_pie',
    desc: '採集果園香甜紅蘋果與蜜柑精心烘焙，香氣撲鼻！'
  },
  {
    id: 'dish_royal_feast',
    name: '幻境海陸全席大餐',
    icon: '🍲',
    ingredients: [{ id: 'fish_rainbow', count: 1 }, { id: 'apple', count: 2 }, { id: 'candy', count: 1 }],
    resultItem: 'dish_royal_feast',
    desc: '傳說級海陸大餐，讓全隊魔寵親密度直接爆棚！'
  }
];

// 🛋️ 我的家 - 溫馨家具清單（需要賺金幣購買）
export const FURNITURE_ITEMS = [
  { id: 'bed_cozy', name: '雲朵雙人暖床', icon: '🛏️', price: 180, bought: false, desc: '躺在上面像睡在雲端一樣柔軟，隨時入睡恢復全部生命活力。' },
  { id: 'pet_pillow', name: '魔寵毛絨暖心窩', icon: '🐾', price: 120, bought: false, desc: '專門給跟隨魔寵打盹休息的柔軟大抱枕，魔寵會開心地窩在裡面！' },
  { id: 'fireplace', name: '紅磚溫暖壁爐', icon: '🔥', price: 260, bought: false, desc: '劈啪作響的古典壁爐，讓整個溫馨小木屋洋溢溫暖火光。' },
  { id: 'magic_bookshelf', name: '星光魔法大書架', icon: '📚', price: 200, bought: false, desc: '擺滿冒險古籍與魔寵圖鑑的華麗橡木書架。' },
  { id: 'sofa_classic', name: '古典天鵝絨沙發', icon: '🛋️', price: 150, bought: false, desc: '冒險歸來與魔寵一起依偎喝茶的舒適沙發。' },
  { id: 'flower_carpet', name: '春日櫻花毛絨地毯', icon: '🌸', price: 90, bought: false, desc: '鋪在客廳地面的櫻花瓣粉嫩厚地毯，踩上去超舒服。' },
  { id: 'music_gramophone', name: '復古黃金留聲機', icon: '📻', price: 320, bought: false, desc: '能夠在屋內播放悠揚奇幻旋律的古董留聲機。' }
];

// 魔寵蛋種類
export const EGG_TYPES = [
  { id: 'egg_fire', name: '赤紅火炎蛋', icon: '🥚🔥', element: 'fire', pool: ['fire_1', 'fire_2'], color: '#ef4444' },
  { id: 'egg_ice', name: '霜藍寒冰蛋', icon: '🥚❄️', element: 'ice', pool: ['ice_1', 'ice_2'], color: '#38bdf8' },
  { id: 'egg_nature', name: '翠綠生靈蛋', icon: '🥚🌿', element: 'nature', pool: ['nature_1', 'nature_2'], color: '#22c55e' },
  { id: 'egg_shadow', name: '暗紫幽月蛋', icon: '🥚🌙', element: 'shadow', pool: ['shadow_1', 'shadow_2'], color: '#a855f7' },
  { id: 'egg_thunder', name: '金芒雷霆蛋', icon: '🥚⚡', element: 'thunder', pool: ['thunder_1', 'thunder_2'], color: '#eab308' },
  { id: 'egg_light', name: '純白聖光蛋', icon: '🥚✨', element: 'light', pool: ['light_1', 'light_2'], color: '#f59e0b' },
  { id: 'egg_water', name: '碧藍水靈蛋', icon: '🥚💧', element: 'water', pool: ['water_1', 'water_2'], color: '#06b6d4' },
  { id: 'egg_rainbow', name: '極彩幻境神獸蛋', icon: '🥚✨', element: 'all', pool: ['fire_3', 'ice_3', 'nature_3', 'shadow_3', 'thunder_3', 'light_3'], color: '#facc15' }
];
