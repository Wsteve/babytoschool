import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoundManager } from '../utils/SoundManager';
import { HelpCircle, Sparkles, AlertCircle, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface SchoolLifeGameProps {
  levelId: string;
  onComplete: (points: number, levelId: string) => void;
  onBack: () => void;
}

// Level 1: Pack School Bag
interface PackableItem {
  id: string;
  name: string;
  icon: string;
  shouldPack: boolean; // true = put in bag, false = leave in room
  reason: string;
}

const PACKABLE_ITEMS: PackableItem[] = [
  { id: '1', name: '数学与语文书', icon: '📕', shouldPack: true, reason: '课本是学习知识不可缺少的好工具！' },
  { id: '2', name: '铅笔盒学具', icon: '✏️', shouldPack: true, reason: '写字、画图离不开铅笔和尺子哦。' },
  { id: '3', name: '掌上游戏机', icon: '🎮', shouldPack: false, reason: '游戏机会分散上课注意力，不可以带进学校哦。' },
  { id: '4', name: '美味甜糖果', icon: '🍬', shouldPack: false, reason: '学校里我们有健康的午餐，糖果零食留在家里吃。' },
  { id: '5', name: '健康小水杯', icon: '🥤', shouldPack: true, reason: '上课运动完多喝白开水，身体才会棒棒的！' },
  { id: '6', name: '玩具恐龙玩具', icon: '🦖', shouldPack: false, reason: '上学是学知识的时间，玩具朋友在家里等我们放学。' },
  { id: '7', name: '干净手帕纸巾', icon: '🧻', shouldPack: true, reason: '讲究个人卫生，饭前便后擦擦手。' },
  { id: '8', name: '超级大薯片', icon: '🥔', shouldPack: false, reason: '澎化食品不利于上课消化，咱们留在家里周末吃。' },
];

// Level 2: Classroom Etiquette
interface BehaviourQuestion {
  id: number;
  scenario: string;
  isGood: boolean; // true = Correct/Good etiquette, false = Incorrect
  positiveFeedback: string;
  negativeFeedback: string;
}

const BEHAVIOUR_QUESTIONS: BehaviourQuestion[] = [
  {
    id: 1,
    scenario: '小明在课堂上听到老师提问，特别想回答，他赶紧「先高高地举起右手」，等到老师微笑点了他的名字，才站起来自信大声地回答问题。',
    isGood: true,
    positiveFeedback: '做得太对啦！举手提问、点名回答，是尊重老师、守纪律的优秀表现！',
    negativeFeedback: '不对噢。如果每个人都直接喊出答案，教室就会像菜市场一样乱糟糟的了。'
  },
  {
    id: 2,
    scenario: '下课铃一响，小美迫不及待地跑出去。她把铅笔、橡皮和课本大剌剌地「乱堆在桌子上」就冲出教室。',
    isGood: false,
    positiveFeedback: '不对噢，下次上课可能会找不到东西。下课要先把本子笔收进书包，备好下一节课，再去玩。',
    negativeFeedback: '哈哈，小美太粗心啦。正确的做法是把这一课的学具收好，摆出下一节课的书本，再有序出去散步玩乐。'
  },
  {
    id: 3,
    scenario: '国歌声奏响，学校举行神圣的升旗仪式。小刚不管不顾，扭过头和同桌大声聊起了昨天的连环画，还笑出了声音。',
    isGood: false,
    positiveFeedback: '很不应该哦。升国旗是极其严肃崇高的，少先队员应该脱帽、立正，行注目礼或敬队礼。',
    negativeFeedback: '对啊，升旗唱国歌时一定要肃立注目、精神饱满，这代表我们对祖国妈妈的热爱！'
  },
  {
    id: 4,
    scenario: '自习课上，小乐把自己的画笔主重地「借给」了忘记带画笔的同桌，并且轻声嘱咐同桌「用完再悄悄还回来」，没有大喊大叫打扰其他人。',
    isGood: true,
    positiveFeedback: '好有爱、好体贴的行为！不仅热心帮助同学，还很注意保持安静不打扰其他正在专心看书的人！',
    negativeFeedback: '不妥哦。同伴互助非常好，但必须小声交流，否则就会破坏安静的学习氛围。'
  }
];

export default function SchoolLifeGame({ levelId, onComplete, onBack }: SchoolLifeGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentBehaviourIndex, setCurrentBehaviourIndex] = useState(0);
  const [behaviourFeedback, setBehaviourFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Level 1 state
  const [bagItems, setBagItems] = useState<PackableItem[]>([]);
  const [roomItems, setRoomItems] = useState<PackableItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PackableItem | null>(null);
  const [backpackFeedbacks, setBackpackFeedbacks] = useState<string>('');
  const [backpackLogs, setBackpackLogs] = useState<Record<string, 'bag' | 'room'>>({});

  const startLevel = () => {
    SoundManager.playClick();
    setGameState('playing');
    if (levelId === 'school_pack_bag') {
      const randomized = [...PACKABLE_ITEMS].sort(() => Math.random() - 0.5);
      setBagItems([]);
      setRoomItems([]);
      setSelectedItem(null);
      setBackpackFeedbacks('点击这些物品，帮我们决定把它们「装进书包」还是「留在房间」吧！');
      setBackpackLogs({});
    } else {
      setCurrentBehaviourIndex(0);
      setBehaviourFeedback(null);
    }
  };

  const handlePackDecision = (destination: 'bag' | 'room') => {
    if (!selectedItem) return;

    const isCorrect = (destination === 'bag' && selectedItem.shouldPack) ||
                      (destination === 'room' && !selectedItem.shouldPack);

    if (isCorrect) {
      SoundManager.playCorrect();
      setBackpackFeedbacks(`👍 决策正确！${selectedItem.reason}`);
      setBackpackLogs((prev) => ({ ...prev, [selectedItem.id]: destination }));
      
      if (destination === 'bag') {
        setBagItems((prev) => [...prev, selectedItem]);
      } else {
        setRoomItems((prev) => [...prev, selectedItem]);
      }
      setSelectedItem(null);

      // Check win
      const processedCount = Object.keys(backpackLogs).length + 1;
      if (processedCount === PACKABLE_ITEMS.length) {
        setTimeout(() => {
          setGameState('completed');
          SoundManager.playFanfare();
        }, 1500);
      }
    } else {
      SoundManager.playIncorrect();
      setBackpackFeedbacks(`❌ 哎呀，不妥哦！${selectedItem.reason}`);
    }
  };

  // Level 2 handle Etiquette
  const handleEtiquetteDecision = (choice: boolean) => {
    if (behaviourFeedback) return;
    const currentQ = BEHAVIOUR_QUESTIONS[currentBehaviourIndex];

    if (choice === currentQ.isGood) {
      setBehaviourFeedback('correct');
      SoundManager.playCorrect();
    } else {
      setBehaviourFeedback('incorrect');
      SoundManager.playIncorrect();
    }

    setTimeout(() => {
      setBehaviourFeedback(null);
      if (currentBehaviourIndex < BEHAVIOUR_QUESTIONS.length - 1) {
        setCurrentBehaviourIndex((prev) => prev + 1);
      } else {
        setGameState('completed');
        SoundManager.playFanfare();
      }
    }, 3800); // Give plenty of time to read explanation!
  };

  const currentBehaviorQ = BEHAVIOUR_QUESTIONS[currentBehaviourIndex];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-[75vh] flex flex-col justify-between" id="school-game-container">
      {/* Return button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 font-bold font-sans text-sm cursor-pointer transition-colors"
          id="school-back-lobby-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回智力成长大厅</span>
        </button>
      </div>

      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-amber-200 rounded-3xl p-6 md:p-10 text-center shadow-xl flex-1 flex flex-col items-center justify-center my-auto"
          id="school-intro-card"
        >
          <span className="text-6xl md:text-7xl mb-4 select-none">🐼</span>
          <h2 className="text-2xl md:text-3xl font-black text-amber-600 tracking-tight font-sans">
            小学新生活：{levelId === 'school_pack_bag' ? '整理背上小书包' : '课堂礼仪大裁判'}
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-3 max-w-lg mx-auto leading-relaxed font-sans font-medium">
            {levelId === 'school_pack_bag'
              ? '第一天去小学报到啦！小朋友要学会自己背本子和水壶，还要知道什么该带，什么该留。让我们跟着熊猫胖胖一起来模拟理书包吧！'
              : '小学的课堂庄严神圣，我们有很多与幼儿园不一样的课堂文明和社交方式哦。来当一回行为礼仪小法官，判断谁的行为最棒！'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startLevel}
            className="mt-8 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-sans font-black text-xl rounded-full shadow-lg cursor-pointer"
            id="school-start-btn"
          >
            🏫 出发模拟一年级生活！
          </motion.button>
        </motion.div>
      )}

      {/* Playing States */}
      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col items-center justify-center my-auto w-full">
          {levelId === 'school_pack_bag' ? (
            /* Level 1: Pack Bag Organizer Game */
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Left Column: Room Desktop (Leaved items) */}
              <div className="bg-orange-50/40 border-2 border-orange-200 rounded-2xl p-4 flex flex-col h-full min-h-[160px]">
                <h3 className="text-center text-xs font-bold font-sans text-orange-850 mb-3 bg-orange-100 py-1 rounded-full">
                  🏠 留在房间学习桌上
                </h3>
                <div className="flex flex-wrap gap-2 justify-center content-start flex-1 p-2" id="room-items-container">
                  {roomItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white px-2.5 py-1.5 rounded-xl border border-orange-200 flex items-center gap-1.5 text-xs font-sans filter shadow-sm select-none"
                    >
                      <span>{item.icon}</span>
                      <span className="text-slate-600 font-bold">{item.name}</span>
                    </div>
                  ))}
                  {roomItems.length === 0 && (
                    <span className="text-xs text-slate-300 font-sans my-auto py-6">（这里空空的哦）</span>
                  )}
                </div>
              </div>

              {/* Center Column: Interactive Deck */}
              <div className="flex flex-col items-center justify-between p-2 flex-1">
                {/* Backpack Feedbacks Message */}
                <div className="w-full text-center bg-teal-50/50 p-2.5 rounded-xl border border-teal-100 text-xs font-sans text-teal-800 leading-tight">
                  {backpackFeedbacks}
                </div>

                {/* Desk of items wait matching */}
                <div className="my-5 flex flex-wrap gap-2 justify-center max-w-sm">
                  {PACKABLE_ITEMS.map((item) => {
                    const isProcessed = backpackLogs[item.id] !== undefined;
                    const isSelected = selectedItem?.id === item.id;

                    if (isProcessed) return null;

                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          SoundManager.playClick();
                          setSelectedItem(item);
                        }}
                        className={`px-3 py-2 rounded-xl border-2 text-xs font-sans font-bold shadow-sm transition-all cursor-pointer bg-white flex items-center gap-1 ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-300'
                            : 'border-slate-200 hover:border-teal-300'
                        }`}
                        id={`backpack-drag-${item.id}`}
                      >
                        <span className="text-2xl select-none leading-none">{item.icon}</span>
                        <span>{item.name}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Bag Decision Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  <motion.button
                    whileHover={selectedItem ? { scale: 1.04 } : {}}
                    whileTap={selectedItem ? { scale: 0.96 } : {}}
                    disabled={!selectedItem}
                    onClick={() => handlePackDecision('bag')}
                    className={`py-3 px-3 rounded-2xl border-2 font-sans font-extrabold text-xs text-center flex flex-col items-center justify-center cursor-pointer ${
                      selectedItem
                        ? 'bg-gradient-to-r from-teal-400 to-teal-500 border-teal-600 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-300'
                    }`}
                    id="backpack-dest-bag"
                  >
                    🎒 放进学校书包
                    <span className="text-[10px] opacity-80 font-normal mt-0.5">（上课必用学具）</span>
                  </motion.button>

                  <motion.button
                    whileHover={selectedItem ? { scale: 1.04 } : {}}
                    whileTap={selectedItem ? { scale: 0.96 } : {}}
                    disabled={!selectedItem}
                    onClick={() => handlePackDecision('room')}
                    className={`py-3 px-3 rounded-2xl border-2 font-sans font-extrabold text-xs text-center flex flex-col items-center justify-center cursor-pointer ${
                      selectedItem
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 border-orange-600 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-300'
                    }`}
                    id="backpack-dest-room"
                  >
                    🏠 留在房间桌上
                    <span className="text-[10px] opacity-80 font-normal mt-0.5">（放学后再放松）</span>
                  </motion.button>
                </div>
              </div>

              {/* Right Column: School Backpack */}
              <div className="bg-teal-50/40 border-2 border-teal-200 rounded-2xl p-4 flex flex-col h-full min-h-[160px]">
                <h3 className="text-center text-xs font-bold font-sans text-teal-800 mb-3 bg-teal-100 py-1 rounded-full">
                  🎒 我的高高兴兴小书包
                </h3>
                <div className="flex flex-wrap gap-2 justify-center content-start flex-1 p-2" id="bag-items-container">
                  {bagItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white px-2.5 py-1.5 rounded-xl border border-teal-200 flex items-center gap-1.5 text-xs font-sans filter shadow-sm select-none"
                    >
                      <span>{item.icon}</span>
                      <span className="text-slate-600 font-bold">{item.name}</span>
                    </div>
                  ))}
                  {bagItems.length === 0 && (
                    <span className="text-xs text-slate-300 font-sans my-auto py-6">（书包装备中...）</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Level 2: Classroom Etiquette Quiz judge */
            <div className="w-full max-w-lg">
              <div className="text-sm font-bold text-slate-400 font-sans mb-3 text-center">
                法官判断进度: {currentBehaviourIndex + 1} / {BEHAVIOUR_QUESTIONS.length}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBehaviourIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border-3 border-amber-100 rounded-2xl p-6 shadow-md relative text-center"
                  id={`school-etiquette-q-${currentBehaviourIndex}`}
                >
                  {/* Scenario text box */}
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start gap-3 text-left font-sans mb-6">
                    <span className="text-3xl select-none">💬</span>
                    <div>
                      <h4 className="font-extrabold text-slate-705 text-sm">观察小学生的一天：</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium select-text">
                        {currentBehaviorQ.scenario}
                      </p>
                    </div>
                  </div>

                  {/* Feedback screen overlays */}
                  {behaviourFeedback === 'correct' && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-green-500/95 flex flex-col items-center justify-center text-white rounded-xl p-5"
                      id="etiquette-correct-panel"
                    >
                      <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
                      <h4 className="font-black font-sans text-lg mt-2">完全判对啦！太聪明了！</h4>
                      <p className="text-xs font-sans mt-2 max-w-xs leading-relaxed text-center text-green-55 opacity-90">
                        {currentBehaviorQ.isGood ? currentBehaviorQ.positiveFeedback : currentBehaviorQ.negativeFeedback}
                      </p>
                    </motion.div>
                  )}

                  {behaviourFeedback === 'incorrect' && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-red-400/95 flex flex-col items-center justify-center text-white rounded-xl p-5"
                      id="etiquette-incorrect-panel"
                    >
                      <XCircle className="w-12 h-12 text-white animate-bounce" />
                      <h4 className="font-black font-sans text-lg mt-2">哎呀，差一点点就判对了！</h4>
                      <p className="text-xs font-sans mt-2 max-w-xs leading-relaxed text-center text-red-50 opacity-90">
                        别灰心哦！{currentBehaviorQ.isGood ? currentBehaviorQ.positiveFeedback : currentBehaviorQ.negativeFeedback}
                      </p>
                    </motion.div>
                  )}

                  {/* Yes or No buttons for kids */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      disabled={behaviourFeedback !== null}
                      onClick={() => handleEtiquetteDecision(true)}
                      className="py-4 bg-emerald-50 hover:bg-emerald-100 border-3 border-emerald-300 text-emerald-700 rounded-2xl flex flex-col items-center justify-center font-sans font-black text-base cursor-pointer shadow-sm"
                      id="etiquette-btn-yes"
                    >
                      <span className="text-3xl mb-1 select-none">👍</span>
                      做得真棒，值得学习！
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      disabled={behaviourFeedback !== null}
                      onClick={() => handleEtiquetteDecision(false)}
                      className="py-4 bg-rose-50 hover:bg-rose-100 border-3 border-rose-300 text-rose-700 rounded-2xl flex flex-col items-center justify-center font-sans font-black text-base cursor-pointer shadow-sm"
                      id="etiquette-btn-no"
                    >
                      <span className="text-3xl mb-1 select-none">👎</span>
                      这样做不对，要改正哦。
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Completed State */}
      {gameState === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-10 text-center shadow-xl flex-1 flex flex-col items-center justify-center my-auto"
          id="school-complete-card"
        >
          <div className="relative mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute -inset-4 bg-amber-100 rounded-full blur-sm opacity-60"
            />
            <span className="text-7xl select-none relative z-10">🎓</span>
          </div>

          <p className="text-green-600 font-bold tracking-widest text-lg font-sans">
            小 学 精 英 训 练 毕 业 ！
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2 font-sans">
            整理完全正确，课堂礼仪满分！做好了完美的入学准备！
          </h2>

          <div className="mt-4 flex items-center gap-1 px-4 py-2 bg-yellow-50 text-amber-700 border border-yellow-200 rounded-full font-sans font-extrabold text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>获得社会公德与习惯经验 +30 分</span>
          </div>

          <p className="text-xs text-slate-500 mt-3 font-sans">
            熊猫胖胖拍手赞美，他觉得你已经具备超强的自我管理能力啦，开学一定是个耀眼的红领巾。
          </p>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                SoundManager.playClick();
                onComplete(30, levelId);
              }}
              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-sans font-black text-lg rounded-full shadow-lg cursor-pointer"
              id="school-claim-rewards-btn"
            >
              领取成就，返回大厅!
            </button>
            <button
              onClick={startLevel}
              className="px-5 py-3 border-2 border-slate-300 hover:bg-slate-50 text-slate-600 font-sans font-bold text-sm rounded-full cursor-pointer"
              id="school-retry-btn"
            >
              再练一次 ↺
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
