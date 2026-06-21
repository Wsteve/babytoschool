import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoundManager } from '../utils/SoundManager';
import { Sparkles, Trophy, HelpCircle, ArrowLeft } from 'lucide-react';

interface PinyinGameProps {
  levelId: string;
  onComplete: (points: number, levelId: string) => void;
  onBack: () => void;
}

// Data for Pinyin Level 1
const PINYIN_CLASSIFY_ITEMS = [
  { item: 'b', type: 'shengmu', label: '声母 b' },
  { item: 'a', type: 'yunmu', label: '韵母 a' },
  { item: 'p', type: 'shengmu', label: '声母 p' },
  { item: 'o', type: 'yunmu', label: '韵母 o' },
  { item: 'm', type: 'shengmu', label: '声母 m' },
  { item: 'e', type: 'yunmu', label: '韵母 e' },
  { item: 'f', type: 'shengmu', label: '声母 f' },
  { item: 'i', type: 'yunmu', label: '韵母 i' },
];

// Data for Pinyin Level 2
interface MatchingPair {
  id: string;
  pinyin: string;
  hanzi: string;
  emoji: string;
}

const MATCHING_PAIRS: MatchingPair[] = [
  { id: '1', pinyin: 'shū', hanzi: '书', emoji: '📖' },
  { id: '2', pinyin: 'yú', hanzi: '鱼', emoji: '🐟' },
  { id: '3', pinyin: 'mā ma', hanzi: '妈妈', emoji: '👩' },
  { id: '4', pinyin: 'huā', hanzi: '花', emoji: '🌸' },
  { id: '5', pinyin: 'tài yáng', hanzi: '太阳', emoji: '☀️' },
];

