// Character & Story Database for 《魔寵：幻境之旅》

export const CHARACTERS = {
  xingyue: {
    id: 'xingyue',
    name: '星月',
    title: '星辰大魔導師',
    type: '魔法型',
    typeIcon: '🪄',
    color: '#38bdf8',
    bg: 'linear-gradient(135deg, #e0f2fe, #38bdf8)',
    personality: '溫柔、聰明、好奇',
    desc: '擅長使用星光魔法，能夠敏銳感應環境中流動的隱藏魔法能量。從小在星語神殿長大，對世界充滿探索欲。',
    initialSkill: {
      id: 'starlight_magic',
      name: '星光魔法',
      icon: '✨',
      desc: '引導星宿光輝轟擊前方魔物，並能感應並驅散 8 米內隱匿的幻象屏障！'
    },
    portrait: 'assets/character_xingyue.jpg',
    storyTitle: '星月的幻境之蛋',
    storyBg: 'assets/story_xingyue_egg.jpg', // Image 5
    clueName: '神秘魔寵蛋的秘密',
    storyText: [
      '「星月在迷霧森林深處巡查時，意外在一處古老祭壇旁發現了一顆奇異的魔寵蛋。」',
      '「每當她靠近，蛋殼內部便會傳出宛如心跳般微弱而親切的呢喃聲。」',
      '「某天夜晚，璀璨的蔚藍光柱直衝天際，蛋殼突然劇烈綻放強光，孵化出一隻從未在《全大陸魔寵圖鑑》中記載過的神秘生靈。」',
      '「然而最不可思議的是——這隻剛剛降生的奇異魔寵，竟用稚嫩而依戀的眼神凝視著她，開口輕輕喚出了她的名字……」',
      '【隱藏疑問】：為什麼這隻誕生於遠古的魔寵，會知曉星月的名字？'
    ],
    defaultCustom: {
      outfit: 'mage_robe',
      hairStyle: 'long',
      hairColor: '#f1f5f9', // Silver white
      eyeColor: '#38bdf8',  // Azure
      headwear: 'magic_halo'
    }
  },

  yeying: {
    id: 'yeying',
    name: '夜影',
    title: '暗影巡林游俠',
    type: '探索型',
    typeIcon: '🗡️',
    color: '#6366f1',
    bg: 'linear-gradient(135deg, #312e81, #1e1b4b)',
    personality: '冷靜、勇敢、神秘',
    desc: '擅長野外潛行探索與尋找古代遺跡，擁有洞悉隱藏暗道與迷宮暗格的直覺。性格寡言卻極其可靠。',
    initialSkill: {
      id: 'shadow_perception',
      name: '暗影感知',
      icon: '👁️',
      desc: '短暫進入潛行疾走狀態，透視地圖中被遮蔽的秘密洞穴、機關符文與隱藏寶箱！'
    },
    portrait: 'assets/character_yeying.png',
    storyTitle: '夜影的古代日記',
    storyBg: 'assets/story_yeying_diary.jpg', // Image 6
    clueName: '古代日記的秘密',
    storyText: [
      '「夜影在一處崩塌的太古遺跡石室中，發現了一本殘破泛黃的羊皮日記。」',
      '「日記的字跡蒼勁沉重，詳細記載了一場發生於數百年前、幾乎使大陸崩裂的滔天黑霧大災難。」',
      '「然而，當夜影顫抖著翻到日記最後一頁時，赫然看見泛著微光的古老墨跡上，竟清晰地寫著他自己的名字——『夜影』。」',
      '「日記旁的古老石棺上，還沉睡著一隻被黑曜石符文死死鎖住的太古魔寵……」',
      '【隱藏疑問】：數百年前留下記記的神秘人究竟是誰？為何早已知曉他的存在？'
    ],
    defaultCustom: {
      outfit: 'knight_coat',
      hairStyle: 'short',
      hairColor: '#0f172a', // Midnight dark blue
      eyeColor: '#0284c7',  // Deep blue
      headwear: 'none'
    }
  },

  chenxi: {
    id: 'chenxi',
    name: '晨曦',
    title: '翡翠森之精靈',
    type: '輔助型',
    typeIcon: '🌿',
    color: '#22c55e',
    bg: 'linear-gradient(135deg, #dcfce7, #22c55e)',
    personality: '活潑、善良、堅強',
    desc: '擅長治療與呵護魔寵，天生能聆聽所有魔物與花草樹木的情緒共鳴。深得所有魔寵的喜愛。',
    initialSkill: {
      id: 'life_blessing',
      name: '生命祝福',
      icon: '🌸',
      desc: '散發自然聖潔甘霖，驅散侵蝕魔寵的黑霧毒素，並令隊友生命值與親密度大幅增加！'
    },
    portrait: 'assets/character_chenxi.jpg',
    storyTitle: '晨曦的失落魔寵',
    storyBg: 'assets/story_chenxi_pet.png', // Image 7
    clueName: '黑霧的秘密',
    storyText: [
      '「晨曦發現，世代棲息於家鄉森林附近的魔寵們，近期紛紛莫名萎靡並失去了原本純淨的元素力量。」',
      '「她施展生命祝福深入探查，驚駭地察覺這些魔寵的心核深處，都纏繞著一種極為危險的漆黑陰冷濁氣。」',
      '「她決心隻身循著黑霧的蹤跡調查，在巨木禁地最幽深的迷霧中，遇見了一隻口吐古人類語言的遠古守護魔寵。」',
      '「魔寵低沉地開口：『古老的盟約已碎，預言中的晨光少女，妳終於來了……』」',
      '【隱藏疑問】：魔寵為何會通曉只有古代先賢才知道的滅世秘密？'
    ],
    defaultCustom: {
      outfit: 'druid_dress',
      hairStyle: 'long',
      hairColor: '#b45309', // Caramel chestnut
      eyeColor: '#16a34a',  // Emerald green
      headwear: 'flower_crown'
    }
  }
};

