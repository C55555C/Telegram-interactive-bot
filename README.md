# 🤖 Telegram Bot - Cloudflare Worker

一个部署在 Cloudflare Workers 上的安全 Telegram 机器人，支持消息转发、屏蔽管理、诈骗检测和 webhook 注册。

## 🚀 快速开始

✅ 第一步：进入 Cloudflare 控制台
- 打开 https://dash.cloudflare.com
- 登录你的账户 点击 Workers & Pages

✅ 第二步：创建 Worker 项目
- Worker 名字随便取：如 telegram-bot-worker
- 创建后点击进入项目页面

✅ 第三步：进入「Quick edit」代码界面
- 进入刚创建的 Worker 后台
- 点击 Quick edit 删除原有代码
- 粘贴 index.js 代码（也就是 src/index.js 内容）

✅ 第四步：添加环境变量（Variables）
- 左侧点击 Settings → 选择 Variables
- 添加以下 3 个变量（注意大小写）：

名称	获取途径	用途
- ENV_BOT_TOKEN	   添加 @BotFather 输入 /newbot 生成      你的 Telegram Bot token
- ENV_BOT_SECRET	   建议用 www.uuidgenerator.net 生成      用于验证 webhook
- ENV_ADMIN_UID	   用 @username_to_id_bot 获取           你的 UID

✅ 第五步：绑定 KV 命名空间
- 点击菜单「KV」 创建命名空间：命名为 nfd 回到 Worker 页面 → 点击 Settings
- 找到 KV namespaces，点击「Add binding」之后 Variable name 填：nfd
- KV namespace 选择刚才创建的 nfd

✅ 第六步：保存并部署 Worker
- 回到「Quick Edit」页面 点击 Save and deploy 页面会提示：Worker 已部署成功 🎉
- 你现在会看到你的访问地址，例如： https://telegram-bot-worker.你的子域.workers.dev

✅ 第七步：注册 Webhook（在线访问即可）
- 访问注册 webhook 的链接（带上 ENV_BOT_SECRET）
- https://telegram-bot-worker.你的子域.workers.dev/registerWebhook?key=你的ENV_BOT_SECRET
- 返回：Webhook 注册成功 说明部署完美 ✅

## 📂 文件结构

- `src/index.js`：主逻辑代码
- `data/startMessage.md`：/start 欢迎语
- `data/notification.txt`：周期性通知文本
- `data/fraud.db`：UID 黑名单

-   /block    回复用户会加入UID黑名单
-   /unblock  回复用户会解除UID黑名单
-   /checkblock 检查用户是否在UID黑名单