export default function PinyinGame({ levelId, onComplete, onBack }: PinyinGameProps) {
  // Common states
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [pointsAwarded, setPointsAwarded] = useState(0);

  // Level 1 specific states: Feeding game
  const [currentClassifyIndex, setCurrentClassifyIndex] = useState(0);
  const [classifyFeedback, setClassifyFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [pinyinScore, setPinyinScore] = useState(0);

  // Level 2 specific states: Matching game
  const [selectedPinyinId, setSelectedPinyinId] = useState<string | null>(null);
  const [selectedHanziId, setSelectedHanziId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [shuffledPinyins, setShuffledPinyins] = useState<MatchingPair[]>([]);
  const [shuffledHanzis, setShuffledHanzis] = useState<MatchingPair[]>([]);

  // Setup Level 2 matching deck
  const initMatchingGame = () => {
    // Shuffle
    const py = [...MATCHING_PAIRS].sort(() => Math.random() - 0.5);
    const hz = [...MATCHING_PAIRS].sort(() => Math.random() - 0.5);
    setShuffledPinyins(py);
    setShuffledHanzis(hz);
    setMatchedIds([]);
    setSelectedPinyinId(null);
    setSelectedHanziId(null);
  };

  const handleStartGame = () => {
    SoundManager.playClick();
    setGameState('playing');
    if (levelId === 'pinyin_chars') {
      initMatchingGame();
    } else {
      setCurrentClassifyIndex(0);
      setPinyinScore(0);
    }
  };

  // Level 1 handler (Classification)
  const handleClassify = (targetType: 'shengmu' | 'yunmu') => {
    if (classifyFeedback) return;
    const currentItem = PINYIN_CLASSIFY_ITEMS[currentClassifyIndex];
    if (currentItem.type === targetType) {
      setClassifyFeedback('correct');
      setPinyinScore((prev) => prev + 1);
      SoundManager.playCorrect();
    } else {
      setClassifyFeedback('incorrect');
      SoundManager.playIncorrect();
    }

    setTimeout(() => {
      setClassifyFeedback(null);
      if (currentClassifyIndex < PINYIN_CLASSIFY_ITEMS.length - 1) {
        setCurrentClassifyIndex((prev) => prev + 1);
      } else {
        // Complete the game
        const finalScore = pinyinScore + (currentItem.type === targetType ? 1 : 0);
        const ratio = finalScore / PINYIN_CLASSIFY_ITEMS.length;
        const prize = ratio >= 0.75 ? 20 : 10; // High score reward!
        setPointsAwarded(prize);
        setGameState('completed');
        SoundManager.playFanfare();
      }
    }, 1200);
  };

  // Level 2 Match handler
  const handleMatchSelect = (type: 'pinyin' | 'hanzi', id: string) => {
    SoundManager.playClick();
    if (type === 'pinyin') {
      if (selectedPinyinId === id) {
        setSelectedPinyinId(null); // Deselect
      } else {
        setSelectedPinyinId(id);
        // Instant match check if Hanzi is selected
        if (selectedHanziId) {
          if (selectedHanziId === id) {
            // Correct Match!
            setMatchedIds((prev) => [...prev, id]);
            SoundManager.playCorrect();
            // Check win
            if (matchedIds.length + 1 === MATCHING_PAIRS.length) {
              setTimeout(() => {
                setPointsAwarded(25);
                setGameState('completed');
                SoundManager.playFanfare();
              }, 600);
            }
          } else {
            SoundManager.playIncorrect();
          }
          // Reset selections
          setSelectedPinyinId(null);
          setSelectedHanziId(null);
        }
      }
    } else {
      if (selectedHanziId === id) {
        setSelectedHanziId(null); // Deselect
      } else {
        setSelectedHanziId(id);
        // Instant match check if Pinyin is selected
        if (selectedPinyinId) {
          if (selectedPinyinId === id) {
            // Correct Match!
            setMatchedIds((prev) => [...prev, id]);
            SoundManager.playCorrect();
            // Check win
            if (matchedIds.length + 1 === MATCHING_PAIRS.length) {
              setTimeout(() => {
                setPointsAwarded(25);
                setGameState('completed');
                SoundManager.playFanfare();
              }, 600);
            }
          } else {
            SoundManager.playIncorrect();
          }
          // Reset selections
          setSelectedPinyinId(null);
          setSelectedHanziId(null);
        }
      }
    }
  };

  const currentItem = PINYIN_CLASSIFY_ITEMS[currentClassifyIndex];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-[75vh] flex flex-col justify-between" id="pinyin-game-container">
      {/* Back to hall */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 font-bold font-sans text-sm cursor-pointer transition-colors"
          id="pinyin-back-lobby-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回智力成长大厅</span>
        </button>
      </div>

      {/* Intro State */}
      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-indigo-200 rounded-3xl p-6 md:p-10 text-center shadow-xl flex-1 flex flex-col items-center justify-center my-auto"
          id="pinyin-intro-card"
        >
          <span className="text-6xl md:text-7xl mb-4 select-none filter drop-shadow">🦁</span>
          <h2 className="text-2xl md:text-3xl font-black text-indigo-700 font-sans tracking-tight">
            拼音大冒险：{levelId === 'pinyin_initials' ? '声母与韵母大派对' : '词语拼读连连看'}
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-3 max-w-lg mx-auto leading-relaxed">
            {levelId === 'pinyin_initials'
              ? '拼音是上小学的第一站。我们要帮勇敢的小狮子分类这些字母小甜点！把声母投喂给小霸王龙，把韵母投喂给花瓣小仙子！'
              : '拼音能帮我们读懂没有图画的故事书！我们要看清拼音卡，找出带有可爱表情的汉字卡把它们连起来！'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            className="mt-8 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-sans font-black text-xl rounded-full shadow-lg cursor-pointer"
            id="pinyin-start-btn"
          >
            🚀 进入关卡！
          </motion.button>
        </motion.div>
      )}

      {/* Playing State */}
      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col justify-center my-auto">
          {levelId === 'pinyin_initials' ? (
            /* Level 1: Category sorting game (Feed Dino / Fairy) */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Dino - Shengmu */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClassify('shengmu')}
                className="bg-emerald-50 border-4 border-emerald-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer text-center relative overflow-hidden group min-h-[250px] shadow-sm"
                id="feed-shengmu-btn"
              >
                <div className="text-6xl mb-3 duration-300 group-hover:scale-110">🦖</div>
                <h3 className="font-bold text-lg text-emerald-800 font-sans">声母恐龙</h3>
                <p className="text-xs text-emerald-600 mt-1 max-w-[150px] leading-tight font-sans">
                  最喜欢吃声母：<br />
                  <span className="font-bold text-emerald-700 text-sm">b, p, m, f...</span>
                </p>
                <span className="mt-4 px-3 py-1 bg-emerald-500 text-white font-bold text-xs rounded-full shadow-sm">
                  点此投喂
                </span>
              </motion.button>

              {/* Center - Current letter cookie */}
              <div className="flex flex-col items-center justify-center p-4">
                <div className="text-sm font-bold text-slate-400 font-sans mb-3">
                  字母饼干进度: {currentClassifyIndex + 1} / {PINYIN_CLASSIFY_ITEMS.length}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentClassifyIndex}
                    initial={{ scale: 0, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -40 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-32 h-32 rounded-full border-6 border-amber-300 bg-amber-100 flex items-center justify-center shadow-md relative"
                    id="pinyin-cookie-card"
                  >
                    <span className="text-5xl font-black font-sans text-amber-800 select-none">
                      {currentItem.item}
                    </span>

                    {/* Fun visual feedback over progress */}
                    {classifyFeedback === 'correct' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-green-500/90 rounded-full flex flex-col items-center justify-center text-white"
                      >
                        <span className="text-3xl">❤️</span>
                        <span className="text-xs font-bold font-sans">投喂正确！</span>
                      </motion.div>
                    )}

                    {classifyFeedback === 'incorrect' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-red-400/90 rounded-full flex flex-col items-center justify-center text-white"
                      >
                        <span className="text-3xl">😢</span>
                        <span className="text-xs font-bold font-sans">它不喜欢这个!</span>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <p className="text-sm text-slate-500 font-bold font-sans text-center mt-6 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>字母 「{currentItem.item}」 是声母还是韵母呢？</span>
                </p>
              </div>

              {/* Right Fairy - Yunmu */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClassify('yunmu')}
                className="bg-indigo-50 border-4 border-indigo-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer text-center relative overflow-hidden group min-h-[250px] shadow-sm"
                id="feed-yunmu-btn"
              >
                <div className="text-6xl mb-3 duration-300 group-hover:scale-110">🧚‍♀️</div>
                <h3 className="font-bold text-lg text-indigo-800 font-sans">韵母仙子</h3>
                <p className="text-xs text-indigo-600 mt-1 max-w-[150px] leading-tight font-sans">
                  最喜欢吃韵母：<br />
                  <span className="font-bold text-indigo-700 text-sm">a, o, e, i, u...</span>
                </p>
                <span className="mt-4 px-3 py-1 bg-indigo-500 text-white font-bold text-xs rounded-full shadow-sm">
                  点此投喂
                </span>
              </motion.button>
            </div>
          ) : (
            /* Level 2: Click to match cards */
            <div className="space-y-6">
              <div className="text-center font-sans">
                <h3 className="text-lg font-extrabold text-indigo-800">🎯 配对连连看</h3>
                <p className="text-sm text-slate-400 mt-1">
                  选择左边一个「拼音卡」，再对应到右边「汉字卡」就可以吃掉它们喔！
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {/* Column 1: Pinyins */}
                <div className="space-y-3">
                  <h4 className="text-center text-xs font-bold text-slate-400 font-sans tracking-wider">
                    拼音卡片
                  </h4>
                  {shuffledPinyins.map((p) => {
                    const isMatched = matchedIds.includes(p.id);
                    const isSelected = selectedPinyinId === p.id;
                    return (
                      <motion.button
                        key={p.id}
                        whileHover={!isMatched ? { scale: 1.03 } : {}}
                        whileTap={!isMatched ? { scale: 0.97 } : {}}
                        disabled={isMatched}
                        onClick={() => handleMatchSelect('pinyin', p.id)}
                        className={`w-full py-4 px-3 rounded-xl border-3 font-sans font-black text-lg transition-all text-center flex items-center justify-center cursor-pointer ${
                          isMatched
                            ? 'bg-slate-50 border-slate-200 text-slate-300 opacity-45'
                            : isSelected
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-800 shadow-md ring-2 ring-indigo-300'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-400'
                        }`}
                        id={`match-py-${p.id}`}
                      >
                        {isMatched ? '✔️ 拼音匹配' : p.pinyin}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Column 2: Hanzi + Emoji */}
                <div className="space-y-3">
                  <h4 className="text-center text-xs font-bold text-slate-400 font-sans tracking-wider">
                    汉字卡片
                  </h4>
                  {shuffledHanzis.map((h) => {
                    const isMatched = matchedIds.includes(h.id);
                    const isSelected = selectedHanziId === h.id;
                    return (
                      <motion.button
                        key={h.id}
                        whileHover={!isMatched ? { scale: 1.03 } : {}}
                        whileTap={!isMatched ? { scale: 0.97 } : {}}
                        disabled={isMatched}
                        onClick={() => handleMatchSelect('hanzi', h.id)}
                        className={`w-full py-4 px-3 rounded-xl border-3 font-sans font-black text-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                          isMatched
                            ? 'bg-slate-50 border-slate-200 text-slate-300 opacity-45'
                            : isSelected
                            ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-md ring-2 ring-amber-300'
                            : 'bg-amber-50 border-amber-200 text-slate-800 hover:border-amber-400'
                        }`}
                        id={`match-hz-${h.id}`}
                      >
                        {isMatched ? (
                          '✔️'
                        ) : (
                          <>
                            <span className="text-2xl select-none">{h.emoji}</span>
                            <span className="text-base text-slate-800">{h.hanzi}</span>
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
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
          id="pinyin-complete-card"
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
            通 关 大 胜 利 ！
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2 font-sans">
            你太棒了！拼音知识点完全掌握！
          </h2>

          <div className="mt-4 flex items-center gap-1 px-4 py-2 bg-yellow-50 text-amber-700 border border-yellow-200 rounded-full font-sans font-extrabold text-base">
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            <span>获得拼音成长经验 +{pointsAwarded} 分</span>
          </div>

          <p className="text-xs text-slate-500 mt-3 font-sans">
            守护神小狮子为你点亮了专属「拼音勋章」哦！继续勇往直前吧。
          </p>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                SoundManager.playClick();
                onComplete(pointsAwarded, levelId);
              }}
              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-sans font-black text-lg rounded-full shadow-lg cursor-pointer"
              id="pinyin-claim-rewards-btn"
            >
              领取成就，返回大厅!
            </button>
            <button
              onClick={handleStartGame}
              className="px-5 py-3 border-2 border-slate-300 hover:bg-slate-50 text-slate-600 font-sans font-bold text-sm rounded-full cursor-pointer"
              id="pinyin-retry-btn"
            >
              再玩一次 ↺
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