// 炎龍火山古代神殿「三位角色相遇」故事合併重大事件劇本
export const STORY_MERGE_EVENT = {
  title: '炎龍神殿：三使者共鳴',
  location: '炎龍火山・古代神殿中央祭壇',
  cgBg: 'assets/story_xingyue_egg.jpg',
  steps: [
    {
      speaker: '旁白',
      avatar: '🏛️',
      text: '第三章的試煉落幕，命運的絲線將三位素未謀面的冒險者，引領到了熱浪翻滾的炎龍火山腹地——一處沉睡萬年的巍峨古代神殿。'
    },
    {
      speaker: '星月',
      avatar: 'assets/character_xingyue.jpg',
      text: '「你們好！你們也是被冥冥中的指引來到這裡的嗎？我懷中的這枚神秘魔寵蛋，一踏入神殿範圍就開始散發前所未有的耀眼微光……」'
    },
    {
      speaker: '夜影',
      avatar: 'assets/character_yeying.png',
      text: '「……我是跟隨遺跡日記上的星盤密碼而來。日記最後一頁記載的『三曜匯聚之地』，指的正是這座神殿的中央星芒圓陣。」'
    },
    {
      speaker: '晨曦',
      avatar: 'assets/character_chenxi.jpg',
      text: '「我追尋森林黑霧的源頭來到火山！那隻會說古代語的長老魔寵告訴我：唯有當蛋、日記與淨化之光同時集齊，黑霧才能被徹底封印！」'
    },
    {
      speaker: '線索共鳴',
      avatar: '✨',
      text: '【三大線索共鳴！】星月的神秘魔寵蛋、夜影的古代日記殘頁、晨曦的黑霧淨化之羽同時升上半空，爆發出七彩虹光！'
    },
    {
      speaker: '古老神祇意志',
      avatar: '🔮',
      text: '「轟隆隆——！」神殿中央的七顆沉睡千年的幻境水晶齊齊劇烈共鳴，一道蒼茫宏偉的遠古聲音在神殿穹頂迴盪：\n\n『三位幻境使者，你們終於來了……』'
    },
    {
      speaker: '古老神祇意志',
      avatar: '🔮',
      text: '『自古代紀元崩裂以來，維繫世界的七顆水晶力量日漸枯竭。命運的輪盤已將你們三人的羁絆重新交織，共同的主線篇章自此揭開！』'
    },
    {
      speaker: '系統提示',
      avatar: '🌟',
      text: '【三條故事正式合併！】星月、夜影與晨曦正式結成「幻境守護使者同盟」！之後三位角色將共同推動主線冒險，您仍然操控當前所選角色！'
    }
  ]
};

