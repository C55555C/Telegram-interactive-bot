# 🤖 Telegram Bot - Cloudflare Worker

一个部署在 Cloudflare Workers 上的安全 Telegram 机器人，支持消息转发、屏蔽管理、诈骗检测和 webhook 注册。

## 🚀 快速开始

1. 设置环境变量（详见 wrangler.toml）
2. 创建 KV 命名空间：`wrangler kv:namespace create nfd`
3. 发布：`wrangler publish`
4. 注册 Webhook：
   ```
   curl "https://<your-worker-url>/registerWebhook?key=your_webhook_secret"
   ```

## 📂 文件结构

- `src/index.js`：主逻辑代码
- `data/startMessage.md`：/start 欢迎语
- `data/notification.txt`：周期性通知文本
- `data/fraud.db`：UID 黑名单
