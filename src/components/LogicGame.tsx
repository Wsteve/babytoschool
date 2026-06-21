import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoundManager } from '../utils/SoundManager';
import { HelpCircle, Sparkles, FolderClosed, ArrowLeft } from 'lucide-react';

interface LogicGameProps {
  levelId: string;
  onComplete: (points: number, levelId: string) => void;
  onBack: () => void;
}

// Logic Level 1: Pattern Sequences
interface PatternQuestion {
  id: number;
  sequence: string[]; // E.g., ['🔴', '🔵', '🔴', '🔵']
  choices: string[]; // ['🔴', '🔵', '🟡']
  answer: string;
  description: string;
}

const PATTERN_QUESTIONS: PatternQuestion[] = [
  {
    id: 1,
    sequence: ['🔴', '🔵', '🔴', '🔵', '🔴', '❓'],
    choices: ['🔴', '🔵', '🟢'],
    answer: '🔵',
    description: '看，红气球，蓝气球，不断重复出现。仔细看一看，红气球后面应该放什么颜色呢？'
  },
  {
    id: 2,
    sequence: ['▲', '■', '▲', '■', '▲', '❓'],
    choices: ['▲', '■', '●'],
    answer: '■',
    description: '看，三角形，正方形，三角形，正方形。规律在重复哦！最后那个问号是什么形状呢？'
  },
  {
    id: 3,
    sequence: ['🍎', '🍌', '🍌', '🍎', '🍌', '❓'],
    choices: ['🍎', '🍌', '🍇'],
    answer: '🍌',
    description: '高级规律闯关！一串苹果、香蕉、香蕉，又来苹果、香蕉...后面应该是什么水果呢？'
  }
];

// Logic Level 2: Sorting Shelf Items
interface SortableItem {
  id: string;
  name: string;
  icon: string;
  category: 'fruit' | 'stationery' | 'animal';
}

const SORTABLE_ITEMS: SortableItem[] = [
  { id: '1', name: '香蕉', icon: '🍌', category: 'fruit' },
  { id: '2', name: '铅笔', icon: '✏️', category: 'stationery' },
  { id: '3', name: '小青蛙', icon: '🐸', category: 'animal' },
  { id: '4', name: '红苹果', icon: '🍎', category: 'fruit' },
  { id: '5', name: '尺子', icon: '📐', category: 'stationery' },
  { id: '6', name: '长颈鹿', icon: '🦒', category: 'animal' },
  { id: '7', name: '大西瓜', icon: '🍉', category: 'fruit' },
  { id: '8', name: '书本', icon: '📕', category: 'stationery' },
  { id: '9', name: '大熊猫', icon: '🐼', category: 'animal' },
];

