import { Character, Sticker, GameLevel, PetTemplate, GardenItem } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'panda',
    name: '熊猫胖胖',
    avatar: '🐼',
    color: 'from-slate-100 to-slate-200 border-slate-300 text-slate-800',
    intro: '友好又沉稳，特别守纪律，会陪你一起演练小学生活习惯！'
  },
  {
    id: 'rabbit',
    name: '兔子聪聪',
    avatar: '🐰',
    color: 'from-pink-100 to-pink-200 border-pink-300 text-pink-700',
    intro: '思维逻辑敏捷，特别爱数数，和你一起解开有趣的数学谜题！'
  },
  {
    id: 'lion',
    name: '狮子麦克斯',
    avatar: '🦁',
    color: 'from-amber-100 to-amber-200 border-amber-300 text-amber-700',
    intro: '勇敢又自信，嗓门特别亮，会带你朗读声母、韵母、拼音大作战！'
  },
  {
    id: 'owl',
    name: '猫头鹰奥力',
    avatar: '🦉',
    color: 'from-purple-100 to-purple-200 border-purple-300 text-purple-700',
    intro: '博学多才，喜欢观察规律，带你在逻辑迷宫里发现奇妙的关联！'
  }
];

export const STICKERS: Sticker[] = [
  {
    id: 'first_step',
    title: '启航快乐星',
    icon: '✨',
    color: 'bg-yellow-100 text-yellow-600 border-yellow-300',
    description: '欢迎开始幼小衔接奇妙冒险！加油哦！',
    category: 'general'
  },
  {
    id: 'pinyin_master',
    title: '拼音大达人',
    icon: '🔤',
    color: 'bg-indigo-100 text-indigo-600 border-indigo-300',
    description: '完全掌握声母、韵母组合与字词拼读拼音大冒险！',
    category: 'pinyin'
  },
  {
    id: 'math_genius',
    title: '数学小神童',
    icon: '🔢',
    color: 'bg-green-100 text-green-600 border-green-300',
    description: '速算达人！精通10以内加减法、大小比较与认识时钟。',
    category: 'math'
  },
  {
    id: 'logic_expert',
    title: '逻辑智慧星',
    icon: '🧩',
    color: 'bg-pink-100 text-pink-600 border-pink-300',
    description: '图形推理大师！能够迅速发现物体的分类和排列规律！',
    category: 'logic'
  },
  {
    id: 'school_star',
    title: '小学准备生',
    icon: '🎒',
    color: 'bg-amber-100 text-amber-600 border-amber-300',
    description: '准备就绪！学会整理好书包，记住神圣的小学课堂规则。',
    category: 'school-life'
  },
  {
    id: 'perfect_score',
    title: '全能大玩家',
    icon: '🏆',
    color: 'bg-red-100 text-red-600 border-red-300',
    description: '太厉害啦！收集积分超过 100 分，你已经是一名合格的小学生啦！',
    category: 'general'
  }
];

export const GAME_LEVELS: GameLevel[] = [
  // Category 1: Pinyin
  {
    id: 'pinyin_initials',
    title: '声母与韵母派对',
    category: 'pinyin',
    description: '帮助大狮子区分哪些是声母「b, p, m, f」，哪些是韵母「a, o, e」吧！',
    starsRequired: 0,
    pointsReward: 20
  },
  {
    id: 'pinyin_chars',
    title: '词语拼读连连看',
    category: 'pinyin',
    description: '看拼音，认汉字！找到拼音「shū, mā, nǐ」对应的字。',
    starsRequired: 0,
    pointsReward: 25
  },
  // Category 2: Math
  {
    id: 'math_addition',
    title: '水果算术游乐园',
    category: 'math',
    description: '数一数树上有几个红苹果加两个青苹果，练习10以内的超有趣算术！',
    starsRequired: 0,
    pointsReward: 20
  },
  {
    id: 'math_clock',
    title: '神奇时钟小管家',
    category: 'math',
    description: '小学的作息很规律噢！学着看懂数字时钟，认识早上起床与上课的时间。',
    starsRequired: 0,
    pointsReward: 25
  },
  // Category 3: Logic
  {
    id: 'logic_patterns',
    title: '图形找规律',
    category: 'logic',
    description: '根据「圆形、三角形、方形」的重复出现规律，猜猜下一个形状是什么。',
    starsRequired: 0,
    pointsReward: 20
  },
  {
    id: 'logic_sorting',
    title: '超市垃圾分类与收纳',
    category: 'logic',
    description: '将乱七八糟的水果、铅笔学具和动物玩具，分类放回各自的箱子里！',
    starsRequired: 0,
    pointsReward: 25
  },
  // Category 4: School Life
  {
    id: 'school_pack_bag',
    title: '背上小书包',
    category: 'school-life',
    description: '第一天上小学！把上课「有用」的学具装进书包，把「无关」的零食和玩具留在房间。',
    starsRequired: 0,
    pointsReward: 30
  },
  {
    id: 'school_behavior',
    title: '课堂礼仪小判官',
    category: 'school-life',
    description: '在小学的课堂上该怎么做呢？我们来帮亮晶晶的红领巾判断正确与错误的行为吧！',
    starsRequired: 0,
    pointsReward: 30
  }
];

