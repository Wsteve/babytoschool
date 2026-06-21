import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Pause, RotateCcw, X, ShieldCheck, Heart, Eye, Volume2, Trophy, Clock } from 'lucide-react';
import { SoundManager } from '../utils/SoundManager';

interface EyeExercisesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: () => void; // Gives Star and Food on fully finishing active exercises
}

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  tip: string;
  animationType: 'circle' | 'updown' | 'leftright' | 'blink' | 'massage';
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: '第一节：睛明穴位轻揉捏',
    subtitle: '双手中指轻轻按压鼻翼两侧的晴名穴，可以缓解看屏幕带来的干涩哦',
    emoji: '👁️',
    tip: '轻轻闭上双眼，跟随企鹅的节拍，呼~ 吸~ 一起转圈揉捏',
    animationType: 'massage'
  },
  {
    id: 2,
    title: '第二节：太空远眺魔法镜',
    subtitle: '把双眼睁大，然后慢慢往远处看，再把视线收回到眼前的指尖',
    emoji: '🔭',
    tip: '视线向最远处的白云看，再看向近处。一近一远，锻炼眼部肌肉！',
    animationType: 'leftright'
  },
  {
    id: 3,
    title: '第三节：转转眼球八宝盘',
    subtitle: '眼球慢慢地向上、向右、向下、向左画圈。就像魔法表盘在转动！',
    emoji: '🌀',
    tip: '顺时针转三圈，逆时针转三圈，让眼部的像素点充满活力！',
    animationType: 'circle'
  },
  {
    id: 4,
    title: '第四节：快速眨眼聚光灯',
    subtitle: '像小星星一样快速眨眼睛，帮助泪腺分泌，润泽受热的眼晶状体',
    emoji: '✨',
    tip: '闭眼，睁眼，眨3下！每天执行本自检指令，屏幕再亮也不怕！',
    animationType: 'blink'
  }
];

