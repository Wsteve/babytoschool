import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CHARACTERS } from '../utils/gameData';
import { AvatarId } from '../types';
import { SoundManager } from '../utils/SoundManager';

interface AvatarSelectProps {
  onSelect: (nickname: string, charId: AvatarId) => void;
}

export default function AvatarSelect({ onSelect }: AvatarSelectProps) {
  const [nickname, setNickname] = useState('');
  const [selectedId, setSelectedId] = useState<AvatarId>('panda');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = () => {
    SoundManager.playClick();
    const cleanName = nickname.trim();
    if (!cleanName) {
      setErrorMsg('要取一个棒棒的名字才能出发哦！✏️');
      return;
    }
    if (cleanName.length > 8) {
      setErrorMsg('名字太长啦，小学生的名字最好不要超过8个字哦！🏫');
      return;
    }
    onSelect(cleanName, selectedId);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 max-w-2xl mx-auto min-h-[80vh]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-yellow-300 relative overflow-hidden"
        id="avatar-select-card"
      >
        {/* Background playful sun rays decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-yellow-100 opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-sky-100 opacity-60 pointer-events-none" />

        <div className="text-center mb-6">
          <motion.h1 
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            className="text-3xl md:text-4xl font-sans font-bold text-slate-800 tracking-tight flex items-center justify-center gap-2"
          >
            🎒 <span className="text-amber-500">幼小衔接</span>智力成长乐园
          </motion.h1>
          <p className="text-sm md:text-base text-slate-500 mt-2 font-sans">
            你好，小朋友！欢迎来到上学前的大探险，选择你最喜欢的守护小动物吧！
          </p>
        </div>

        {/* Name input */}
        <div className="mb-6 w-full max-w-sm mx-auto">
          <label className="block text-slate-700 font-sans font-bold text-center mb-2 text-base">
            ✍️ 输入你的快乐昵称：
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setErrorMsg('');
            }}
            placeholder="例如：小聪聪、嘟嘟..."
            className="w-full px-4 py-3 border-3 border-teal-300 rounded-full focus:outline-none focus:border-teal-500 text-center text-lg font-bold text-slate-800 bg-teal-50/30 font-sans shadow-inner transition-colors"
          />
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs text-center mt-2 font-medium"
            >
              {errorMsg}
            </motion.p>
          )}
        </div>

        {/* Character cards grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {CHARACTERS.map((char) => {
            const isSelected = selectedId === char.id;
            return (
              <motion.button
                key={char.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  SoundManager.playClick();
                  setSelectedId(char.id);
                }}
                className={`flex flex-col items-center p-4 rounded-2xl border-3 text-left transition-all relative cursor-pointer bg-gradient-to-b ${
                  char.color
                } ${
                  isSelected 
                    ? 'ring-4 ring-amber-400 scale-[1.03] shadow-lg border-amber-400' 
                    : 'opacity-80 border-transparent hover:opacity-100'
                }`}
                id={`char-btn-${char.id}`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 text-lg bg-amber-400 text-white rounded-full p-0.5 shadow-md">
                    ⭐
                  </span>
                )}
                <span className="text-5xl md:text-6xl mb-2 filter drop-shadow-md select-none">
                  {char.avatar}
                </span>
                <span className="font-bold text-base text-slate-800 font-sans mb-1">
                  {char.name}
                </span>
                <span className="text-xs text-slate-600 font-sans leading-tight line-clamp-2 md:line-clamp-none text-center">
                  {char.intro}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Start Adventure button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xl font-bold font-sans rounded-full shadow-lg hover:shadow-xl transition-all border-b-6 border-orange-700 active:border-b-2 cursor-pointer"
            id="start-adventure-btn"
          >
            🌟 开始快乐上学大冒险！
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