export const GARDEN_ITEMS: GardenItem[] = [
  { id: 'flowerbed', name: '🌸 动物花坛', icon: '🌸', cost: 1, description: '开满红粉黄蓝太阳花的大花坛，散发阵阵清香，吸引着可爱的小蜜蜂和小蝴蝶！', unlockedLevelMsg: '动物小花坛落成啦！蝴蝶飞来飞去！' },
  { id: 'slide', name: '🌈 彩虹大滑梯', icon: '🛝', cost: 2, description: '弯弯曲曲的三彩滑道，顺着彩虹刺溜一下落到软绵绵的绿草地上！', unlockedLevelMsg: '彩虹大滑梯滑梯安装完工！' },
  { id: 'carousel', name: '🎠 音乐旋转木马', icon: '🎠', cost: 3, description: '伴随着清脆悦耳的木琴音乐，小胖和聪聪可以骑上小白马、小金鹿转啊转！', unlockedLevelMsg: '漂亮的华丽旋转木马通电转动啦！' },
  { id: 'fountain', name: '⛲ 唱歌音乐喷泉', icon: '⛲', cost: 3, description: '会跳舞的水柱，到了阳光下能照出一道亮闪闪的小彩虹，凉爽又美丽！', unlockedLevelMsg: '音乐喷泉哗啦啦，亮出了双彩虹！' },
  { id: 'tent', name: '🎪 小动物游戏帐篷', icon: '🎪', cost: 2, description: '红白相间的魔法条纹大帐篷，里面塞满了松软的海洋球和有趣的拼图！', unlockedLevelMsg: '魔法游戏大帐篷支起来了，快钻进来玩！' },
  { id: 'balloon', name: '🎈 炫彩气球拱门', icon: '🎈', cost: 1, description: '充满节日仪式感的小学迎新门，五彩气球在微风下轻轻晃动！', unlockedLevelMsg: '炫彩气球彩虹拱门做好了，真气派！' },
  { id: 'pet_house', name: '🐈 萌宠爱心树屋', icon: '🏡', cost: 2, description: '在大樟树下搭一个温暖舒适的小木屋，专门给流浪的小猫大橘提供小鱼干！', unlockedLevelMsg: '流浪猫木船小屋搭建成功！小猫叫喵喵！' },
  { id: 'castle', name: '🏰 梦幻积木大城堡', icon: '🏰', cost: 5, description: '终极巨型梦幻建筑！五彩缤纷的大环保海绵积木筑成的游乐城堡，孩子们能跑能藏！', unlockedLevelMsg: '超级梦幻泡泡积木城堡落成啦！万岁！' }
];