// 時裝庫設定 (1:1 參考圖片四 時裝衣櫥)
export const WARDROBE_ITEMS = {
  outfits: [
    { id: 'red_cape', name: '紅色披風服裝', icon: '🧥', color: '#dc2626', desc: '經典紅色兜帽披風與純白圍裙，充滿童話冒險氣息。' },
    { id: 'knight_coat', name: '初級騎士團服裝', icon: '🥋', color: '#1e293b', desc: '威風凜凜的騎士團金邊長風衣，兼具防禦與靈動。' },
    { id: 'adventurer', name: '冒險家服裝', icon: '🦺', color: '#9a3412', desc: '結實耐磨的帆布皮革探險套裝，口袋眾多方便收納素材。' },
    { id: 'classic_dress', name: '古典樣式服裝', icon: '👗', color: '#475569', desc: '優雅精緻的宮廷禮服剪裁，胸前帶有精緻的翡翠寶石領結。' },
    { id: 'wolf_suit', name: '野狼獵裝服裝', icon: '🐺', color: '#4b5563', desc: '以雪原絨毛邊緣裝飾的保暖獵裝，防風禦寒性能極佳。' },
    { id: 'mage_robe', name: '星月聖潔法袍', icon: '✨', color: '#38bdf8', desc: '星語神殿傳承的純白金紋祭司袍，周身縈繞微光。' },
    { id: 'druid_dress', name: '森之仙靈連衣裙', icon: '🌿', color: '#22c55e', desc: '以林中藤蔓與精靈絲織就的淡綠長裙，散發自然清香。' }
  ],
  hairStyles: [
    { id: 'long', name: '優雅飄逸長髮', icon: '💇‍♀️', desc: '如瀑布般披散在身後的柔順長髮。' },
    { id: 'short', name: '俐落冒險短髮', icon: '💇‍♂️', desc: '便於在灌木林穿梭的清爽短髮。' },
    { id: 'twintail', name: '元氣雙馬尾', icon: '🎀', desc: '青春活力的動漫雙馬尾造型。' },
    { id: 'braids', name: '精緻麻花雙辮', icon: '👧', desc: '富有田園文藝氣息的編髮造型。' },
    { id: 'straight', name: '及腰如墨直髮', icon: '👩', desc: '典雅秀麗的直長髮。' }
  ],
  hairColors: [
    { name: '銀月純白', color: '#f1f5f9' },
    { name: '暗夜星藍', color: '#0f172a' },
    { name: '亞麻淺棕', color: '#b45309' },
    { name: '櫻花淡粉', color: '#f472b6' },
    { name: '極夜曜黑', color: '#18181b' },
    { name: '翡翠森綠', color: '#15803d' },
    { name: '暮光紫霞', color: '#7e22ce' },
    { name: '烈陽金橙', color: '#ea580c' }
  ],
  eyeColors: [
    { name: '星空天藍', color: '#38bdf8' },
    { name: '深邃海藍', color: '#0284c7' },
    { name: '翡翠碧綠', color: '#16a34a' },
    { name: '紫晶魅影', color: '#a855f7' },
    { name: '琥珀暖金', color: '#f59e0b' },
    { name: '赤紅烈焰', color: '#ef4444' }
  ],
  headwears: [
    { id: 'magic_halo', name: '星光魔導光環', icon: '💫' },
    { id: 'flower_crown', name: '森林花之桂冠', icon: '🌸' },
    { id: 'ribbon_bow', name: '朱紅絲帶蝴蝶結', icon: '🎀' },
    { id: 'adventurer_hat', name: '探險羽毛軟帽', icon: '🤠' },
    { id: 'none', name: '不配戴頭飾', icon: '🚫' }
  ]
};