export default function LogicGame({ levelId, onComplete, onBack }: LogicGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [selectedPatternChoice, setSelectedPatternChoice] = useState<string | null>(null);
  const [patternFeedback, setPatternFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Sorting game specific
  const [sortItems, setSortItems] = useState<SortableItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [sortingPoints, setSortingPoints] = useState<Record<string, string>>({}); // itemId -> basketName
  const [itemCountSorted, setItemCountSorted] = useState(0);

  const startLevel = () => {
    SoundManager.playClick();
    setGameState('playing');
    if (levelId === 'logic_sorting') {
      // Setup random sorting items
      const randomized = [...SORTABLE_ITEMS].sort(() => Math.random() - 0.5);
      setSortItems(randomized);
      setSelectedItemId(null);
      setSortingPoints({});
      setItemCountSorted(0);
    } else {
      setCurrentPatternIndex(0);
      setSelectedPatternChoice(null);
      setPatternFeedback(null);
    }
  };

  const currentPatternQ = PATTERN_QUESTIONS[currentPatternIndex];

  // Handle Level 1 Pattern Answers
  const handlePatternAnswer = (choice: string) => {
    if (patternFeedback) return;
    setSelectedPatternChoice(choice);

    if (choice === currentPatternQ.answer) {
      setPatternFeedback('correct');
      SoundManager.playCorrect();
    } else {
      setPatternFeedback('incorrect');
      SoundManager.playIncorrect();
    }

    setTimeout(() => {
      setPatternFeedback(null);
      setSelectedPatternChoice(null);

      if (currentPatternIndex < PATTERN_QUESTIONS.length - 1) {
        setCurrentPatternIndex((prev) => prev + 1);
      } else {
        setGameState('completed');
        SoundManager.playFanfare();
      }
    }, 1500);
  };

  // Handle Level 2 Item Select
  const handleItemSelect = (id: string) => {
    if (sortingPoints[id]) return; // already sorted
    SoundManager.playClick();
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  // Handle Level 2 Basket Drop
  const handleBinDrop = (binType: 'fruit' | 'stationery' | 'animal') => {
    if (!selectedItemId) return;
    const item = sortItems.find((i) => i.id === selectedItemId);
    if (!item) return;

    if (item.category === binType) {
      // Correct sorting!
      SoundManager.playPop();
      setSortingPoints((prev) => ({ ...prev, [selectedItemId]: binType }));
      setSelectedItemId(null);

      const nextSortedCount = itemCountSorted + 1;
      setItemCountSorted(nextSortedCount);

      if (nextSortedCount === SORTABLE_ITEMS.length) {
        setTimeout(() => {
          setGameState('completed');
          SoundManager.playFanfare();
        }, 800);
      }
    } else {
      // Incorrect feedback
      SoundManager.playIncorrect();
      // Temporary wiggle
      const originalSelected = selectedItemId;
      setSelectedItemId(null);
      setTimeout(() => setSelectedItemId(originalSelected), 200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-[75vh] flex flex-col justify-between" id="logic-game-container">
      {/* Return back button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 font-bold font-sans text-sm cursor-pointer transition-colors"
          id="logic-back-lobby-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回智力成长大厅</span>
        </button>
      </div>

      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-purple-200 rounded-3xl p-6 md:p-10 text-center shadow-xl flex-1 flex flex-col items-center justify-center my-auto"
          id="logic-intro-card"
        >
          <span className="text-6xl md:text-7xl mb-4 select-none">🦉</span>
          <h2 className="text-2xl md:text-3xl font-black text-purple-700 tracking-tight font-sans">
            逻辑挑战营：{levelId === 'logic_patterns' ? '寻找规律拼图形' : '小小超市分类收纳员'}
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-3 max-w-lg mx-auto leading-relaxed font-sans">
            {levelId === 'logic_patterns'
              ? '聪明的猫头鹰最擅长找关系啦！观察彩虹气球、各种形状的排列重复模式，猜猜问号里的神秘形状是什么！'
              : '上小学后，我们要学会自己归类和收拾杂物哦。我们要在架子上将水果、文具和可爱动物玩具分别送进正确的箱子里。'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startLevel}
            className="mt-8 px-8 py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-sans font-black text-xl rounded-full shadow-lg cursor-pointer"
            id="logic-start-btn"
          >
            🧩 开启脑力大爆发！
          </motion.button>
        </motion.div>
      )}

      {/* Playing States */}
      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col items-center justify-center my-auto w-full">
          {levelId === 'logic_patterns' ? (
            /* Level 1: Find repeating sequence */
            <div className="w-full max-w-lg">
              <div className="text-sm font-bold text-slate-400 font-sans mb-3 text-center">
                规律题目进度: {currentPatternIndex + 1} / {PATTERN_QUESTIONS.length}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPatternIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white border-3 border-purple-100 rounded-2xl p-6 shadow-md relative mt-2 text-center"
                  id={`logic-pattern-q-${currentPatternIndex}`}
                >
                  <p className="text-sm text-slate-500 font-medium font-sans mb-4 max-w-sm mx-auto">
                    {currentPatternQ.description}
                  </p>

                  {/* Render graphical sequence */}
                  <div className="flex gap-3 justify-center items-center py-6 border-b border-purple-50 mb-6 bg-purple-50/20 rounded-xl relative overflow-hidden min-h-[100px]">
                    {currentPatternQ.sequence.map((element, i) => {
                      const isQuestion = element === '❓';
                      return (
                        <span
                          key={i}
                          className={`text-4xl md:text-5xl select-none animate-bounce inline-block ${
                            isQuestion ? 'text-purple-600 font-black animate-pulse' : ''
                          }`}
                          style={{ animationDelay: `${i * 120}ms` }}
                        >
                          {element}
                        </span>
                      );
                    })}

                    {/* Feedback overlays */}
                    {patternFeedback === 'correct' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center text-white rounded-xl"
                      >
                        <span className="text-4xl">🌟</span>
                        <span className="text-lg font-black font-sans">太神啦！规律找对了！</span>
                      </motion.div>
                    )}
                    {patternFeedback === 'incorrect' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-red-400/95 flex flex-col items-center justify-center text-white rounded-xl p-4"
                      >
                        <span className="text-3xl">🧩 小建议</span>
                        <span className="text-xs font-sans mt-0.5 max-w-xs leading-relaxed font-bold">
                          观察前面元素是不是在「循环」呢？比如：红、蓝、红、蓝，红之后当然又是蓝咯！再想一想！
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Choices options */}
                  <div className="grid grid-cols-3 gap-3">
                    {currentPatternQ.choices.map((choice) => {
                      const isSelected = selectedPatternChoice === choice;
                      return (
                        <motion.button
                          key={choice}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={patternFeedback !== null}
                          onClick={() => handlePatternAnswer(choice)}
                          className={`py-3 rounded-xl border-3 text-3xl md:text-4xl transition-all shadow-sm flex items-center justify-center select-none cursor-pointer ${
                            isSelected
                              ? 'bg-purple-500 border-purple-700 font-bold'
                              : 'bg-purple-50 border-purple-200 hover:border-purple-300'
                          }`}
                          id={`logic-pattern-choice-${choice}`}
                        >
                          {choice}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Level 2: Interactive classification items */
            <div className="w-full max-w-2xl space-y-6">
              <div className="text-center font-sans">
                <h3 className="text-lg font-black text-purple-800">🗑️ 杂物分类整理大战</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  点选底下的「物品」，然后再点选正确的「收类竹筐」装进去吧！归类好所有玩具即算成功！
                  (<span className="font-bold text-indigo-600">{itemCountSorted}</span> / {SORTABLE_ITEMS.length} 已分类)
                </p>
              </div>

              {/* Box grid items (unsorted) */}
              <div className="bg-purple-50/20 border-2 border-purple-100 rounded-3xl p-5 min-h-[140px] flex gap-3 flex-wrap justify-center items-center">
                {sortItems.map((item) => {
                  const isSorted = sortingPoints[item.id] !== undefined;
                  const isSelected = selectedItemId === item.id;

                  if (isSorted) return null; // hide sorted items

                  return (
                    <motion.button
                      key={item.id}
                      layoutId={`item-${item.id}`}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleItemSelect(item.id)}
                      className={`py-2 px-3 border-3 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50 shadow-md ring-3 ring-amber-300'
                          : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm'
                      }`}
                      id={`sort-item-${item.id}`}
                    >
                      <span className="text-3xl select-none leading-none">{item.icon}</span>
                      <span className="text-xs font-bold text-slate-700 font-sans">{item.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Dynamic instruction helper */}
              <div className="text-center py-1 min-h-[30px]" id="logic-sorting-helper">
                {selectedItemId ? (
                  <motion.p
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-sm text-purple-700 font-bold font-sans animate-pulse"
                  >
                    👉 已经选中「{sortItems.find((i) => i.id === selectedItemId)?.name}」，现在点敲并放进底下的正确箱子里！
                  </motion.p>
                ) : (
                  <p className="text-xs text-slate-400 font-medium font-sans">
                    点击上面的某一样小零碎，再放入下方的分类大箩筐吧！
                  </p>
                )}
              </div>

              {/* Baskets (Sorting slots) */}
              <div className="grid grid-cols-3 gap-4" id="logic-sorting-baskets">
                {/* Bin 1: Fruit */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBinDrop('fruit')}
                  className="bg-amber-50 hover:bg-amber-100 border-4 border-amber-300 rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer min-h-[160px] justify-between shadow-sm relative overflow-hidden group"
                  id="bin-fruit-btn"
                >
                  <div className="text-4xl group-hover:scale-110 duration-200">🍉</div>
                  <h4 className="font-extrabold text-sm text-amber-800 font-sans mt-2">
                    新鲜水果狂
                  </h4>
                  <p className="text-[10px] text-amber-600 font-sans leading-tight">
                    装苹果、西瓜好吃的
                  </p>
                  
                  {/* Decorative counter inside bin */}
                  <span className="mt-2 text-[10px] font-bold bg-amber-200 px-2 py-0.5 rounded-full text-amber-800 font-sans">
                    香甜
                  </span>
                </motion.button>

                {/* Bin 2: Stationery */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBinDrop('stationery')}
                  className="bg-sky-50 hover:bg-sky-100 border-4 border-sky-300 rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer min-h-[160px] justify-between shadow-sm relative overflow-hidden group"
                  id="bin-stationery-btn"
                >
                  <div className="text-4xl group-hover:scale-110 duration-200">📐</div>
                  <h4 className="font-extrabold text-sm text-sky-800 font-sans mt-2">
                    智慧学具袋
                  </h4>
                  <p className="text-[10px] text-sky-600 font-sans leading-tight">
                    装书本、尺子铅笔等
                  </p>

                  <span className="mt-2 text-[10px] font-bold bg-sky-200 px-2 py-0.5 rounded-full text-sky-800 font-sans">
                    好学
                  </span>
                </motion.button>

                {/* Bin 3: Animal */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBinDrop('animal')}
                  className="bg-emerald-50 hover:bg-emerald-100 border-4 border-emerald-300 rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer min-h-[160px] justify-between shadow-sm relative overflow-hidden group"
                  id="bin-animal-btn"
                >
                  <div className="text-4xl group-hover:scale-110 duration-200">🦊</div>
                  <h4 className="font-extrabold text-sm text-emerald-800 font-sans mt-2">
                    神奇动物园
                  </h4>
                  <p className="text-[10px] text-emerald-600 font-sans leading-tight">
                    装长颈鹿、熊猫和青蛙
                  </p>

                  <span className="mt-2 text-[10px] font-bold bg-emerald-200 px-2 py-0.5 rounded-full text-emerald-800 font-sans">
                    友爱
                  </span>
                </motion.button>
              </div>
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
          id="logic-complete-card"
        >
          <div className="relative mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute -inset-4 bg-yellow-100 rounded-full blur-sm opacity-60"
            />
            <span className="text-7xl select-none relative z-10">🏆</span>
          </div>

          <p className="text-green-600 font-bold tracking-widest text-lg font-sans">
            智 力 满 分 运 动 会 ！
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2 font-sans">
            分类有条有理，你已经掌握了最高级的逻辑收纳法！
          </h2>

          <div className="mt-4 flex items-center gap-1 px-4 py-2 bg-yellow-50 text-amber-700 border border-yellow-200 rounded-full font-sans font-extrabold text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>获得逻辑思维经验 +{levelId === 'logic_patterns' ? 20 : 25} 分</span>
          </div>

          <p className="text-xs text-slate-500 mt-3 font-sans">
            猫头鹰教授非常赞赏你的空间几何与概念收纳眼界，点亮专属逻辑微章哦！
          </p>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                SoundManager.playClick();
                onComplete(levelId === 'logic_patterns' ? 20 : 25, levelId);
              }}
              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-sans font-black text-lg rounded-full shadow-lg cursor-pointer"
              id="logic-claim-rewards-btn"
            >
              领取成就，返回大厅!
            </button>
            <button
              onClick={startLevel}
              className="px-5 py-3 border-2 border-slate-300 hover:bg-slate-50 text-slate-600 font-sans font-bold text-sm rounded-full cursor-pointer"
              id="logic-retry-btn"
            >
              再理一次 ↺
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
