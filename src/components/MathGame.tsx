import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoundManager } from '../utils/SoundManager';
import { HelpCircle, Sparkles, ArrowLeft } from 'lucide-react';

interface MathGameProps {
  levelId: string;
  onComplete: (points: number, levelId: string) => void;
  onBack: () => void;
}

// Data for Fruit Addition Game
interface FruitQuestion {
  id: number;
  leftCount: number;
  leftIcon: string;
  leftClass: string;
  rightCount: number;
  rightIcon: string;
  rightClass: string;
  choices: number[];
  answer: number;
  hint: string;
}

const FRUIT_QUESTIONS: FruitQuestion[] = [
  {
    id: 1,
    leftCount: 3,
    leftIcon: '🍎',
    leftClass: 'text-red-500',
    rightCount: 2,
    rightIcon: '🍏',
    rightClass: 'text-green-500',
    choices: [4, 5, 6],
    answer: 5,
    hint: '3面红红的苹果加上2位绿苹果朋友，一起数数看！'
  },
  {
    id: 2,
    leftCount: 4,
    leftIcon: '🍊',
    leftClass: 'text-orange-500',
    rightCount: 4,
    rightIcon: '🍓',
    rightClass: 'text-rose-500',
    choices: [7, 8, 9],
    answer: 8,
    hint: '4个小橘子排好队，再来4个草莓宝宝，加起来有多少个？'
  },
  {
    id: 3,
    leftCount: 5,
    leftIcon: '🍌',
    leftClass: 'text-yellow-500',
    rightCount: 3,
    rightIcon: '🍉',
    rightClass: 'text-red-600',
    choices: [6, 8, 10],
    answer: 8,
    hint: '5根小香蕉和3瓣西瓜，这是一道有点难的加法哦！'
  }
];

// Data for Clock Reader
interface ClockQuestion {
  id: number;
  hour: number;
  minute: number;
  scenario: string;
  choices: string[];
  answer: string;
  icon: string;
}

const CLOCK_QUESTIONS: ClockQuestion[] = [
  {
    id: 1,
    hour: 7,
    minute: 0,
    scenario: '⏰ 闹钟响啦！早上好，我们要起床整理好红领巾、吃早餐，准备去学校咯！看此时钟上是几点？',
    choices: ['早上 7:00', '上午 9:00', '中午 12:00'],
    answer: '早上 7:00',
    icon: '🌅'
  },
  {
    id: 2,
    hour: 12,
    minute: 0,
    scenario: '🍱 午餐铃声响啦！和小伙伴们排好队在食堂打饭，多吃青菜不挑食！现在的时钟是多少点？',
    choices: ['上午 11:00', '中午 12:00', '下午 3:00'],
    answer: '中午 12:00',
    icon: '🍚'
  },
  {
    id: 3,
    hour: 9,
    minute: 0,
    scenario: '🌙 整理好明天上课的书包，刷牙洗脸，乖乖上床准备做个美妙的好梦！现在的睡觉时钟是多少点？',
    choices: ['晚上 8:00', '下午 5:00', '晚上 9:00'],
    answer: '晚上 9:00',
    icon: '🛌'
  }
];