// 完整遊戲主線劇情架構 (序章 + 第一至第七章 共 8 大階段)
export const MAIN_QUESTS = [
  {
    id: 'quest_0',
    chapter: '序章',
    title: '選擇角色與獲得第一隻魔寵',
    desc: '在幻境選擇之門確認命運之選，閱讀各自的專屬序章奇遇，獲得第一隻本命魔寵同行。',
    target: { type: 'starter' },
    reward: { exp: 100, coins: 50, item: 'berry', count: 5 },
    dialog: '「踏出命運之門，奇幻的魔寵世界正等待著你的足跡！」'
  },
  {
    id: 'quest_1',
    chapter: '第一章',
    title: '各自的神秘事件',
    desc: '調查最初的謎團：星月的發光魔寵蛋、夜影的古代日記殘卷，或晨曦受黑霧侵蝕的家鄉魔寵。',
    target: { type: 'gather', item: 'berry', count: 3 },
    reward: { exp: 200, coins: 80, item: 'nature_stone', count: 1 },
    dialog: '「平靜的世界深處，正傳來陣陣令人不安的異動與心跳……」'
  },
  {
    id: 'quest_2',
    chapter: '第二章',
    title: '尋找第一顆幻境水晶',
    desc: '前往永凍冰原與迷霧森林交界，喚醒沉睡於遠古冰封神柱中的第一顆【純淨水月水晶】。',
    target: { type: 'zone', zoneId: 'tundra' },
    reward: { exp: 350, coins: 150, item: 'ice_stone', count: 2 },
    dialog: '「水晶在低語，它在呼喚著能夠理解魔寵心聲的使者。」'
  },
  {
    id: 'quest_3',
    chapter: '第三章',
    title: '三位角色相遇（故事合併）',
    desc: '前往炎龍火山附近的遠古神殿！三位使者各自帶著魔寵蛋、日記與黑霧線索在此相遇，共同開啟主線合併！',
    target: { type: 'zone', zoneId: 'volcano' },
    reward: { exp: 600, coins: 300, item: 'fire_stone', count: 3 },
    dialog: '「當三條命運之線在神殿交織，七顆水晶同時綻放出耀眼的天光！」',
    triggerMergeCutscene: true
  },
  {
    id: 'quest_4',
    chapter: '第四章',
    title: '七顆水晶的秘密',
    desc: '走訪各大陸板塊，調查七顆守護水晶（火、冰、風、雷、水、光、暗）失去生機與力量衰竭的真正原因。',
    target: { type: 'battle', count: 1 },
    reward: { exp: 750, coins: 350, item: 'shadow_stone', count: 2 },
    dialog: '「水晶並未毀壞，而是其中的本源魔力被一股漆黑的力場所隔絕！」'
  },
  {
    id: 'quest_5',
    chapter: '第五章',
    title: '古代文明與魔寵起源',
    desc: '解開暗月遺跡的遠古石碑文字，探索萬年前第七紀元高等文明與原始神獸簽署的古老共生契約。',
    target: { type: 'zone', zoneId: 'ruins' },
    reward: { exp: 900, coins: 450, item: 'egg_nature', count: 1 },
    dialog: '「魔寵不是野獸，牠們是古代文明靈魂與大自然精靈的共生化身。」'
  },
  {
    id: 'quest_6',
    chapter: '第六章',
    title: '黑霧背後的真相',
    desc: '深入瀰漫大陸的黑霧源頭，擊退被黑霧污染的狂暴首領，查明黑霧乃是遠古封印破損洩漏之物。',
    target: { type: 'battle', count: 2 },
    reward: { exp: 1200, coins: 600, item: 'egg_ice', count: 1 },
    dialog: '「黑霧並非天災，而是人類自私抽取水晶核心時留下的心魔殘渣！」'
  },
  {
    id: 'quest_7',
    chapter: '第七章',
    title: '幻境核心與最終秘密',
    desc: '攜手另外兩位使者，將七顆水晶注入純淨心靈力量，喚醒世界源初母樹與創世神寵，迎來新生輪迴！',
    target: { type: 'zone', zoneId: 'ruins' },
    reward: { exp: 2000, coins: 1500, item: 'egg_fire', count: 1 },
    dialog: '「三位幻境使者攜手而立，幻境大陸的永夜消散，黎明的第一縷陽光普照大地！」'
  }
];

