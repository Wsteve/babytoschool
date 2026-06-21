import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Volume2, VolumeX, Mic, MicOff, HelpCircle, Trophy, User } from 'lucide-react';
import { SoundManager } from '../utils/SoundManager';
import { AvatarId } from '../types';
import { CHARACTERS } from '../utils/gameData';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface AICompanionChatProps {
  characterId: AvatarId;
  nickname: string;
  gardenUnlockedCount: number;
  onGrantStar: (qty: number) => void;
  stars: number;
}

export default function AICompanionChat({
  characterId,
  nickname,
  gardenUnlockedCount,
  onGrantStar,
  stars,
}: AICompanionChatProps) {
  const currentCharacter = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  
  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Conversation tracking for rewarding stars
  const [chatTurnCount, setChatTurnCount] = useState(0);
  const [unclaimedStars, setUnclaimedStars] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const defaultWelcomeMessage = `嗨，亲爱的小伙伴 ${nickname}！我是你的守护伙伴【${currentCharacter.name}】🐾！
很高兴在这个温暖的书洞里和你说话！你可以拍拍我、对我说任意好玩的事情。
或者你可以点击下面的【彩色气球气泡】来挑战好玩的‘拼音、数学算术、或者小学常规’知识测试！
每次你和我完成对话、或者答对测试题，我都会亲自打包【⭐ 闪亮之星】奖品送给你哦！准备好开始了吗？`;

  // Init welcome message on load
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: defaultWelcomeMessage,
        timestamp: new Date(),
      }
    ]);
    
    // Auto voice reading welcome
    setTimeout(() => {
      speakText(defaultWelcomeMessage);
    }, 800);

    // Initialize Speech Recognition API if available
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'zh-CN';

        rec.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
          SoundManager.playClick();
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          if (resultText) {
            setInputText(resultText);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech Recognition error:", event.error);
          if (event.error === 'not-allowed') {
            setSpeechError('小朋友，麦克风权限没开启噢！不过你可以点击下面的“彩色泡泡书”或打字跟我聊天！');
          } else {
            setSpeechError('哎呀，风太大了我没听清，请你再大声对我说一次好吗？');
          }
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    } catch (e) {
      console.warn("Speech recognition is not supported in this browser environment.", e);
    }

    return () => {
      // Cancel speech on leaving component
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [characterId]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // TTS browser speech synthesis reading out-loud
  const speakText = (textToRead: string) => {
    if (!isTtsEnabled) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Extract raw words without brackets or code formats
        const cleanText = textToRead
          .replace(/【.*?】/g, '')
          .replace(/[a-zA-Z]+/g, ' ')
          .substring(0, 150); // limit to avoid freezing
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.95; // kids friendly speed
        utterance.pitch = 1.2; // warm tone
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
    }
  };

  // Quick replies customized prompt triggers
  const QUICK_PROMPTS = [
    { title: '🔤 考考我拼音！', query: '考考我拼音！请给我出一道 5-7岁声母/韵母的选择题，告诉我ABC三个选项！' },
    { title: '🔢 考算术加减', query: '考考我数学！请出1道10以内的加法或减法题，包含ABC三个趣味选项！' },
    { title: '🏫 上小学礼仪', query: '考我一道小学生活和课堂规则相关的常识题，看我能不能答对，需要ABC三个可爱的选项！' },
    { title: '🧩 图形规律谜题', query: '考考我逻辑！请给我设计一个好玩的动物/气球找规律选择题，让我选择下一个选项是什么，要包含ABC！' },
    { title: '📖 讲个小学笑话', query: '我想听故事！请给我讲一个只有二三十字极其精炼的、关于上小学的温馨可爱小笑话吧！' },
  ];

  // Speech input toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("哎呀，当前浏览器不支持录音输入噢，我们在输入框打字吧！或者直接点击下面的彩色问答泡泡！");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    SoundManager.playClick();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Package conversation log history for context
      const chatHistory = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          characterName: currentCharacter.name,
          nickname,
          gardenUnlockedCount,
        }),
      });

      if (!res.ok) {
        throw new Error('API server failed');
      }

      const data = await res.json();
      setLoading(false);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'model',
        text: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(data.text);

      // Conversational Gamification Engine:
      // Reward 1 Unclaimed Star for every response loop, keeping loops extremely engaging!
      setChatTurnCount((prev) => {
        const next = prev + 1;
        // Every 1 fully-completed conversation turn earns 1 Star directly!
        setUnclaimedStars((stars) => stars + 1);
        return next;
      });

    } catch (err) {
      console.error(err);
      setLoading(false);
      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'model',
        text: `哎呀，小主人，我的小耳朵刚才稍微被风吹了一下。你可以点击底部的快速回答泡泡，或者对我说“再出一题”试试看噢！`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  // Kids Claim Star function
  const claimEarnedStars = () => {
    if (unclaimedStars <= 0) return;
    
    SoundManager.playFanfare();
    onGrantStar(unclaimedStars);
    
    // Celebratory TTS
    speakAloud(`太赞了！你拿走了${unclaimedStars}颗亮闪闪小星星！现在你可以去“梦幻乐园”点击建造精美的大滑梯、木马啦！`);
    
    setUnclaimedStars(0);
  };

  const speakAloud = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] md:h-[68vh] bg-white border-4 border-yellow-100 rounded-3xl overflow-hidden shadow-inner font-sans" id="ai-chat-companion-classroom">
      
      {/* Top Banner of active character companion */}
      <div className={`p-3 md:p-4 bg-gradient-to-r from-yellow-100 to-amber-50 border-b-2 border-yellow-200 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-4xl md:text-5xl select-none filter drop-shadow">
            {currentCharacter.avatar}
          </span>
          <div className="font-sans">
            <h3 className="font-sans font-black text-slate-800 text-sm md:text-base flex items-center gap-1.5">
              <span>{currentCharacter.name} 的守护树洞</span>
              <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 font-black px-1.5 py-0.5 rounded-full scale-90">
                AI 在线陪伴
              </span>
            </h3>
            <p className="text-[10.5px] text-slate-500 font-medium font-sans">
              陪我练拼音、答加减法。你只管说、点泡泡，我就能懂你！💬
            </p>
          </div>
        </div>

        {/* Claim Stars widget box */}
        <div className="flex items-center gap-2">
          {/* TTS On/Off volume button */}
          <button
            onClick={() => {
              const next = !isTtsEnabled;
              setIsTtsEnabled(next);
              if (!next) {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              }
              SoundManager.playClick();
            }}
            className={`p-2 rounded-xl border cursor-pointer transition-colors ${
              isTtsEnabled ? 'bg-teal-100 border-teal-300 text-teal-700' : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
            title="小动物读书念出来"
          >
            {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settle Stars button bubble */}
          <AnimatePresence>
            {unclaimedStars > 0 && (
              <motion.button
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: [1, 1.1, 1], x: 0 }}
                exit={{ scale: 0 }}
                onClick={claimEarnedStars}
                className="bg-gradient-to-r from-red-500 to-amber-500 text-white border-2 border-yellow-350 font-black text-xs px-3.5 py-2 rounded-full cursor-pointer shadow-lg animate-bounce flex items-center gap-1 font-sans"
              >
                <span>⭐ 领走 {unclaimedStars} 颗星</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Message Stream lists */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#FAF9F5] space-y-4 font-sans">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Profile icon bubble */}
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-lg select-none shrink-0 ${
                  isUser
                    ? 'bg-amber-100 border-amber-300'
                    : 'bg-white border-stone-200 shadow-sm'
                }`}
              >
                {isUser ? '🧒' : currentCharacter.avatar}
              </div>

              {/* Text cloud bubble */}
              <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed shadow-sm font-sans ${
                isUser
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-900 rounded-tr-none border border-yellow-500'
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                {/* Format markdown newlines and highlights */}
                <span className="whitespace-pre-line font-sans">{msg.text}</span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold px-12 font-sans">
            <span className="animate-spin text-lg">🍪</span>
            <span>{currentCharacter.name} 正含着小糖果，拼命组织题目和奖励中...</span>
          </div>
        )}

        {speechError && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-2.5 text-[11px] font-sans font-medium text-center">
            ⚠️ {speechError}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bubble Pre-defined Quick Action Buttons */}
      <div className="bg-white px-3 py-2 border-t border-yellow-50 overflow-x-auto whitespace-nowrap flex gap-2">
        {QUICK_PROMPTS.map((qp, index) => (
          <button
            key={index}
            disabled={loading}
            onClick={() => handleSubmit(undefined, qp.query)}
            className="inline-block bg-amber-50 hover:bg-amber-100 border border-amber-200 text-slate-800 font-extrabold text-[10.5px] px-3 py-1.5 rounded-full cursor-pointer transition-transform hover:scale-105 shrink-0 font-sans"
          >
            {qp.title}
          </button>
        ))}
      </div>

      {/* Input controls form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t-2 border-stone-100 flex items-center gap-2">
        
        {/* Vocal microphone button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-full border cursor-pointer shrink-0 transition-all ${
            isListening
              ? 'bg-red-500 border-red-600 text-white animate-pulse shadow-md'
              : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
          }`}
          title={isListening ? "正在听你录音，点一下停止" : "开启麦克风跟伙伴对话说话"}
        >
          {isListening ? <MicOff className="w-5 h-5 text-white animate-bounce" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Input box */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
          placeholder={isListening ? "【正在仔细听小朋友说话噢...】" : "直接打字或在上方选：10以内算术/拼音测试... 💬"}
          className="flex-1 bg-stone-50 border-2 border-stone-100 hover:border-yellow-100 focus:border-yellow-400 focus:bg-white p-2.5 rounded-full text-xs font-sans font-semibold outline-none transition-all placeholder:text-[11px]"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className={`p-2.5 rounded-full cursor-pointer transition-all ${
            inputText.trim() && !loading
              ? 'bg-amber-400 text-slate-900 border border-yellow-500 hover:scale-105 shadow'
              : 'bg-stone-100 text-stone-300'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