export default function EyeExercisesOverlay({ isOpen, onClose, onReward }: EyeExercisesOverlayProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterSeconds, setChapterSeconds] = useState(15); // 15 seconds per exercise chapter
  const [isMuted, setIsMuted] = useState(false);
  const [exerciseFinished, setExerciseFinished] = useState(false);

  // Audio countdown speak synthesis helper
  const sayAloud = (text: string) => {
    if (isMuted) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.05;
        utterance.pitch = 1.35; // friendly pediatric therapist tone
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Announce next chapter whenever chapterIndex changes
  useEffect(() => {
    if (isOpen && !exerciseFinished) {
      const activeCh = CHAPTERS[currentChapterIndex];
      sayAloud(`现在进行 ${activeCh.title}。${activeCh.subtitle}`);
    }
  }, [currentChapterIndex, isOpen, exerciseFinished]);

  // Handle countdown timer inside active chapter
  useEffect(() => {
    if (!isOpen || !isPlaying || exerciseFinished) return;

    const timer = setInterval(() => {
      setChapterSeconds((prev) => {
        if (prev <= 1) {
          // Time to switch chapters
          if (currentChapterIndex < CHAPTER_COUNTS - 1) {
            setCurrentChapterIndex((curr) => curr + 1);
            return 15; // reset seconds for next chapter
          } else {
            // Finished all exercises!
            clearInterval(timer);
            setExerciseFinished(true);
            setIsPlaying(false);
            onReward(); // Send up star and food
            sayAloud('恭喜小主人！你顺利打通了整套眼保健操，眼睛又变得像纯净晶体一样雪亮啦！送你一颗绿意守护星和好吃的罐头！');
            return 0;
          }
        }

        // Count down "一二三四五六七八" voice cue simulation automatically
        const checkCount = prev % 8;
        if (checkCount === 7) sayAloud('一 二 三 四');
        if (checkCount === 3) sayAloud('五 六 七 八');

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentChapterIndex, exerciseFinished]);

  if (!isOpen) return null;

  const CHAPTER_COUNTS = CHAPTERS.length;
  const activeChapter = CHAPTERS[currentChapterIndex];
  const progressPercent = ((currentChapterIndex * 15 + (15 - chapterSeconds)) / (CHAPTER_COUNTS * 15)) * 100;

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto font-sans" id="eye-exercises-module">
      
      {/* Container main interface panel */}
      <div className="bg-gradient-to-b from-[#FAF8EF] to-[#FAF6E6] max-w-2xl w-full rounded-3xl border-4 border-emerald-600 shadow-2xl relative overflow-hidden p-6 md:p-8 flex flex-col justify-between min-h-[580px]">
        
        {/* Decorative corner tag */}
        <div className="absolute right-0 top-0 bg-emerald-600 px-4 py-1.5 font-bold font-mono text-white text-xs rounded-bl-2xl flex items-center gap-1.5 select-none animate-pulse">
          <Clock className="w-3.5 h-3.5" />
          <span>健康防疲劳保护机制中</span>
        </div>

        {/* Top Header Row Panel */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce">👁️</span>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg md:text-xl flex items-center gap-1.5 font-sans">
                <span>爱眼守护：全向眼保健操动画视频指南</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] py-0.5 px-2 rounded-full uppercase tracking-widest font-black">20分提醒</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">连续看屏幕太久啦，跟着智能萌宠一起放松眼部神经吧！</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-stone-200 rounded-full cursor-pointer transition-colors"
            title="关闭休息"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!exerciseFinished ? (
          /* Active Interactive Chapter Player content */
          <div className="flex-1 flex flex-col justify-between py-6">
            
            {/* Display chapter switcher indicators */}
            <div className="flex items-center justify-center gap-2.5 mb-2 select-none">
              {CHAPTERS.map((ch, idx) => {
                const isActive = idx === currentChapterIndex;
                const isPassed = idx < currentChapterIndex;
                return (
                  <div
                    key={ch.id}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-12 bg-emerald-600'
                        : isPassed
                        ? 'w-5 bg-emerald-300'
                        : 'w-2.5 bg-stone-200'
                    }`}
                  />
                );
              })}
            </div>

            {/* Simulated Animated Interactive Screen Box representing Video and Live Mascot guiding */}
            <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden border-3 border-stone-800 flex flex-col items-center justify-center min-h-[250px] shadow-inner text-white select-none">
              
              {/* Scanline CRT layout look */}
              <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none" />

              {/* Decorative target crosshair grids */}
              <div className="absolute w-12 h-12 border-t border-l border-white/20 top-4 left-4" />
              <div className="absolute w-12 h-12 border-t border-r border-white/20 top-4 right-4" />
              <div className="absolute w-12 h-12 border-b border-l border-white/20 bottom-4 left-4" />
              <div className="absolute w-12 h-12 border-b border-r border-white/20 bottom-4 right-4" />

              {/* Countdown counter badge inside glass screen top-right */}
              <div className="absolute top-4 right-4 text-emerald-450 font-mono text-xs bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 flex items-center gap-1">
                <span>剩余时间:</span>
                <strong className="text-yellow-400 text-sm font-black">{chapterSeconds}s</strong>
              </div>

              {/* Animated Eyes Element changing styles responsive to activeChapter */}
              <div className="relative w-44 h-24 flex items-center justify-center gap-8 mb-4">
                
                {/* Simulated Massage Target overlay guide points dynamically triggered */}
                {activeChapter.animationType === 'massage' && (
                  <>
                    <span className="absolute text-rose-500 animate-ping text-xl top-6 font-bold">●</span>
                    <span className="absolute text-yellow-400 text-xs font-mono font-bold bottom-1 translate-y-3">轻揉按压：睛明穴位 (鼻翼上端)</span>
                  </>
                )}

                {/* Left Eye */}
                <motion.div
                  animate={
                    activeChapter.animationType === 'circle'
                      ? { rotate: [360, 0] }
                      : activeChapter.animationType === 'updown'
                      ? { y: [-15, 15, -15] }
                      : activeChapter.animationType === 'blink'
                      ? { scaleY: [1, 0.1, 1, 0.1, 1] }
                      : activeChapter.animationType === 'massage'
                      ? { scale: [0.95, 1.05, 0.95] }
                      : { x: [-22, 22, -22] }
                  }
                  transition={{
                    duration: activeChapter.animationType === 'blink' ? 1.5 : 3.0,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center relative overflow-hidden"
                >
                  {/* Pupil pupil rotating */}
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-cyan-300 absolute top-2 left-2 animate-pulse" />
                  </div>
                </motion.div>

                {/* Right Eye */}
                <motion.div
                  animate={
                    activeChapter.animationType === 'circle'
                      ? { rotate: [360, 0] }
                      : activeChapter.animationType === 'updown'
                      ? { y: [-15, 15, -15] }
                      : activeChapter.animationType === 'blink'
                      ? { scaleY: [1, 0.1, 1, 0.1, 1] }
                      : activeChapter.animationType === 'massage'
                      ? { scale: [0.95, 1.05, 0.95] }
                      : { x: [-22, 22, -22] }
                  }
                  transition={{
                    duration: activeChapter.animationType === 'blink' ? 1.5 : 3.0,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center relative overflow-hidden"
                >
                  {/* Pupil pupil rotating */}
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-cyan-300 absolute top-2 left-2 animate-pulse" />
                  </div>
                </motion.div>
                
              </div>

              {/* Mascot penguin model speech label */}
              <div className="text-center max-w-sm space-y-1.5 z-10 select-text">
                <span className="bg-slate-800 text-[11px] font-mono text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold border border-slate-700">
                  {activeChapter.title}
                </span>
                <p className="text-xs text-stone-200 mt-2 font-semibold font-sans leading-relaxed text-center px-4">
                  {activeChapter.subtitle}
                </p>
                <p className="text-[10px] text-cyan-300 italic font-medium">
                  💡 {activeChapter.tip}
                </p>
              </div>

            </div>

            {/* Video player controller bar (VLC/Mac styling mimicry) */}
            <div className="mt-5 space-y-4">
              
              {/* Real time timeline container slider */}
              <div className="relative">
                <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono font-black">
                  <span>已经跟着做: {Math.max(0, currentChapterIndex * 15 + (15 - chapterSeconds))}s</span>
                  <span>总目标: 60秒</span>
                </div>
              </div>

              {/* Core players triggers */}
              <div className="flex items-center justify-between p-3.5 bg-stone-100 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      SoundManager.playClick();
                      setIsPlaying(!isPlaying);
                    }}
                    className={`py-2 px-4.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-all ${
                      isPlaying
                        ? 'bg-slate-900 text-white hover:bg-slate-950'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 animate-pulse'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>暂停引导播放</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>继续跟着做</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      SoundManager.playClick();
                      setChapterSeconds(15);
                      setCurrentChapterIndex(0);
                      setIsPlaying(true);
                      setExerciseFinished(false);
                      sayAloud('眼保健操重新开始。');
                    }}
                    className="p-2 hover:bg-stone-250 text-slate-650 rounded-lg cursor-pointer transition-colors"
                    title="重新播放整节"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-stone-250 text-slate-600 rounded-lg cursor-pointer flex items-center gap-1 text-xs"
                  >
                    <Volume2 className={`w-4.5 h-4.5 ${isMuted ? 'text-slate-400 opacity-50' : 'text-emerald-600'}`} />
                    <span className="font-mono">{isMuted ? '静音' : '开启配乐语音'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Success complete prize board */
          <div className="flex-1 flex flex-col justify-center items-center py-8 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-yellow-150 border-4 border-yellow-400 flex items-center justify-center text-5xl filter drop-shadow animate-bounce">
              🏆
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-rose-600 font-sans">
                太棒了！你的眼睛已经完成“清凉自检维护”！
              </h4>
              <p className="text-sm text-slate-600 font-semibold max-w-md leading-relaxed mx-auto">
                你成功跟着完成了整套 60秒 的眼保健操。
                这不仅能让睫状肌彻底恢复健康，还自动触发了小主人的守护萌宠极客福利奖励！
              </p>
            </div>

            {/* Glowing awards card board panel */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-400/10 to-orange-500/10 border border-amber-300 w-full max-w-sm grid grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                <span className="text-3xl block">⭐</span>
                <span className="text-xs font-black text-amber-800 block mt-1">+1 乐园星星</span>
                <span className="text-[9px] text-slate-400 block pt-0.5">可用来建造乐园设施</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                <span className="text-3xl block">🥫</span>
                <span className="text-xs font-black text-indigo-800 block mt-1">+1 高能罐头</span>
                <span className="text-[9px] text-slate-400 block pt-0.5">宠物的最爱口粮</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-xs font-mono font-bold cursor-pointer hover:from-emerald-700 hover:to-teal-700 hover:scale-103 shadow-lg transition-transform"
            >
              收下奖励，回到智慧成长乐园！🚀
            </button>
          </div>
        )}

        {/* Safety tips footer */}
        <div className="border-t border-stone-200 pt-4 text-center font-sans text-[11px] text-slate-400 flex items-center justify-center gap-1.5 select-none leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>防近视科普：少用高亮度、每20分钟远眺、多户外运动是预防近视最有效的科学法则！</span>
        </div>

      </div>
    </div>
  );
}