// 五大隱藏秘密系統 (5 Secret Categories)
export const SECRET_ARCHIVES = [
  {
    id: 'sec_pet',
    category: '魔寵秘密',
    icon: '🐾',
    title: '特殊魔寵的過去',
    desc: '特殊魔寵（如星月孵化的異獸、夜影解印的古魔寵、晨曦遇見的說話長老）乃是創世神祇的七大元祖隨從，各自背負著一段守護世界的古老記憶。',
    clue: '在各區域與同行魔寵親密度提升至 80 以上，觸發深層心靈記憶。',
    unlocked: false
  },
  {
    id: 'sec_ancient',
    category: '古代秘密',
    icon: '🏛️',
    title: '消失的古代文明',
    desc: '在現今四大板塊之上，曾存在高度發達的第七紀元魔法文明。他們掌握著水晶共鳴科技，卻因過度渴求力量導致封印崩解，城市墜落為如今的暗月遺跡。',
    clue: '解開四大地圖中央的遠古元素符文石碑，拼湊完整古代石板。',
    unlocked: false
  },
  {
    id: 'sec_character',
    category: '角色秘密',
    icon: '👤',
    title: '每個角色不為人知的故事',
    desc: '星月曾是古代祭司血脈的唯一繼承人；夜影是當年封印日記撰寫者的直系後代；晨曦則體內流淌著始祖精靈的療癒甘泉。三人的相遇絕非偶然！',
    clue: '完成三位角色的序章閱讀，並在第三章炎龍神殿合併故事後解開。',
    unlocked: false
  },
  {
    id: 'sec_map',
    category: '地圖秘密',
    icon: '🗺️',
    title: '隱藏區域和地下世界',
    desc: '四大地圖的地底互通，隱藏著蜿蜒數十里的「深淵晶洞地下迷宮」。深處棲息著稀有野怪、未孵化的神獸蛋巢與永不熄滅的元素靈泉。',
    clue: '自由探索世界邊緣與未知洞穴，破解隱蔽岩壁機關。',
    unlocked: false
  },
  {
    id: 'sec_ending',
    category: '結局秘密',
    icon: '🗝️',
    title: '達成特殊條件解鎖的真結局',
    desc: '除了一般擊退黑霧結局外，若玩家同時收集齊四大屬性究極體魔寵、解開所有石碑並保持魔寵 100 滿親密度，將觸發隱藏的【萬物共鳴・新紀元誕生】真結局！',
    clue: '在第七章終戰前達成全圖鑑收集與全部秘密解鎖！',
    unlocked: false
  }
];

// 自由探索指南功能清單
export const FREE_ROAM_FEATURES = [
  { icon: '🗺️', title: '探索已經開放的地圖', desc: '自由漫步於迷霧森林、永凍冰原、炎龍火山與暗月遺跡，無時間與路線限制。' },
  { icon: '🦊', title: '找尋隱藏魔寵與稀有蛋', desc: '在隱密灌木林與岩石背後尋覓野外魔寵蛋窩，帶回孵化室培育稀有夥伴。' },
  { icon: '📜', title: '解鎖支線劇情與石碑', desc: '破譯散落各地的遠古元素符文石碑，聆聽古老文明留在風中的低語。' },
  { icon: '⚔️', title: '挑戰特殊野生魔物', desc: '在野外與遊蕩的魔物交鋒，運用 1.5 倍元素屬性克制奪取豐富經驗與晶石。' },
  { icon: '🍓', title: '收集稀有物品與果實', desc: '採集幻境彩虹漿果餵養魔寵，挖掘元素進化石助魔寵突破至完全體與究極體！' },
  { icon: '🕳️', title: '探索地下迷宮與神殿', desc: '穿梭於火山熔岩神殿與冰封地穴，發掘失落寶箱與古代科技遺跡。' },
  { icon: '👤', title: '發現角色專屬秘密', desc: '在冒險中發掘三位主角的宿命過往，揭開他們彼此交織千年的深沉羈絆。' }
];
