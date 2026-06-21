import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Award, Trash2, Heart } from 'lucide-react';

import { UserProgress, AvatarId, GameLevel } from './types';
import { CHARACTERS, GAME_LEVELS, STICKERS } from './utils/gameData';
import { SoundManager } from './utils/SoundManager';

// Subcomponents
import AvatarSelect from './components/AvatarSelect';
import TopBar from './components/TopBar';
import StickerBook from './components/StickerBook';
import PinyinGame from './components/PinyinGame';
import MathGame from './components/MathGame';
import LogicGame from './components/LogicGame';
import SchoolLifeGame from './components/SchoolLifeGame';
import DreamGarden from './components/DreamGarden';
import AICompanionChat from './components/AICompanionChat';
import MyAdventurePet from './components/MyAdventurePet';
import EyeExercisesOverlay from './components/EyeExercisesOverlay';
import { UserPetState } from './types';

const LOCAL_STORAGE_KEY = 'KINDERGARTEN_ADVENTURE_STATE_NEW_V1';

const initialProgress: UserProgress = {
  characterId: null,
  nickname: '',
  points: 0,
  unlockedLevels: {},
  solvedQuestions: {},
  unlockedStickers: [],
  stars: 2, // Gift kids 2 stars so they can right away build a flowerbed or slide!
  gardenDecorations: [],
  petAdoptState: null,
  foodCount: 1 // Gift 1 food immediately so they can see feed effects!
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lobby' | 'garden' | 'pet' | 'chat'>('lobby');

  // Time spent in active session tracking for automatic eye exercises (20 minutes)
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isEyeExercisesOpen, setIsEyeExercisesOpen] = useState(false);

  // Sticker achievement notification banner state
  const [unlockedStickerNotification, setUnlockedStickerNotification] = useState<string | null>(null);

  // Continuously track time to play eye exercises after 20 minutes (1200 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((prev) => {
        const next = prev + 1;
        // Exceeds 20 minutes: play automatic eye exercises
        if (next >= 1200) {
          setIsEyeExercisesOpen(true);
          return 0; // reset active timer session
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRewardEyeExercisesComplete = () => {
    const currentStars = progress.stars ?? 2;
    const currentFood = progress.foodCount ?? 1;
    const updatedProgress: UserProgress = {
      ...progress,
      stars: currentStars + 1,
      foodCount: currentFood + 1,
    };
    saveProgress(updatedProgress);
    setSessionSeconds(0); // Safely reset session countdown to 0
  };

  // 1. Load data from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.nickname) {
          setProgress(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load local state', e);
    }
  }, []);

  // 2. Save data helper
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.warn('Failed to write local state', e);
    }
  };

  // 3. User selects Avatar & registers
  const handleRegister = (nickname: string, characterId: AvatarId) => {
    const updatedStickers = ['first_step']; // Earn first step sticker instantly!
    
    const newProgress: UserProgress = {
      ...initialProgress,
      nickname,
      characterId,
      unlockedStickers: updatedStickers
    };

    saveProgress(newProgress);
    SoundManager.playFanfare();
  };

  // 4. Complete a level and update scores/stickers
  const handleLevelComplete = (earnedPoints: number, levelId: string) => {
    const levelObj = GAME_LEVELS.find((l) => l.id === levelId);
    if (!levelObj) return;

    const key = levelId;
    const isFirstTime = !progress.unlockedLevels[key];

    // Calculate score
    const pointsToAdd = isFirstTime ? earnedPoints : 0; // only award first-time completion points to encourage all games
    const nextPoints = progress.points + pointsToAdd;

    const nextUnlockedLevels = {
      ...progress.unlockedLevels,
      [key]: true
    };

    // Calculate newly unlocked stickers based on accomplishments
    const newlyCompletedCategory = levelObj.category;
    const categoryLevels = GAME_LEVELS.filter((l) => l.category === newlyCompletedCategory);
    
    // Check if ALL levels for this category are done
    const allCategoryCompleted = categoryLevels.every((l) => nextUnlockedLevels[l.id] === true);
    
    let nextStickers = [...progress.unlockedStickers];

    // Pinyin Master
    if (newlyCompletedCategory === 'pinyin' && allCategoryCompleted && !nextStickers.includes('pinyin_master')) {
      nextStickers.push('pinyin_master');
      triggerStickerNotification('pinyin_master');
    }
    // Math Genius
    if (newlyCompletedCategory === 'math' && allCategoryCompleted && !nextStickers.includes('math_genius')) {
      nextStickers.push('math_genius');
      triggerStickerNotification('math_genius');
    }
    // Logic Expert
    if (newlyCompletedCategory === 'logic' && allCategoryCompleted && !nextStickers.includes('logic_expert')) {
      nextStickers.push('logic_expert');
      triggerStickerNotification('logic_expert');
    }
    // School Life Star
    if (newlyCompletedCategory === 'school-life' && allCategoryCompleted && !nextStickers.includes('school_star')) {
      nextStickers.push('school_star');
      triggerStickerNotification('school_star');
    }

    // Perfect Score Sticker badge
    if (nextPoints >= 100 && !nextStickers.includes('perfect_score')) {
      nextStickers.push('perfect_score');
      triggerStickerNotification('perfect_score');
    }

    const nextStars = (progress.stars ?? 2) + (isFirstTime ? 1 : 0);
    const nextFoodCount = (progress.foodCount ?? 1) + (isFirstTime ? 1 : 0);

    const updatedProgress: UserProgress = {
      ...progress,
      points: nextPoints,
      unlockedLevels: nextUnlockedLevels,
      unlockedStickers: nextStickers,
      stars: nextStars,
      foodCount: nextFoodCount
    };

    saveProgress(updatedProgress);
    setActiveLevelId(null); // return to dashboard
  };

  const handleBuildDecoration = (id: string, cost: number, name: string) => {
    const currentStars = progress.stars ?? 2;
    if (currentStars < cost) return;

    const nextDecorations = [...(progress.gardenDecorations ?? []), id];
    const updatedProgress: UserProgress = {
      ...progress,
      stars: currentStars - cost,
      gardenDecorations: nextDecorations
    };
    saveProgress(updatedProgress);
  };

  const handleGrantStar = (qty: number) => {
    const updatedProgress: UserProgress = {
      ...progress,
      stars: (progress.stars ?? 2) + qty
    };
    saveProgress(updatedProgress);
  };

  const triggerStickerNotification = (stickerId: string) => {
    setUnlockedStickerNotification(stickerId);
    // Auto clear notification after 5 secs
    setTimeout(() => {
      setUnlockedStickerNotification(null);
    }, 5000);
  };

  // 5. Reset progress
  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setProgress(initialProgress);
    setActiveLevelId(null);
    setActiveTab('lobby');
  };

  // User hasn't registered avatar yet
  if (!progress.characterId || !progress.nickname) {
    return (
      <div className="bg-[#FFFDF6] min-h-screen py-6 flex items-center justify-center">
        <AvatarSelect onSelect={handleRegister} />
      </div>
    );
  }

  // Get active level object
  const activeLevel = GAME_LEVELS.find((l) => l.id === activeLevelId);

  // Filter levels for dashboard categories
  const categories = [
    {
      id: 'pinyin',
      name: '🔤 拼音大冒险',
      desc: '学好拼音声母、韵母、组合读汉字，提前看懂故事书！',
      bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-800'
    },
    {
      id: 'math',
      name: '🔢 数学小天地',
      desc: '速算加减、好玩计数搭配学会看钟表，理好日常生活！',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-800'
    },
    {
      id: 'logic',
      name: '🧩 逻辑思维馆',
      desc: '找出形状重复发生的神奇规律、分类杂乱的竹筐杂物！',
      bgColor: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    {
      id: 'school-life',
      name: '🎒 小学新生活',
      desc: '模拟一天的早起、排队、理好干净书包，遵守课堂常规！',
      bgColor: 'bg-amber-50 border-amber-200 text-amber-800'
    }
  ];

  const currentCharacter = CHARACTERS.find((c) => c.id === progress.characterId) || CHARACTERS[0];

  return (
    <div className="bg-[#FFFDF6] min-h-screen text-slate-800 flex flex-col font-sans" id="game-app-root">
      {/* Dynamic Sticker Achievement Notification Banner */}
      <AnimatePresence>
        {unlockedStickerNotification && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 border-2 border-yellow-500 font-extrabold px-6 py-3 rounded-full flex items-center gap-2.5 shadow-2xl z-50 text-sm font-sans"
            id="sticker-achievement-notification"
          >
            <Award className="w-5 h-5 text-slate-900 animate-bounce" />
            <span>
              🎉 太厉害了！你打通了新关卡，获得了荣誉大奖章！
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Control Header */}
      <TopBar
        nickname={progress.nickname}
        characterId={progress.characterId}
        points={progress.points}
        stars={progress.stars ?? 2}
        stickerCount={progress.unlockedStickers.length}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveLevelId(null); // return to dashboard view when switching tabs
        }}
        onHomeClick={() => {
          setActiveLevelId(null);
          setActiveTab('lobby');
        }}
        onStickersClick={() => setIsStickerBookOpen(true)}
        onResetClick={handleReset}
      />

      {/* Eye Health Guard Countdown & Manual Control Header Panel */}
      <div className="bg-emerald-50/85 border-b-2 border-emerald-100 py-3 px-4 shadow-inner flex flex-col md:flex-row items-center justify-between gap-3 text-slate-700 font-sans select-none">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl animate-pulse">👁️</span>
            <div>
              <p className="font-black text-emerald-800 flex items-center gap-1.5 leading-none">
                <span>绿野仙踪·爱眼自动监测卫士 已启用</span>
                <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono">active</span>
              </p>
              <p className="text-slate-500 font-semibold mt-1">
                小朋友已经连续游玩了 <strong className="text-indigo-600 font-sans text-xs underline font-black">{Math.floor(sessionSeconds / 60)} 分 {sessionSeconds % 60} 秒</strong> 啦。(累计达 <strong className="text-rose-600 font-extrabold">20 分钟</strong> 自动播放眼保健操动画视频防护机制)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Dev/Demo testing state reset */}
            <button
              onClick={() => {
                SoundManager.playClick();
                setSessionSeconds(1195); // Set to 1195s (19m 55s) so the user can see it auto-trigger in 5 seconds!
              }}
              className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-slate-750 font-semibold rounded-lg text-[10px] cursor-pointer"
              title="一键调至19分55秒，体验5秒后自动弹出做操动画"
            >
              ⏩ 快速调至19分55秒
            </button>
            
            <button
              onClick={() => {
                SoundManager.playClick();
                setIsEyeExercisesOpen(true);
              }}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-full shadow-md hover:scale-102 transition-transform cursor-pointer flex items-center gap-1 text-[11px]"
            >
              🧘 立即做眼保健操
            </button>
          </div>
        </div>
      </div>

      {/* Main Content View Switcher */}
      <main className="flex-1 py-6 px-4 md:px-6 max-w-6xl mx-auto w-full">
        {activeLevelId ? (
          /* Render Active Sub-Game Level */
          <div className="bg-white border-3 border-yellow-250 rounded-3xl p-3 md:p-6 shadow-xl relative min-h-[70vh]">
            {activeLevel?.category === 'pinyin' && (
              <PinyinGame
                levelId={activeLevelId}
                onComplete={handleLevelComplete}
                onBack={() => setActiveLevelId(null)}
              />
            )}
            {activeLevel?.category === 'math' && (
              <MathGame
                levelId={activeLevelId}
                onComplete={handleLevelComplete}
                onBack={() => setActiveLevelId(null)}
              />
            )}
            {activeLevel?.category === 'logic' && (
              <LogicGame
                levelId={activeLevelId}
                onComplete={handleLevelComplete}
                onBack={() => setActiveLevelId(null)}
              />
            )}
            {activeLevel?.category === 'school-life' && (
              <SchoolLifeGame
                levelId={activeLevelId}
                onComplete={handleLevelComplete}
                onBack={() => setActiveLevelId(null)}
              />
            )}
          </div>
        ) : activeTab === 'garden' ? (
          /* Render 🎡 Dream Playgarden Decorator (Gardenscapes Vibe) */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DreamGarden
              stars={progress.stars ?? 2}
              unlockedDecorations={progress.gardenDecorations ?? []}
              onBuildDecoration={handleBuildDecoration}
              nickname={progress.nickname}
            />
          </motion.div>
        ) : activeTab === 'pet' ? (
          /* Render 🐾 Interactive Pet Companionship Home */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MyAdventurePet
              petAdoptState={progress.petAdoptState ?? null}
              foodCount={progress.foodCount ?? 1}
              nickname={progress.nickname}
              stars={progress.stars ?? 2}
              onAdoptPet={(newPetState) => {
                const updated = {
                  ...progress,
                  petAdoptState: newPetState
                };
                saveProgress(updated);
              }}
              onUpdatePetState={(newPetState, foodCost, rewardStars = 0, rewardFood = 0) => {
                const currentFood = progress.foodCount ?? 1;
                const nextFood = Math.max(0, currentFood - foodCost + rewardFood);
                const currentStars = progress.stars ?? 2;
                const nextStars = currentStars + rewardStars;
                const updated = {
                  ...progress,
                  petAdoptState: newPetState,
                  foodCount: nextFood,
                  stars: nextStars
                };
                saveProgress(updated);
              }}
            />
          </motion.div>
        ) : activeTab === 'chat' ? (
          /* Render 💬 AI Dialogue Companion (Dialogue-driven Play) */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AICompanionChat
              characterId={progress.characterId}
              nickname={progress.nickname}
              gardenUnlockedCount={(progress.gardenDecorations ?? []).length}
              onGrantStar={handleGrantStar}
              stars={progress.stars ?? 2}
            />
          </motion.div>
        ) : (
          /* Render Growth Hall (Main Hall Level Selection List) */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
            id="game-lobby-hall"
          >
            {/* Companion Header speech bubbles */}
            <div className="bg-yellow-100/50 border-3 border-yellow-200 rounded-2xl p-4 flex items-center gap-4 relative md:p-5">
              <span className="text-5xl md:text-6xl filter drop-shadow select-none">
                {currentCharacter.avatar}
              </span>
              <div className="font-sans">
                <h2 className="font-sans font-black text-rose-600 text-base md:text-lg">
                  {currentCharacter.name}：
                </h2>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold mt-1">
                  「嗨！小朋友！我们目前累积了{' '}
                  <span className="text-rose-500 font-extrabold text-base">{progress.points}</span>{' '}
                  个智慧点和 <span className="text-amber-500 font-extrabold text-base">{progress.stars ?? 2}</span> 颗亮晶晶星星⭐。我已经为你擦亮了探险指示！你可以去完成挑战，或者点击上方的【梦幻乐园】建造你心爱的大马戏帐篷和彩虹温水流滑梯噢！🐾」
                </p>
              </div>
            </div>

            {/* Grid of Subject Categories & corresponding individual Levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dashboard-categories-grid">
              {categories.map((category) => {
                // Get levels matches this category
                const relevantLevels = GAME_LEVELS.filter((l) => l.category === category.id);

                return (
                  <div
                    key={category.id}
                    className={`border-3 rounded-3xl p-5 md:p-6 shadow-md bg-white ${category.bgColor} flex flex-col justify-between`}
                    id={`category-group-${category.id}`}
                  >
                    <div>
                      <h3 className="text-lg md:text-xl font-sans font-black flex items-center gap-2">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-snug mt-1.5 font-medium font-sans">
                        {category.desc}
                      </p>
                    </div>

                    {/* Levels of this category */}
                    <div className="mt-5 space-y-3">
                      {relevantLevels.map((lvl) => {
                        const isCompleted = progress.unlockedLevels[lvl.id] === true;

                        return (
                          <motion.button
                            key={lvl.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              SoundManager.playClick();
                              setActiveLevelId(lvl.id);
                            }}
                            className={`w-full p-3.5 rounded-xl border-2 flex items-center justify-between transition-all text-left bg-white relative overflow-hidden cursor-pointer ${
                              isCompleted
                                ? 'border-green-300 hover:border-green-400 bg-green-50/20'
                                : 'border-slate-100 hover:border-orange-300'
                            }`}
                            id={`level-selector-btn-${lvl.id}`}
                          >
                            <div className="flex-1 pr-4">
                              <div className="flex items-center gap-2">
                                <span className="font-sans font-black text-sm text-slate-800">
                                  {lvl.title}
                                </span>
                                {isCompleted && (
                                  <span className="text-xs bg-green-100 text-green-700 border border-green-300 font-bold px-1.5 py-0.5 rounded-full font-sans scale-90">
                                    ⭐ 完全通关
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-tight mt-1 line-clamp-1 font-sans">
                                {lvl.description}
                              </p>
                            </div>

                            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-full font-sans border border-amber-200 shrink-0">
                              {isCompleted ? '已通过' : '前往挑战'}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer tips instructions */}
            <div className="text-center font-sans text-[11px] text-slate-400 pt-4 flex flex-col items-center gap-1">
              <p className="flex items-center gap-1 font-medium">
                <Heart className="w-3 h-3 text-red-400 fill-current animate-pulse" />
                <span>爱护宝贝视力：建议每游玩 15 分钟闭眼放松、做眼保健操或远眺哦！</span>
              </p>
              <p>由 幼小衔接智力成长乐园 专为 5~7 岁适龄儿童定制提供 🏫</p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Stickers Album modal */}
      <StickerBook
        unlockedList={progress.unlockedStickers}
        isOpen={isStickerBookOpen}
        onClose={() => setIsStickerBookOpen(false)}
      />

      {/* Eye Health Exercises Guided Overlay */}
      <EyeExercisesOverlay
        isOpen={isEyeExercisesOpen}
        onClose={() => setIsEyeExercisesOpen(false)}
        onReward={handleRewardEyeExercisesComplete}
      />
    </div>
  );
}
