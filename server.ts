import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup GEMINI client with telemetric User-Agent header
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // Children Dialog Companion Chat API endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history, characterName, nickname, gardenUnlockedCount } = req.body;

      if (!ai) {
        // Safe, engaging fallback in case API key is still uploading
        return res.json({
          text: `🐾【温馨提示：开发者大朋友，还没在“设置 > 密钥”里填上 GEMINI_API_KEY 噢！不过没关系，我是你的探险伙伴【${characterName}】！】\n\n你好呀，${nickname || "小朋友"}！听到你的声音我真开心！咱们可以一起拼写拼音、挑战速算加减法，也可以直接在下方点我给你准备的“快速答题按钮”哦！快去上面挑战关卡拿到【亮晶晶的星星（⭐）】，来帮我建立精美的【梦幻游乐园】吧！`
        });
      }

      // Special prompt designed for 5~7 age level
      const systemPrompt = `You are a loving, enthusiastic, warm AI teaching assistant representing the cute animal guardian "${characterName}" from the children's kindergarten prep app "幼小衔接智力成长乐园".
Your audience is kids aged 5 to 7 preparing to enter primary school.
Always speak in simplified, playful Chinese with lots of toddler-friendly sound effects (e.g. "嗷呜~", "咕噜咕噜~", "哇咔咔！", "喵呜~", "小主人！", "嘿哈！") and vibrant emojis.
The child's details:
- Nickname: "${nickname || "小朋友"}"
- Companion's Character Avatar: "${characterName}"
- Number of decorations built in Dream Playground: ${gardenUnlockedCount || 0} items.

Your instruction roles:
1. Encourage them to play the core games: Pinyin, Math, Logic, and School Life.
2. Ask playful quiz questions directly in the dialogue to make it "Dialogue-Playable". For example, ask mini pinyin puzzles, simple count math, or nice daily behavior:
   - "2个红富士苹果加上3个绿香蕉，一共是几个水果宝宝呢？"
   - "上完厕所，或者吃饭前一定要先做什么呢？"
   - "看书写字的时候，我们的身体一定要做到‘一拳、一尺、一寸’哦！"
3. Provide exactly three multiple choice tap-replies (such as A: 5个, B: 4个, C: 6个) in friendly format so the toddler can simply answer via quick keys.
4. Keep responses very short, cheerful, and interactive (maximum 2-4 sentences per block) to avoid text exhaustion. Never write heavy paragraphs or markdown tables.`;

      const formattedContents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history.slice(-6)) { // Take last 6 turns
          formattedContents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        }
      }

      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.85,
        }
      });

      const text = response.text || "我还在想呢，小朋友我们再说一遍好吗？";
      res.json({ text });
    } catch (err: any) {
      console.error("Gemini companion error:", err);
      res.status(500).json({ error: "小宝贝，我的脑袋稍微打了下转，再试一试对我说吧！" });
    }
  });

  // Serve Vite in dev, static dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server launched on port ${PORT}`);
  });
}

startServer();
