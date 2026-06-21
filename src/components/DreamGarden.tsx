import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, CheckCircle, Lock, HelpCircle, Hammer } from 'lucide-react';
import { SoundManager } from '../utils/SoundManager';
import { GardenItem } from '../types';
import { GARDEN_ITEMS } from '../utils/gameData';

interface DreamGardenProps {
  stars: number;
  unlockedDecorations: string[];
  onBuildDecoration: (id: string, cost: number, name: string) => void;
  nickname: string;
}

export default function DreamGarden({
  stars,
  unlockedDecorations = [],
  onBuildDecoration,
  nickname,
}: DreamGardenProps) {

  // Handle building item
  const handleBuild = (item: GardenItem) => {
    if (unlockedDecorations.includes(item.id)) {
      // Already built - play easter egg sound
      SoundManager.playCorrect();
      toastCelebration(item.name, item.unlockedLevelMsg);
      return;
    }

    if (stars < item.cost) {
      // Not enough stars - warning sound
      SoundManager.playIncorrect();
      alert(`哎呀，星星不够噢！建设「${item.name}」需要 ${item.cost} 颗星星⭐，快去通过闯关或与小动物聊天回答问题来赚取星星吧！`);
      return;
    }

    // Spend stars and build
    onBuildDecoration(item.id, item.cost, item.name);
    SoundManager.playFanfare();
    
    // Vocal synthesis celebration!
    speakAloud(`哇！祝贺你！${nickname}！你成功花费了${item.cost}颗亮晶晶星，建成了：${item.unlockedLevelMsg}`);
  };

  const speakAloud = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.9;
        utterance.pitch = 1.25; // cute, friendly voice pitches
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech Synthesis failed:", e);
    }
  };

  const toastCelebration = (name: string, msg: string) => {
    speakAloud(`这是你建造的：${name}！${msg}`);
  };

  return (
    <div className="space-y-8" id="dream-garden-playground">
      {/* Garden Header Pitch Block */}
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 text-9xl translate-x-12 -translate-y-8 opacity-25 select-none pointer-events-none">
          🎡
        </div>
        <div className="relative z-10 max-w-2xl font-sans">
          <span className="bg-white/20 text-xs text-emerald-100 border border-white/30 font-black px-3 py-1 rounded-full uppercase tracking-wider">
            ✨ 梦幻建造专区 (Gardenscapes Vibe)
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 font-sans tracking-tight">
            🎉 {nickname} 的梦幻成长乐园大花园！
          </h2>
          <p className="text-xs md:text-sm text-emerald-100 font-semibold mt-2 leading-relaxed">
            小宝贝，每当你完成一个闯关任务，或者和守护动物聊天回答对了问题，都会获得超级宝贵的 <span className="text-yellow-300 text-base font-extrabold">⭐ 亮晶晶星星</span> 噢！用星星来购买高级滑梯、旋转秋千和城堡，装点你心目中最棒的未来小学乐园吧！
          </p>
        </div>
      </div>

      {/* Grid: 1. Big Visual Playground Area, 2. Item Store shop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (SPAN 7): Big Visual Sandbox Canvas Landscape */}
        <div className="lg:col-span-7 bg-sky-100 border-4 border-emerald-250 rounded-3xl p-4 md:p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[440px]">
          {/* Sky elements */}
          <div className="absolute top-4 left-6 flex gap-12 select-none pointer-events-none">
            <span className="text-4xl opacity-40 animate-pulse">☁️</span>
            <span className="text-3xl opacity-30">☁️</span>
          </div>
          <div className="absolute top-6 right-10 flex gap-4 select-none pointer-events-none">
            <span className="text-5xl text-yellow-300 animate-spin" style={{ animationDuration: '40s' }}>☀️</span>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <span className="bg-sky-200/60 text-sky-800 border border-sky-300/50 text-[10px] md:text-xs font-black px-3 py-1 rounded-full">
              🌳 乐园实景俯瞰大沙盘
            </span>
            <div className="bg-yellow-400 text-slate-900 font-extrabold px-3 py-1.5 rounded-full text-xs shadow-md border-2 border-yellow-500 flex items-center gap-1">
              <span>🌟 已落成: {unlockedDecorations.length} / {GARDEN_ITEMS.length} 处建筑</span>
            </div>
          </div>

          {/* Isometric Landscape Meadow 草坪区域 */}
          <div className="relative flex-1 my-4 bg-emerald-400 border-t-8 border-emerald-500 rounded-2xl min-h-[260px] shadow-inner p-3 flex flex-wrap items-center justify-center gap-4 align-middle overflow-visible">
            {unlockedDecorations.length === 0 ? (
              <div className="text-center p-6 text-white max-w-sm mx-auto font-sans">
                <span className="text-5xl animate-bounce block">🌱</span>
                <h4 className="text-sm font-black mt-3">乐园里目前静悄悄的噢...</h4>
                <p className="text-[11px] text-emerald-100 mt-1">
                  空荡荡的草坪正在呼唤着缤纷的大玩具！快在右侧商店里花费星星解锁花坛、滑滑梯或者气球大拱门吧！
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 w-full h-full max-w-lg items-center relative overflow-visible pt-4">
                {GARDEN_ITEMS.map((item) => {
                  const isBuilt = unlockedDecorations.includes(item.id);
                  if (!isBuilt) return null;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0, y: 50 }}
                      animate={{ scale: 1, y: 0, type: 'spring', stiffness: 100 }}
                      whileHover={{ scale: 1.15, rotate: [0, -3, 3, 0] }}
                      onClick={() => toastCelebration(item.name, item.unlockedLevelMsg)}
                      className="flex flex-col items-center justify-center bg-white/90 hover:bg-white border-2 border-emerald-300 hover:border-yellow-400 cursor-pointer rounded-xl p-2 shadow-lg transition-transform relative group overflow-visible"
                      title="点击看我的惊喜！"
                    >
                      {/* Floating Particle animation icon */}
                      <span className="text-4xl filter drop-shadow select-none animate-bounce" style={{ animationDuration: `${2 + Math.random() * 2}s` }}>
                        {item.icon}
                      </span>
                      <span className="text-[10px] font-black text-emerald-700 select-none truncate w-full text-center mt-1">
                        {item.name}
                      </span>

                      {/* Build Success Sparkle Accent */}
                      <div className="absolute -top-1 -right-1 bg-yellow-400 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                        ⭐
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-sky-200/40 text-sky-850 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-semibold leading-relaxed font-sans text-center">
            💡 <span className="underline">小秘诀</span>：双击或点击上面任何一个已建好的大道具，都能听到守护伙伴的语音夸奖，并看它跳起扭扭舞哦！
          </div>
        </div>

        {/* Right Column (SPAN 5): Decoration Store/Shop items */}
        <div className="lg:col-span-5 bg-white border-3 border-emerald-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5 font-sans">
                🛍️ 梦幻建材星光百货店
              </h3>
              <div className="flex items-center gap-1 text-sm font-black bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-600">
                <span>⭐ 星星:</span>
                <span className="text-base">{stars}</span>
              </div>
            </div>

            {/* List of Store items */}
            <div className="mt-4 space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {GARDEN_ITEMS.map((item) => {
                const isBuilt = unlockedDecorations.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 justify-between transition-all ${
                      isBuilt
                        ? 'border-emerald-250 bg-emerald-50/25'
                        : 'border-stone-100 hover:border-yellow-200 bg-stone-50/30'
                    }`}
                  >
                    <div className="text-3xl select-none">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-800">{item.name}</span>
                        {isBuilt && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold px-1.5 py-0.5 rounded-full scale-90">
                            已落成
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug mt-1 font-sans">
                        {item.description}
                      </p>
                    </div>

                    {isBuilt ? (
                      <button
                        onClick={() => toastCelebration(item.name, item.unlockedLevelMsg)}
                        className="px-2.5 py-1.5 text-[10px] font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl cursor-pointer border border-emerald-300"
                      >
                        看我的！
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuild(item)}
                        className={`px-3 py-2 text-[10.5px] font-extrabold rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1 shrink-0 ${
                          stars >= item.cost
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 border border-yellow-500 hover:scale-105'
                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                        }`}
                      >
                        <Hammer className="w-3 h-3" />
                        <span>建造 ({item.cost}⭐)</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-150 p-2.5 rounded-xl mt-4 flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <p className="text-[10px] text-slate-600 leading-normal font-medium font-sans">
              <strong>乐园守则</strong>：建造更多高阶设施，除了在草坪直接显示，还会帮你达成“全能梦幻乐园设计师”的隐藏奖章噢！
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
