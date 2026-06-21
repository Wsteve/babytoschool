import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, BookOpen, RotateCcw, Home, Award } from 'lucide-react';
import { SoundManager } from '../utils/SoundManager';
import { CHARACTERS } from '../utils/gameData';
import { AvatarId } from '../types';

interface TopBarProps {
  nickname: string;
  characterId: AvatarId;
  points: number;
  stars: number;
  stickerCount: number;
  activeTab: 'lobby' | 'garden' | 'pet' | 'chat';
  onTabChange: (tab: 'lobby' | 'garden' | 'pet' | 'chat') => void;
  onHomeClick: () => void;
  onStickersClick: () => void;
  onResetClick: () => void;
}

export default function TopBar({
  nickname,
  characterId,
  points,
  stars,
  stickerCount,
  activeTab,
  onTabChange,
  onHomeClick,
  onStickersClick,
  onResetClick,
}: TopBarProps) {
  const [muted, setMuted] = useState(SoundManager.getMuteState());

  const handleMuteToggle = () => {
    const isMuted = SoundManager.toggleMute();
    setMuted(isMuted);
    SoundManager.playClick();
  };

  const currentCharacter = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];

  return (
    <header className="bg-white border-b-4 border-slate-100 py-3.5 px-4 md:px-6 sticky top-0 z-40 shadow-sm" id="game-topbar">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Avatar & Nickname info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => onTabChange('chat')}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 select-none overflow-hidden shadow-inner cursor-pointer bg-gradient-to-b ${currentCharacter.color}`}
              title="点击找我聊天噢！"
            >
              {currentCharacter.avatar}
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-slate-800 text-sm md:text-base">{nickname}</span>
                <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-300 font-bold px-2 py-0.5 rounded-full font-sans">
                  {currentCharacter.name}守护中
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-sans font-medium">
                🎒 努力成长，准备做优秀的小学生！
              </p>
            </div>
          </div>

          {/* Quick back lobby button for mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => { SoundManager.playClick(); onTabChange('lobby'); }}
              className="p-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 text-xs font-black"
            >
              🏫 关卡
            </button>
            <button
              onClick={() => { SoundManager.playClick(); onTabChange('garden'); }}
              className="p-1.5 bg-emerald-50 border border-emerald-250 rounded-lg text-emerald-700 text-xs font-black"
            >
              🎡 乐园 ({stars}⭐)
            </button>
          </div>
        </div>

        {/* Center: Navigation Tabs for children */}
        <div className="hidden md:flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border-2 border-stone-200/60 shrink-0 select-none">
          <button
            onClick={() => { SoundManager.playClick(); onTabChange('lobby'); onHomeClick(); }}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lobby'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md scale-105'
                : 'text-slate-600 hover:bg-stone-250'
            }`}
          >
            <span>🏫 学习闯关</span>
          </button>
          <button
            onClick={() => { SoundManager.playClick(); onTabChange('garden'); onHomeClick(); }}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'garden'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md scale-105'
                : 'text-slate-600 hover:bg-stone-250'
            }`}
          >
            <span>🎡 梦幻乐园</span>
          </button>
          <button
            onClick={() => { SoundManager.playClick(); onTabChange('pet'); onHomeClick(); }}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pet'
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md scale-105'
                : 'text-slate-600 hover:bg-stone-250'
            }`}
          >
            <span>🐾 萌宠家园</span>
          </button>
          <button
            onClick={() => { SoundManager.playClick(); onTabChange('chat'); onHomeClick(); }}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md scale-105'
                : 'text-slate-600 hover:bg-stone-250'
            }`}
          >
            <span>💬 守护树洞</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </button>
        </div>

        {/* Right: Scores Tracker & Utilities */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          {/* Points & Stars counters */}
          <div className="flex items-center gap-3 bg-teal-50 border-2 border-teal-150 px-3.5 py-1.5 rounded-full shadow-inner select-none shrink-0">
            <div className="flex items-center gap-1 font-sans font-black text-teal-700 text-xs md:text-sm">
              ✨
              <span>成长值 {points}</span>
            </div>
            <div className="w-px h-4 bg-teal-200" />
            
            <div className="flex items-center gap-1 font-sans font-black text-amber-600 text-xs md:text-sm animate-pulse">
              ⭐
              <span>星星 {stars}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-sans">
            {/* Sound Mute widget */}
            <button
              onClick={handleMuteToggle}
              className="p-2 bg-slate-50 hover:bg-slate-150 text-slate-700 rounded-full border border-slate-200 shadow-sm cursor-pointer transition-colors"
              title={muted ? '开启拼音音效' : '静音'}
              id="audio-toggle-btn"
            >
              {muted ? <VolumeX className="w-4.5 h-4.5 text-red-500 animate-pulse" /> : <Volume2 className="w-4.5 h-4.5 text-teal-600" />}
            </button>

            {/* Sticker display */}
            <button
              onClick={() => {
                SoundManager.playClick();
                onStickersClick();
              }}
              className="p-2 bg-slate-50 hover:bg-slate-150 text-slate-700 rounded-full border border-slate-200 shadow-sm cursor-pointer transition-colors flex items-center gap-1"
              id="manual-view-stickers-btn"
              title="查看奖章本"
            >
              <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">{stickerCount}个奖章</span>
            </button>

            {/* Reset progress */}
            <button
              onClick={() => {
                if (window.confirm('小朋友，确定要重新开始所有的大冒险吗？进度和收集的奖章、星星、游乐园都会重置哦！')) {
                  SoundManager.playClick();
                  onResetClick();
                }
              }}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full border border-red-200 shadow-sm cursor-pointer transition-colors"
              id="reset-all-btn"
              title="重置游戏进度"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile-only Navigation Tabs (sticky bottom or topbar extensions) */}
      <div className="md:hidden flex items-center justify-around gap-1 bg-stone-50 border-t border-stone-200/50 mt-1 pt-1.5 w-full select-none">
        <button
          onClick={() => { SoundManager.playClick(); onTabChange('lobby'); onHomeClick(); }}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-black transition-all ${
            activeTab === 'lobby' ? 'bg-indigo-100 text-indigo-700 font-extrabold' : 'text-slate-500'
          }`}
        >
          🏫 学习闯关
        </button>
        <button
          onClick={() => { SoundManager.playClick(); onTabChange('garden'); onHomeClick(); }}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-black transition-all ${
            activeTab === 'garden' ? 'bg-emerald-100 text-emerald-700 font-extrabold' : 'text-slate-500'
          }`}
        >
          🎡 乐园
        </button>
        <button
          onClick={() => { SoundManager.playClick(); onTabChange('pet'); onHomeClick(); }}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-black transition-all ${
            activeTab === 'pet' ? 'bg-rose-100 text-rose-700 font-extrabold' : 'text-slate-500'
          }`}
        >
          🐾 萌宠
        </button>
        <button
          onClick={() => { SoundManager.playClick(); onTabChange('chat'); onHomeClick(); }}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-black transition-all relative ${
            activeTab === 'chat' ? 'bg-amber-100 text-amber-700 font-extrabold' : 'text-slate-500'
          }`}
        >
          💬 树洞
        </button>
      </div>

    </header>
  );
}