export default function MathGame({ levelId, onComplete, onBack }: MathGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [mathScore, setMathScore] = useState(0);

  const startLevel = () => {
    SoundManager.playClick();
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setMathScore(0);
    setSelectedChoice(null);
    setFeedback(null);
  };

  const currentFruitQ = FRUIT_QUESTIONS[currentQuestionIndex];
  const currentClockQ = CLOCK_QUESTIONS[currentQuestionIndex];

  const handleAnswerSubmit = (choice: number | string) => {
    if (feedback) return;
    setSelectedChoice(choice);

    const isCorrect = levelId === 'math_addition'
      ? choice === currentFruitQ.answer
      : choice === currentClockQ.answer;

    if (isCorrect) {
      setFeedback('correct');
      setMathScore((prev) => prev + 1);
      SoundManager.playCorrect();
    } else {
      setFeedback('incorrect');
      SoundManager.playIncorrect();
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedChoice(null);

      const totalQuestions = levelId === 'math_addition' ? FRUIT_QUESTIONS.length : CLOCK_QUESTIONS.length;
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Evaluate reward
        setGameState('completed');
        SoundManager.playFanfare();
      }
    }, 1500);
  };

  // SVGs render clock face dynamically
  const renderClockSVG = (hour: number, minute: number) => {
    // Hour angle: 360 / 12 = 30 degrees per hour + extra based on minutes
    const hrAngle = (hour % 12) * 30 + (minute / 60) * 30;
    // Minute angle: 360 / 60 = 6 degrees per minute
    const minAngle = minute * 6;

    return (
      <svg className="w-48 h-48 drop-shadow-md" viewBox="0 0 200 200">
        {/* Outer Ring */}
        <circle cx="100" cy="100" r="90" fill="#FFFDF5" stroke="#F59E0B" strokeWidth="6" />
        <circle cx="100" cy="100" r="82" fill="white" stroke="#FEF3C7" strokeWidth="4" />
        
        {/* Tick Marks for hours */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 100 + 72 * Math.sin(angle);
          const y1 = 100 - 72 * Math.cos(angle);
          const x2 = 100 + 78 * Math.sin(angle);
          const y2 = 100 - 78 * Math.cos(angle);
          const isMain = i % 3 === 0;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMain ? '#F59E0B' : '#FCD34D'}
              strokeWidth={isMain ? '4' : '2'}
            />
          );
        })}

        {/* Text values for hours */}
        {[12, 3, 6, 9].map((val) => {
          const angle = (val === 12 ? 0 : val === 3 ? 90 : val === 6 ? 180 : 270) * Math.PI / 180;
          const tx = 100 + 58 * Math.sin(angle);
          // Adjust vertical centering manually
          const ty = 100 - 58 * Math.cos(angle) + 4;
          return (
            <text
              key={val}
              x={tx}
              y={ty}
              textAnchor="middle"
              className="font-sans font-bold text-[#F59E0B]"
              fontSize="16"
            >
              {val}
            </text>
          );
        })}

        {/* Center pin shadow */}
        <circle cx="102" cy="102" r="8" fill="#D97706" opacity="0.15" />

        {/* Hour Hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 40 * Math.sin((hrAngle * Math.PI) / 180)}
          y2={100 - 40 * Math.cos((hrAngle * Math.PI) / 180)}
          stroke="#1E293B"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Minute Hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 62 * Math.sin((minAngle * Math.PI) / 180)}
          y2={100 - 62 * Math.cos((minAngle * Math.PI) / 180)}
          stroke="#10B981"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center Pin */}
        <circle cx="100" cy="100" r="7" fill="#F59E0B" />
        <circle cx="100" cy="100" r="3" fill="white" />
      </svg>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-[75vh] flex flex-col justify-between" id="math-game-container">
      {/* Lobby back button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 font-bold font-sans text-sm cursor-pointer transition-colors"
          id="math-back-lobby-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回智力成长大厅</span>
        </button>
      </div>

      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-emerald-200 rounded-3xl p-6 md:p-10 text-center shadow-xl flex-1 flex flex-col items-center justify-center my-auto"
          id="math-intro-card"
        >
          <span className="text-6xl md:text-7xl mb-4 select-none">🐰</span>
          <h2 className="text-2xl md:text-3xl font-black text-emerald-700 tracking-tight font-sans">
            数学小神童：{levelId === 'math_addition' ? '水果算术游乐园' : '神奇时钟小管家'}
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-3 max-w-lg mx-auto leading-relaxed font-sans">
            {levelId === 'math_addition'
              ? '聪聪兔最喜欢的美味水果成熟啦！练习把好吃的红色大苹果、黄色小香蕉相加，你会数得又快又准哦。'
              : '上小学我们要学会看时间安排自己一天的生活习惯。起床啦、上午上课啦、睡觉啦，看看钟表指向几点钟吧！'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startLevel}
            className="mt-8 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-sans font-black text-xl rounded-full shadow-lg cursor-pointer"
            id="math-start-btn"
          >
            🍎 开启数学大冒险！
          </motion.button>
        </motion.div>
      )}

      {/* Playing States */}
      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col items-center justify-center my-auto w-full">
          <div className="text-sm font-bold text-slate-400 font-sans mb-3 text-center">
            关卡题目进度: {currentQuestionIndex + 1} / {levelId === 'math_addition' ? FRUIT_QUESTIONS.length : CLOCK_QUESTIONS.length}
          </div>

          <AnimatePresence mode="wait">
            {levelId === 'math_addition' ? (
              /* Play Math Level 1: Fruit Counting */
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border-3 border-emerald-100 rounded-2xl p-6 w-full max-w-lg shadow-md relative"
                id={`math-addition-q-${currentQuestionIndex}`}
              >
                {/* Graphics */}
                <div className="flex items-center justify-center gap-4 py-8 relative">
                  {/* Left Side Fruits */}
                  <div className="flex gap-2 p-3 bg-red-50/20 border border-dashed border-red-200 rounded-xl flex-wrap justify-center min-w-[100px] min-h-[60px]">
                    {[...Array(currentFruitQ.leftCount)].map((_, i) => (
                      <span key={i} className="text-3xl select-none animate-bounce duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                        {currentFruitQ.leftIcon}
                      </span>
                    ))}
                  </div>

                  <span className="text-3xl font-black text-slate-400 select-none">+</span>

                  {/* Right Side Fruits */}
                  <div className="flex gap-2 p-3 bg-green-50/20 border border-dashed border-green-200 rounded-xl flex-wrap justify-center min-w-[100px] min-h-[60px]">
                    {[...Array(currentFruitQ.rightCount)].map((_, i) => (
                      <span key={i} className="text-3xl select-none animate-bounce" style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                        {currentFruitQ.rightIcon}
                      </span>
                    ))}
                  </div>

                  {/* Visual helper banner */}
                  {feedback === 'correct' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-green-500/90 rounded-2xl flex flex-col items-center justify-center text-white"
                    >
                      <span className="text-4xl">🎉</span>
                      <span className="text-lg font-bold font-sans">答对了！太优秀啦！</span>
                    </motion.div>
                  )}
                  {feedback === 'incorrect' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-red-400/95 rounded-2xl flex flex-col items-center justify-center text-white p-4"
                    >
                      <span className="text-3xl">💡 别泄气哦！</span>
                      <span className="text-sm font-sans mt-1 text-center font-bold">
                        我们可以把两个框里的水果放在一起，一个一个地数过去哦！
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Sub title prompt */}
                <div className="text-center bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 mb-6 font-sans">
                  <p className="text-slate-700 font-bold mb-1 text-sm flex items-center justify-center gap-1">
                    <HelpCircle className="w-4 h-4 text-emerald-500" />
                    <span>这里一共有几个水果呢？</span>
                  </p>
                  <p className="text-xs text-slate-400 leading-tight">
                    计算公式: {currentFruitQ.leftCount} + {currentFruitQ.rightCount} = ?
                  </p>
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-3 gap-3">
                  {currentFruitQ.choices.map((num) => {
                    const isSelected = selectedChoice === num;
                    return (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={feedback !== null}
                        onClick={() => handleAnswerSubmit(num)}
                        className={`py-3 rounded-xl border-3 font-sans font-black text-xl transition-all shadow-sm cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-700 text-white shadow-md'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400'
                        }`}
                        id={`math-addition-choice-${num}`}
                      >
                        {num}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Play Math Level 2: Clock Reader with dynamic dial */
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border-3 border-emerald-100 rounded-2xl p-6 w-full max-w-lg shadow-md flex flex-col items-center relative"
                id={`math-clock-q-${currentQuestionIndex}`}
              >
                {/* Scenario details */}
                <div className="flex gap-2 items-start bg-amber-50 rounded-xl p-3 border border-amber-100 mb-6 w-full font-sans">
                  <span className="text-3xl select-none">{currentClockQ.icon}</span>
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm">做时间的好主人：</h4>
                    <p className="text-xs text-amber-700 leading-relaxed mt-0.5">{currentClockQ.scenario}</p>
                  </div>
                </div>

                {/* SVG Dial Render */}
                <div className="my-2 relative">
                  {renderClockSVG(currentClockQ.hour, currentClockQ.minute)}

                  {/* Result Panel Overlay */}
                  {feedback === 'correct' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-green-500/90 rounded-full flex flex-col items-center justify-center text-white"
                    >
                      <span className="text-4xl">⏰</span>
                      <span className="text-base font-black font-sans">时间认得真准！</span>
                    </motion.div>
                  )}
                  {feedback === 'incorrect' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-red-400/90 rounded-full flex flex-col items-center justify-center text-white p-3 text-center"
                    >
                      <span className="text-3xl">💡 时间小提示</span>
                      <span className="text-[11px] font-sans mt-1 leading-snug font-bold">
                        看时间时，短针(黑粗)代表小时，长针(绿细)指向 12 就是整点哦！再仔细看一看。
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Action multiple-choices */}
                <div className="grid grid-cols-1 gap-2.5 w-full mt-6">
                  {currentClockQ.choices.map((timeOption) => {
                    const isSelected = selectedChoice === timeOption;
                    return (
                      <motion.button
                        key={timeOption}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={feedback !== null}
                        onClick={() => handleAnswerSubmit(timeOption)}
                        className={`w-full py-3 px-4 rounded-xl border-2 font-sans font-bold text-sm transition-all text-center flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 border-amber-600 text-slate-800 font-extrabold shadow-md'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                        }`}
                        id={`math-clock-choice-${timeOption.replace(':', '-')}`}
                      >
                        ⌛ 我认为是：{timeOption}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Completed State */}
      {gameState === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-10 text-center shadow-xl flex-1 flex flex-col items-center justify-center my-auto"
          id="math-complete-card"
        >
          <div className="relative mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute -inset-4 bg-yellow-105 rounded-full blur-sm opacity-60"
            />
            <span className="text-7xl select-none relative z-10">🏆</span>
          </div>

          <p className="text-green-600 font-bold tracking-widest text-lg font-sans">
            速 算 关 卡 大 胜 利 ！
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2 font-sans">
            不愧是聪聪兔推荐的数学速算新学童！
          </h2>

          <div className="mt-4 flex items-center gap-1 px-4 py-2 bg-yellow-50 text-amber-700 border border-yellow-200 rounded-full font-sans font-extrabold text-base animate-pulse">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>获得数学成长经验 +{levelId === 'math_addition' ? 20 : 25} 分</span>
          </div>

          <p className="text-xs text-slate-500 mt-3 font-sans">
            你已经收集了「数学小神童」专属勋章积分，距离正式上小学又迈出了关键的一步！
          </p>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                SoundManager.playClick();
                onComplete(levelId === 'math_addition' ? 20 : 25, levelId);
              }}
              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-sans font-black text-lg rounded-full shadow-lg cursor-pointer"
              id="math-claim-rewards-btn"
            >
              领取成就，返回大厅!
            </button>
            <button
              onClick={startLevel}
              className="px-5 py-3 border-2 border-slate-300 hover:bg-slate-50 text-slate-600 font-sans font-bold text-sm rounded-full cursor-pointer"
              id="math-retry-btn"
            >
              再算一次 ↺
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
