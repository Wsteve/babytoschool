import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Check, Edit2, ShieldAlert, Heart, Calendar, ArrowRight, Lock, Volume2, Code, Terminal, Zap, Flame, Gift } from 'lucide-react';
import { SoundManager } from '../utils/SoundManager';
import { UserPetState, PetTemplate } from '../types';
import { PET_TEMPLATES } from '../utils/gameData';

interface MyAdventurePetProps {
  petAdoptState: UserPetState | null;
  foodCount: number;
  onAdoptPet: (state: UserPetState) => void;
  onUpdatePetState: (state: UserPetState, foodCost: number, rewardStars?: number, rewardFood?: number) => void;
  nickname: string;
  stars?: number;
}

interface CoinParticle {
  id: number;
  emoji: string;
  tx: number; // Target x translation offset
  ty: number; // Target y translation offset
  scale: number;
  rotate: number;
}

export default function MyAdventurePet({
  petAdoptState,
  foodCount = 0,
  onAdoptPet,
  onUpdatePetState,
  nickname,
  stars = 2,
}: MyAdventurePetProps) {
  // Adoption form states
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('linux_penguin');
  const [customPetName, setCustomPetName] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  // Floating text action status bubbles
  const [bubbleText, setBubbleText] = useState<string>('');
  const [isWiggling, setIsWiggling] = useState(false);

  // Unix/Linux command output state simulation
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'systemd[1]: Initializing Apple-Linux PM Kernel...',
    'systemd[1]: Loaded Pet-M5 coprocessor successfully.',
    'guest@apple-silicon:~$ ./check_happiness.sh'
  ]);

  // Physical particles for explosive coin bursts (爆金币!)
  const [coinParticles, setCoinParticles] = useState<CoinParticle[]>([]);
  const [particleCounter, setParticleCounter] = useState(0);

  const selectedTemplate = PET_TEMPLATES.find((p) => p.id === selectedTemplateId) || PET_TEMPLATES[0];
  const activePetTemplate = petAdoptState
    ? PET_TEMPLATES.find((p) => p.id === petAdoptState.templateId) || PET_TEMPLATES[0]
    : null;

  // Track today's local date code
  const todayStr = new Date().toLocaleDateString('zh-CN');

  const speakAloud = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.05;
        utterance.pitch = 1.4; // Cute children high-frequency geeky voice
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Trigger explosive gold coins / stars rewards ("爆金币" physics)
  const triggerGoldCoinBurst = (source: string) => {
    SoundManager.playFanfare();
    
    // Generate 15 explosive particles flying randomly outward
    const emojis = ['🪙', '⭐', '🥫', '💎', '✨', '🍎', '⚡', '🎋', '🍓'];
    const newParticles: CoinParticle[] = [];
    let currentId = particleCounter;

    for (let i = 0; i < 18; i++) {
      // Random vectors in all directions
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 120;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 40; // biased upward
      
      newParticles.push({
        id: currentId++,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        tx,
        ty,
        scale: 0.8 + Math.random() * 0.8,
        rotate: -180 + Math.random() * 360,
      });
    }

    setCoinParticles(newParticles);
    setParticleCounter(currentId);

    // Give random rewards into core memory!
    const rewardS = Math.floor(Math.random() * 2) + 1; // 1 to 2 gold stars
    const rewardF = Math.floor(Math.random() * 2) + 1; // 1 to 2 gourmet food cans

    if (petAdoptState) {
      // Trigger update on state directly adding rewards to parent state!
      onUpdatePetState(petAdoptState, 0, rewardS, rewardF);
    }

    // Update terminal output simulation lines with cute feedback
    const logs = [
      `guest@apple-silicon:~$ sudo apt-get build-reward --force`,
      `[SUCCEEDED] Coin extraction database sync OK.`,
      `[REWARD] Granting: +${rewardS}⭐ Stars, +${rewardF}🥫 Nutrient Foods!`,
      `[STATUS] Happiness level: 100% (Explosive Gold Coins Burst!)`
    ];

    setTerminalHistory((prev) => [...prev.slice(-4), ...logs]);
    
    const bannerMsg = `
    🎉 哗啦啦！【${petAdoptState?.customName}】给你大肆【爆金币】啦！
    🌟 掉落得：+${rewardS}个金色闪亮星星，+${rewardF}个高能成长罐头！
    快快拿去升级，或去梦幻乐园建设新城堡吧！`;
    setBubbleText(bannerMsg);
    speakAloud(`好耶！超级终端指令执行成功！爆金币啦！恭喜你获得闪耀星星和高能罐头！`);

    // Clean up particles after short delay
    setTimeout(() => {
      setCoinParticles([]);
    }, 1200);
  };

  // Perform Adoption creation
  const handleAdoptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customPetName.trim() || `小${selectedTemplate.name.replace('小', '').replace('大', '')}`;
    SoundManager.playFanfare();

    const initialState: UserPetState = {
      templateId: selectedTemplate.id,
      customName: finalName,
      level: 1,
      exp: 0,
      lastFedDate: null,
      clockedInDates: [],
    };

    onAdoptPet(initialState);
    speakAloud(`恭喜！领养成功！你的极简苹果风守护萌宠【${finalName}】顺利连入 Linux 容器！快给它装配命令吧！`);
    setBubbleText(`哇！运行环境 OK！我是你的专属 Linux 守护宠【${finalName}】！输入命令，我们一起升到 60 级吧！`);
  };

  // Tickle/Interact action with the pet
  const handleTickle = () => {
    if (!petAdoptState || !activePetTemplate) return;
    setIsWiggling(true);
    SoundManager.playCorrect();

    const funPhrases = [
      `[Tux Shell] 哈哈哈！我的全铝合金外壳导热性真好，摸起来好舒服！`,
      `[M5 Process Check] 今天有朗读声母吗？我的后台显示你的声音格外动听！`,
      `[Debian Console] 正在构建幸福守护包... 小主人，写代码和学速算一样酷哦！`,
      `[Apple design] 你今天在乐园建设了什么建筑？我会每天帮你值班放哨的！`,
      `[System check] 快跟我说一声“sudo 爆金币”，让我给你送满屏的大金元宝！`,
      `警告：过于机智的小主人正在捏我的小鼻子！发出嘀嘀嘀可爱预警信号！`
    ];

    const randomWord = funPhrases[Math.floor(Math.random() * funPhrases.length)];
    setBubbleText(randomWord);
    speakAloud(randomWord);

    // Keep terminal updated
    setTerminalHistory((prev) => [
      ...prev.slice(-5),
      `guest@apple-silicon:~$ ./tickle_pet.sh`,
      `[Pet Response]: "${randomWord.substring(0, 30)}..."`
    ]);

    setTimeout(() => {
      setIsWiggling(false);
    }, 1000);
  };

  // Clock-in Daily Task completing
  const handleDailyClockIn = () => {
    if (!petAdoptState) return;

    const lockedIn = petAdoptState.clockedInDates || [];
    if (lockedIn.includes(todayStr)) {
      SoundManager.playIncorrect();
      alert(`哎呀，小主人！你今天已经参与过“学习打卡”并领到好吃的了噢！明天我们继续加油！`);
      return;
    }

    SoundManager.playCorrect();
    const nextClockDates = [...lockedIn, todayStr];
    
    // Add 1 canned Nutrient Food immediately to inventory
    const updatedState: UserPetState = {
      ...petAdoptState,
      clockedInDates: nextClockDates,
    };

    onUpdatePetState(updatedState, -2); // -2 means add 2 foods directly as reward for learning!
    
    setTerminalHistory((prev) => [
      ...prev.slice(-5),
      `guest@apple-silicon:~$ sudo checkin --today=${todayStr}`,
      `[Success] learning task verified!`,
      `[Inventory Update] foodCount += 2`
    ]);

    const message = `🎯 打卡成功！你完成了今日的拼音与数学健康打卡！成功领用 2 箱【⭐ 雷电高能罐头】！`;
    setBubbleText(message);
    speakAloud(`打卡成功！小主人太棒了！你的 Linux 萌宠向你致敬，并自动派发了两盒能量！`);
  };

  // Feed the adopted pet to grow up exactly by 1 level
  const handleFeedPetOneLevel = () => {
    if (!petAdoptState || !activePetTemplate) return;

    if (foodCount <= 0) {
      SoundManager.playIncorrect();
      alert(`哎呀，小主人！手里没有成长营养罐头啦！\n\n快在下方点击「📅 今日学习打卡」或挑战上方的“拼音/数学/准备小学生关卡”来赢得好吃的罐头吧！`);
      return;
    }

    if (petAdoptState.level >= 60) {
      SoundManager.playCorrect();
      alert(`哇！你的伙伴【${petAdoptState.customName}】已经达到了满级 60 级啦！它已经是全乐园最厉害的心智守护神鸟！`);
      return;
    }

    SoundManager.playFanfare();
    const nextLevel = petAdoptState.level + 1;
    
    const updatedState: UserPetState = {
      ...petAdoptState,
      level: nextLevel,
      lastFedDate: todayStr,
    };

    // Deduct 1 food 
    onUpdatePetState(updatedState, 1);

    setTerminalHistory((prev) => [
      ...prev.slice(-5),
      `guest@apple-silicon:~$ ./feed_pet.sh --food=${activePetTemplate.favoriteFoodName}`,
      `[Growing] level upgrading: ${petAdoptState.level} -> ${nextLevel}`,
      `[M5 CPU status] thermal healthy. Ready for next step.`
    ]);

    const levelMsg = `
    😋 唔姆唔姆！太解馋了！【${petAdoptState.customName}】吞下了一个高级罐头！
    🚀 系统提示：等成长等级直接升到 [ ${nextLevel} ] 级啦！`;

    setBubbleText(levelMsg);
    speakAloud(`太好吃了！感谢小主人的投喂，我的等级已成功攀升至第 ${nextLevel} 级！满级 60 级指日可待！`);
  };

  // Update customization nickname
  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petAdoptState || !renameInput.trim()) return;
    SoundManager.playClick();

    const updatedState: UserPetState = {
      ...petAdoptState,
      customName: renameInput.trim(),
    };

    onAdoptPet(updatedState); // Overwrite same info with next custom name
    setIsRenaming(false);

    setTerminalHistory((prev) => [
      ...prev.slice(-5),
      `guest@apple-silicon:~$ rename --target="${renameInput.trim()}"`,
      `[Success] hostname changed to ${renameInput.trim()}`
    ]);

    speakAloud(`你好呀！我是你的新名字：${renameInput.trim()}！`);
    setBubbleText(`新指令生效！以后我的专属代码名字就是【${renameInput.trim()}】啦！`);
  };

  // If pet is NOT yet adopted - Render Gorgeous Initial Adoption Selection Center
  if (!petAdoptState) {
    return (
      <div className="space-y-8" id="pet-adopt-setup-screen">
        {/* Colorful adoption welcoming header */}
        <div className="bg-gradient-to-r from-slate-900 via-stone-800 to-slate-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-2 border-stone-700/50">
          <div className="absolute right-0 top-0 text-9xl translate-x-12 -translate-y-8 opacity-20 select-none pointer-events-none font-mono">
            #!/bin/sh
          </div>
          <div className="relative z-10 max-w-2xl font-sans">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-xs text-slate-950 font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              💻 Apple Industrial Design × Linux OpenSource
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-3 font-sans tracking-tight">
              🛠️ 签发属于你的 “太空极客” 智能萌宠！
            </h2>
            <p className="text-xs md:text-sm text-stone-300 font-semibold mt-2.5 leading-relaxed">
              这是专为未来一年级小学生设计的高科技 Linux 智能机件伴侣！
              我们融合了 <strong className="text-amber-400">Apple 极致简约铝合金美学</strong> 与 <strong className="text-cyan-400">Unix 开源极客精神</strong>。
              只要坚持每天完成听读自主学习打卡，就可以投喂高能量棒，<strong className="text-yellow-400">最高可直接跃升 60 级大满贯</strong>！而且极易触发“爆金币”彩蛋，大把大把撒下星星碎片！
            </p>
          </div>
        </div>

        {/* Outer adoption catalog row blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Select animal options catalog */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-black text-slate-700 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-500" />
              <span>选择你的高科技芯片守护兽：</span>
              <span className="text-xs font-normal text-slate-400">（点击查看配置参数）</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PET_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <motion.div
                    key={tmpl.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    onClick={() => {
                      SoundManager.playClick();
                      setSelectedTemplateId(tmpl.id);
                    }}
                    className={`p-4 rounded-3xl border-3 text-left cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-slate-800 bg-gradient-to-r from-stone-50 to-stone-100/50 shadow-lg ring-4 ring-slate-100'
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-5xl filter drop-shadow select-none animate-pulse mt-1">
                      {tmpl.emoji}
                    </span>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-black text-slate-850 block flex items-center gap-1">
                        <span>{tmpl.name}</span>
                        {isSelected && <span className="bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded-md font-mono">Selected</span>}
                      </span>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                        {tmpl.intro}
                      </p>
                      <span className="text-[9px] text-slate-400 font-sans block pt-0.5">
                        主要燃料: {tmpl.favoriteFoodEmoji} {tmpl.favoriteFoodName}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Adoption Naming Certificate Card (Right Col) */}
          <div className="lg:col-span-5 bg-white border-4 border-dashed border-slate-300 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 bg-stone-105 border-b border-l border-stone-200 px-3 py-1 font-mono text-[9px] text-slate-400 rounded-bl-xl uppercase">
              CONFIDENTIAL // M5
            </div>

            <div className="text-center pb-4 border-b border-slate-150">
              <span className="text-3xl">💻</span>
              <h4 className="text-base font-black text-slate-800 mt-1 font-sans">
                智力成长终端 · 智能设备激活书
              </h4>
              <p className="text-[9px] text-slate-450 font-mono mt-1 uppercase">
                COPROCESSOR COMPANION ACTIVATION SHEET
              </p>
            </div>

            <form onSubmit={handleAdoptSubmit} className="mt-4 space-y-4 font-sans">
              
              {/* Pet preview display detail panel */}
              <div className={`p-4 rounded-2xl bg-gradient-to-b ${selectedTemplate.color} text-center relative overflow-hidden`}>
                <span className="text-6xl filter drop-shadow block animate-bounce">
                  {selectedTemplate.emoji}
                </span>
                <span className="inline-block bg-slate-900/10 text-[10px] font-black text-slate-800 px-3 py-1 rounded-full mt-3">
                  「原厂代号：{selectedTemplate.name}」
                </span>
                <p className="text-[11px] font-semibold leading-relaxed mt-2 p-1 text-slate-900 bg-white/40 rounded-xl backdrop-blur-sm border border-white/50">
                  {selectedTemplate.intro}
                </p>
              </div>

              {/* Enter custom nickname label input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-slate-500" />
                  <span>给萌宠配置你的个性化 Hostname (名字)：</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={customPetName}
                  onChange={(e) => setCustomPetName(e.target.value)}
                  placeholder="如：Tux-OS、Cyber-Panda、M5-Kitten 🐾"
                  className="w-full bg-stone-50 border-2 border-stone-200 hover:border-slate-400 focus:border-slate-800 focus:bg-white p-3 rounded-2xl text-xs font-mono font-bold outline-none transition-all shadow-inner"
                />
                <span className="text-[10px] text-slate-450 block leading-tight">
                  温馨提示：不写的话，我们就会默认直接装载官方原装名作为系统主机名哦！
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-slate-900 to-stone-850 hover:from-slate-950 hover:to-stone-900 text-white font-mono font-black text-xs p-3.5 rounded-2xl cursor-pointer shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-1.5"
              >
                <span>🚀 装载驱动，激活我的 AI 萌宠</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Active dates count (study clock-ins)
  const totalClockInDays = petAdoptState.clockedInDates
    ? petAdoptState.clockedInDates.length
    : 0;

  const isAlreadyClockInToday = (petAdoptState.clockedInDates || []).includes(todayStr);

  // Adopted state - Render Interactive Pet Playground Panel
  return (
    <div className="space-y-6 relative" id="pet-caring-dashboard">
      
      {/* Absolute container rendered above for explosively flying coins */}
      <div className="absolute inset-x-0 top-20 flex justify-center pointer-events-none z-50">
        <AnimatePresence>
          {coinParticles.map((pt) => (
            <motion.div
              key={pt.id}
              initial={{ x: 0, y: 120, opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{
                x: pt.tx,
                y: pt.ty - 120,
                opacity: 0,
                scale: pt.scale,
                rotate: pt.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="absolute text-5xl select-none filter drop-shadow-md"
            >
              {pt.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans">
        
        {/* Left Column (SPAN 7) Interactive Apple-Designed Linux Cabin */}
        <div className="lg:col-span-7 bg-stone-100 border-4 border-stone-200/80 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[490px] font-sans">
          
          {/* Subtle Linux container chassis reflections inside background */}
          <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none select-none z-0" />

          {/* Top Cabin Window bar (Mac style window button bar) */}
          <div className="relative z-10 flex items-center justify-between border-b border-stone-250 pb-3">
            <div className="flex items-center gap-1.5">
              {/* Retro Apple Window dots */}
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-600 block shadow-inner" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500 block shadow-inner" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600 block shadow-inner" />
              <span className="text-xs font-mono font-bold text-slate-500 ml-2 bg-stone-200 px-2.5 py-0.5 rounded-lg select-none">
                petOS@instance-0
              </span>
            </div>

            {/* Level bubble badge */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white border-2 border-slate-700 font-mono font-bold text-xs px-3 py-1 rounded-xl shadow-lg flex items-center gap-1 ml-auto">
              <span className="text-cyan-400">LV.{petAdoptState.level}</span>
              <span className="text-[10px] text-slate-450 font-normal">/ 60</span>
            </div>
          </div>

          {/* Interactive Core: Center Stage featuring active pet with tickling bubbles */}
          <div className="relative flex-1 flex flex-col items-center justify-center py-6">
            
            {/* Background glowing minimalist ring */}
            <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-slate-300 to-stone-400 blur-3xl opacity-20 select-none pointer-events-none z-0" />

            {/* Dialogue bubble display */}
            <AnimatePresence mode="wait">
              {bubbleText ? (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="bg-slate-900 text-slate-100 font-mono border-2 border-stone-605 rounded-2xl py-2.5 px-4 shadow-xl text-xs relative max-w-sm mb-4 z-10"
                >
                  <span className="whitespace-pre-line leading-relaxed block text-center text-cyan-300 font-mono">
                    {bubbleText}
                  </span>
                  {/* Bubble arrow pointing down */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-900" />
                </motion.div>
              ) : (
                <div className="bg-slate-950 text-emerald-400 border border-emerald-800 border-dashed rounded-full px-4 py-1 text-[10px] font-mono tracking-wider mb-4 z-10 shadow-inner flex items-center gap-1.5 animate-pulse">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span> guest@apple-silicon:~$ click --me-to-tickle </span>
                </div>
              )}
            </AnimatePresence>

            {/* Mascot Avatar Element with responsive bounce/wiggle click animation */}
            <motion.div
              animate={
                isWiggling
                  ? {
                      scale: [1, 1.25, 0.9, 1.15, 1],
                      rotate: [0, -10, 10, -6, 0],
                      y: [0, -40, 0],
                    }
                  : {
                      y: [0, -8, 0],
                    }
              }
              transition={
                isWiggling
                  ? { duration: 0.65 }
                  : { duration: 4.0, repeat: Infinity, ease: 'easeInOut' }
              }
              onClick={handleTickle}
              className="relative cursor-pointer group z-10 select-none pb-2 mt-2"
              title="挠我手心，蹭蹭我的全解压外壳！"
            >
              {/* Giant mascot emoji with subtle metallic inner glow shadow drop */}
              <span className="text-8.5xl md:text-9.5xl filter drop-shadow-2xl block select-none group-hover:scale-105 active:scale-95 transition-transform duration-100">
                {activePetTemplate?.emoji}
              </span>

              {/* Mascot shadow reflecting on clean ground floor */}
              <div className="w-24 h-2.5 bg-stone-900/10 rounded-full mx-auto blur-md scale-90 animate-pulse mt-1" />
            </motion.div>

            {/* Device tag name label banner wrapper */}
            <div className="mt-2 text-center z-10">
              <span className="bg-white/80 border border-stone-300 rounded-full py-1 px-3 inline-flex items-center gap-1.5 text-xs font-mono text-slate-800 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>主机：</span>
                <span className="font-extrabold text-slate-950">{petAdoptState.customName}</span>
                <button
                  onClick={() => {
                    setRenameInput(petAdoptState.customName);
                    setIsRenaming(true);
                    SoundManager.playClick();
                  }}
                  className="p-1 hover:bg-stone-200 rounded text-slate-450 cursor-pointer ml-1"
                  title="修改 Hostname"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </span>
            </div>

            {/* Easy Coin Explosion Trigger (爆金币!) Super premium button */}
            <div className="mt-4 z-10 flex flex-col items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => triggerGoldCoinBurst('tap')}
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-mono font-black text-xs px-6 py-3 rounded-2xl cursor-pointer shadow-lg border border-yellow-400 flex items-center gap-2 animate-bounce hover:animate-none"
              >
                <Flame className="w-4.5 h-4.5 text-slate-950 animate-pulse" />
                <span>👉 Sudo 爆金币 (大放血领星星!)</span>
                <Sparkles className="w-4 h-4 text-slate-950" />
              </motion.button>
              <span className="text-[10px] text-slate-450 font-medium font-sans">
                提示：点此一键“爆金币”，随机喷出海量 ⭐ 星星 与 🥫 营养液！
              </span>
            </div>

          </div>

          {/* Linux Interactive Live Output History Terminal Screen (Extremely Cool for kids!) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 mb-2 font-mono text-[10px] md:text-xs text-emerald-400 font-medium space-y-1 relative max-h-[140px] overflow-y-auto z-10 shadow-inner">
            <div className="absolute right-3.5 top-2 py-0.5 px-1.5 bg-slate-850 rounded border border-slate-800 text-[9px] text-slate-500">
              Terminal stdout
            </div>
            {terminalHistory.map((line, idx) => (
              <div key={idx} className="leading-5 break-all">
                {line.startsWith('guest@') ? (
                  <span className="text-cyan-400">{line}</span>
                ) : line.startsWith('[Success]') || line.startsWith('[REWARD]') ? (
                  <span className="text-yellow-300">{line}</span>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Right Column (SPAN 5) Growth Shop - FEEDING, LEVEL UP & LEARNING CERTIFICATE */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white border-3 border-stone-200 rounded-3xl p-5 shadow-lg flex flex-col justify-between font-sans">
          
          <div>
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-slate-700" />
                <span>系统控制台与补给站</span>
              </h3>
              
              <div className="flex flex-col items-end gap-1 font-mono">
                <div className="flex items-center gap-1.5 text-xs font-black bg-slate-900 border border-slate-700 text-white px-3 py-1 rounded-lg">
                  <span>🥫 能量罐:</span>
                  <span className="text-cyan-400 text-sm font-bold">{foodCount} 罐</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  当前拥有的星星: <strong className="text-slate-800 font-black">{stars} ⭐</strong>
                </div>
              </div>
            </div>

            {/* Rename Input Modal Form inline drawer */}
            <AnimatePresence>
              {isRenaming && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-stone-50 p-3.5 rounded-2xl border-2 border-slate-205 my-3"
                >
                  <form onSubmit={handleRenameSubmit} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={10}
                      value={renameInput}
                      onChange={(e) => setRenameInput(e.target.value)}
                      placeholder="修改设备个性化主机名称..."
                      className="flex-1 bg-white border border-slate-300 p-2 rounded-xl text-xs font-mono font-black outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4.5 bg-slate-900 hover:bg-slate-950 text-white font-mono text-xs rounded-xl cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRenaming(false)}
                      className="px-2.5 bg-stone-200 hover:bg-stone-250 text-slate-650 text-xs rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Growth actions */}
            <div className="mt-4 space-y-4 font-sans">
              
              {/* Feeding card block */}
              <div className="bg-gradient-to-b from-stone-50 to-stone-100/50 border border-stone-250 p-4.5 rounded-2xl text-center space-y-3 shadow-inner relative overflow-hidden">
                <span className="absolute left-0 top-0 text-7xl text-stone-200 bg-transparent opacity-10 pointer-events-none select-none">
                  M5
                </span>
                
                <div className="flex justify-center items-center gap-1">
                  <span className="text-4xl animate-bounce">🥫</span>
                  <span className="text-1.5xl text-slate-405">==&gt;</span>
                  <span className="text-4.5xl">{activePetTemplate?.emoji}</span>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>执行高级升级脚本 (喂食成长1级)</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal max-w-xs mx-auto">
                    吞下一个【{activePetTemplate?.favoriteFoodEmoji} {activePetTemplate?.favoriteFoodName}】。
                    主芯片将重载引导，直接让它的大肚子长大并<strong className="text-rose-500">提升 1 级</strong>！
                  </p>
                </div>

                {petAdoptState.level >= 60 ? (
                  <div className="bg-slate-900 text-cyan-400 border border-slate-700 text-xs font-mono font-bold p-2.5 rounded-xl">
                    🏆 恭喜！本守护萌宠已激活满级 60 级终极网络形态！
                  </div>
                ) : (
                  <button
                    onClick={handleFeedPetOneLevel}
                    className={`w-full py-2.5 px-4 text-xs font-mono font-bold rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5 ${
                      foodCount > 0
                        ? 'bg-gradient-to-r from-slate-900 via-stone-800 to-slate-950 text-white hover:scale-102 hover:shadow-lg border border-slate-700'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <span>./feed_gourmet_can.sh (消耗 1 罐)</span>
                  </button>
                )}
              </div>

              {/* Daily Learning check-in (学习打卡) widget */}
              <div className="bg-slate-50 border-2 border-solid border-stone-200 p-4.5 rounded-2xl relative overflow-hidden shadow-inner">
                <span className="absolute -right-2 -bottom-3 text-7xl opacity-5 select-none font-mono">
                  #sh
                </span>
                
                <h4 className="text-xs font-black text-slate-850 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>📅 极客每日学习打卡命令</span>
                </h4>
                
                <p className="text-[10.5px] text-slate-600 leading-relaxed mt-1.5 font-sans">
                  今天已经完成了自主课外听读、拼音认汉字，或者是数学速算练习了吗？
                  确认完成后执行本指令，终端会自动为你的账户派发好吃的 <strong className="text-indigo-600">2个能量罐头🥫</strong> 储备物资！
                </p>

                <div className="mt-3.5">
                  {isAlreadyClockInToday ? (
                    <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl p-2.5 flex items-center justify-center gap-1.5 text-xs font-bold font-mono select-none">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>今日 ${todayStr} 打卡脚本已成功完成！</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleDailyClockIn}
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white hover:text-emerald-300 font-mono text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-1"
                    >
                      <span>./run_daily_study_checkin.sh</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl mt-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <p className="text-[10px] text-slate-500 leading-normal font-medium font-sans">
              <strong>管理员通知</strong>：我们的萌宠最大支持成长到 <strong>60级满级</strong>。达到满级后会守护小主人顺利考入小学，展现尊荣勋章状态！快通过学习打卡和爆金币来陪伴它并实现全乐园建设吧！
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