export const PET_TEMPLATES: PetTemplate[] = [
  {
    id: 'linux_penguin',
    name: '极客企鹅 Tux-Pro',
    emoji: '🐧',
    intro: '苹果设计团队倾力雕琢的极简防寒 Linux Tux 企鹅。身穿哑光钛金属太空衣，佩戴高科技 Apple Vision Pro，能在一秒内用 Bash 命令清理所有 Bug！',
    color: 'from-slate-900 to-slate-800 border-slate-700 text-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.22)]',
    favoriteFoodName: '降噪无线大苹果',
    favoriteFoodEmoji: '🍎',
    favGreeting: 'sudo apt-get install happiness! 启动！哇，多谢小主人送来香脆可口的顶级无线苹果，我的电量已完全拉满！'
  },
  {
    id: 'cyber_dog',
    name: '赛博狗 iDog-M5',
    emoji: '🤖',
    intro: '太空铝合金一体成型的智能赛博金犬。内部搭载超高主频 Linux 实时神经元系统，爱摇尾巴，最心仪雷电5代接口的高速能量能量棒！',
    color: 'from-zinc-100 to-stone-200 border-zinc-300 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
    favoriteFoodName: '雷电能量高压棒',
    favoriteFoodEmoji: '⚡',
    favGreeting: '[System Active] 尾巴加速摆动 300%！哔哔！香喷喷的雷电能量瞬间注入，我感觉我的 CPU 计算速度又提升了 10 万倍！'
  },
  {
    id: 'terminal_cat',
    name: '黑客萌猫 Bash-Cat',
    emoji: '🐱‍💻',
    intro: '坐在极简悬浮铝合金支架上的黑客小猫。戴着阳极氧化铝限定降噪耳机，专长是在苹果终端上流畅编译 Linux 内核。偶尔抓蝴蝶。',
    color: 'from-purple-950 to-indigo-900 border-indigo-700 text-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.3)]',
    favoriteFoodName: '深海数字小鱼干',
    favoriteFoodEmoji: '🐟',
    favGreeting: 'Nyan! git commit -m "delicious"! 嚼着脆脆的数字小鱼干，我的尾巴都开始跟着贝斯节奏摇摆啦，爱你哦小主人！'
  },
  {
    id: 'swift_unicorn',
    name: '太空独角兽 Swift-Unix',
    emoji: '🦄',
    intro: '全透彩色钛金属外壳打造的太空独角兽。它的蹄子跑过的地方会抛出耀眼的 Linux 极光流粉，机身充满了划时代的 Apple 式圆润美感。',
    color: 'from-pink-50 to-violet-100 border-violet-200 text-violet-800 shadow-[0_8px_30px_rgb(0,0,0,0.1)]',
    favoriteFoodName: '极光渐变棉花糖',
    favoriteFoodEmoji: '🍭',
    favGreeting: '咻！恭喜解锁超级多彩流星！极光棉花糖太好吃了，多跑一万米也不喘气，感觉自己正在向着 60 级巅峰快乐迈进！'
  },
  {
    id: 'carbon_panda',
    name: '碳纤维大熊猫 Pod',
    emoji: '🐼',
    intro: '采用极致轻量化全碳纤维编织的环保大熊猫。坐在一把极简包豪斯白橡木椅上，时刻帮小主人监控着后台的星际快乐服务器！',
    color: 'from-stone-900 to-zinc-950 border-stone-800 text-white shadow-[0_8px_30px_rgb(0,0,0,0.25)]',
    favoriteFoodName: '多汁开源翠竹笋',
    favoriteFoodEmoji: '🎋',
    favGreeting: '呜姆唔姆~ 绿色有机无公害的开源鲜嫩竹太好啃啦！谢谢小主人！今天你有认真背单词嘛？我的后台都记录着你优秀的数据哟！'
  },
  {
    id: 'dino_kernel',
    name: '恐龙核心 Sparky',
    emoji: '🦖',
    intro: '运行在精简 Linux 内核驱动程序上的极光霓虹绿霸王龙。它的每一次笑声都会向全屏抛洒大把的闪光能量颗粒，极具解压感！',
    color: 'from-emerald-950 to-teal-900 border-teal-800 text-teal-100 shadow-[0_8px_30px_rgb(0,0,0,0.25)]',
    favoriteFoodName: '发光红星爆汁莓',
    favoriteFoodEmoji: '🍓',
    favGreeting: '吼~ 嗷呜！这个爆汁野草莓多汁又爽口！我要把体内的“黄金金币池”全部喷射出来作为我们的通关奖励！准备接金币吧！'
  }
];
