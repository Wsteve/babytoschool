import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STICKERS } from '../utils/gameData';
import { SoundManager } from '../utils/SoundManager';

interface StickerBookProps {
  unlockedList: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function StickerBook({ unlockedList, isOpen, onClose }: StickerBookProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-cream-50 bg-[#FFFDF6] border-5 border-amber-400 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
          id="sticker-book-modal"
        >
          {/* Close button with high feedback */}
          <button
            onClick={() => {
              SoundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold border-2 border-red-300 flex items-center justify-center cursor-pointer transition-colors"
            id="close-sticker-book-btn"
          >
            ✕
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-sans font-black text-amber-600 flex items-center justify-center gap-2">
              📖 我的荣誉小印章本
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-sans">
              太棒了！你已经收集了 <span className="text-amber-500 font-bold">{unlockedList.length}</span>/6 枚神奇勋章！
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STICKERS.map((sticker) => {
              const isUnlocked = unlockedList.includes(sticker.id);

              return (
                <div
                  key={sticker.id}
                  className={`border-3 rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all bg-white relative ${
                    isUnlocked
                      ? 'border-yellow-300 shadow-md bg-yellow-50/20'
                      : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                  id={`sticker-card-${sticker.id}`}
                >
                  <div className="relative mb-2">
                    {/* Glossy radial background for unlocked items */}
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-yellow-200 blur-md rounded-full -z-10 animate-pulse duration-1000" />
                    )}
                    <span
                      className={`text-5xl select-none filter drop-shadow-sm transition-all duration-300 inline-block ${
                        isUnlocked ? 'scale-110 hover:rotate-6' : 'grayscale brightness-75'
                      }`}
                    >
                      {sticker.icon}
                    </span>
                  </div>

                  <h3
                    className={`font-sans font-bold text-sm ${
                      isUnlocked ? 'text-amber-700' : 'text-slate-400'
                    }`}
                  >
                    {sticker.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 leading-tight font-sans">
                    {isUnlocked ? sticker.description : `🔒 提示: ${getLockedHint(sticker.id)}`}
                  </p>

                  {isUnlocked && (
                    <span className="mt-2 text-[10px] bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded-full font-sans font-bold">
                      🎉 已点亮
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                SoundManager.playClick();
                onClose();
              }}
              className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold rounded-full shadow hover:shadow-md cursor-pointer text-sm"
              id="sticker-confirm-btn"
            >
              继续探险！
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function getLockedHint(id: string): string {
  switch (id) {
    case 'first_step':
      return '选择守护小动物开始游戏。';
    case 'pinyin_master':
      return '解开拼音大冒险里的关卡！';
    case 'math_genius':
      return '完成数学乐园的答题关卡！';
    case 'logic_expert':
      return '完成逻辑思维训练关卡！';
    case 'school_star':
      return '完成小学生整理书包与课堂规则练习！';
    case 'perfect_score':
      return '总分收集满 100 分才会奖励噢！';
    default:
      return '继续勇创难关解锁吧！';
  }
}
