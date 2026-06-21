# 🎒 幼小衔接智力成长乐园 (Kindergarten Transition Intelligence Growth Park)

这是一个专为 **5~7 岁幼小衔接阶段儿童** 设计的趣味互动闯关网页游戏。包含拼音认知、趣味数学、逻辑思维、学校生活常识四大主题，帮助孩子们在欢声笑语中顺利适应、快乐过渡到小学生活！

本项目基于现代化的前端技术栈构建，具有高响应度、精美手绘卡通风视觉，且完全**开箱即用，支持离线运行 (Offline-first)**。

## 🌟 核心特色

- **四大成长探险板块**：
  1. **🔤 拼音大冒险**：包含声母与韵母趣味投喂分类游戏、字词日常拼读连连看，夯实拼音基础。
  2. **🔢 数学小天地**：水果加法计数、认识规律数字时钟（起床、上课、睡觉场景），建立极简作息观。
  3. **🧩 逻辑思维馆**：重复图形规律推理（红气球、蓝气球等）、超市多类别杂物收纳框分类整理。
  4. **🎒 小学新生活**：模拟开学整理书包、课堂/升旗仪式文明礼仪裁判，培养独立自我管理和良好习惯。
- **成长守护陪伴**：四大可爱小动物（熊猫胖胖、智力兔、声母狮子、猫头鹰奥力）供选择。
- **荣誉印章本 & 成长值系统**：获得成长值，不断收集、解锁 6 枚专属荣誉勋章，体验通关乐趣。
- **纯正 Web Audio API 绿色音效**：使用平滑的正弦波/三角波合成欢快音效，无需加载任何外部音频，完美适配各种网络环境。

---

## 🛠️ 技术栈说明

- **前端框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **样式方案**：[Tailwind CSS v4](https://tailwindcss.com/)
- **动效引擎**：[Motion](https://motion.dev/) (原 Framer Motion)
- **图标库**：[Lucide React](https://lucide.dev/)
- **构建工具**：[Vite v6](https://vite.dev/)

---

## 🚀 快速开始与本地开发

在开始前，请确保您在电脑上安装了 [Node.js](https://nodejs.org/) (推荐 v18+)。

### 1. 克隆 / 下载本项目到本地
您可以从 GitHub 下载 Zip 压缩包，或者运行命令：
```bash
git clone <您的仓库地址>
cd <项目目录>
```

### 2. 安装依赖项
```bash
npm install
```

### 3. 启动本地开发服务 (支持的热更新)
```bash
npm run dev
```
打开浏览器访问：`http://localhost:3000`

### 4. 生产环境构建打包
```bash
npm run build
```
打包后生成的静态资源将存放在 `dist/` 文件夹下，可放于任何静态服务器（如 GitHub Pages、Vercel、Netlify、Cloudflare Pages 等）托管运行。

---

## 🎈 如何在 GitHub Pages 上零成本免费部署游玩？

1. **新建 GitHub 仓库** 并将代码推送上去。
2. 在项目根目录的 `vite.config.ts` 中，如果是部署在根目录下则无需修改；如果是部署在子路径下（例如 `https://username.github.io/repo-name/`），请添加 `base: './'`：
   ```typescript
   export default defineConfig({
     base: './', // 确保相对路径正确
     plugins: [react(), tailwindcss()],
     // ...
   })
   ```
3. 在 GitHub 仓库设置中选择 **Pages** 分支发布，或者使用 GitHub Action 自动化推送 `dist/` 文件夹即可。

---

## ❤️ 视力关怀健康提示
本软件极其重视儿童的身心健康。页面底部常驻视力关怀贴士。建议适龄儿童每次**连续游戏不要超过 15 分钟**，引导其闭眼放松、适度远眺。 

*由“幼小衔接智力成长乐园”开发团队爱心定制。*
