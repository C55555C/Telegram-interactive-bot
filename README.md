# 🤖 Telegram Bot Cloudflare Worker

这是一个基于 Cloudflare Workers 的 Telegram 机器人，支持消息转发、管理员管理、黑名单检测等功能。

## ✅ 特性

- 支持用户消息自动转发
- 管理员可 `/block` `/unblock` `/checkblock` 管理访客
- 支持诈骗 UID 自动检测提醒
- 无需服务器，部署在 Cloudflare Workers

## 🚀 快速开始

1. 配置 `wrangler.toml` 中的环境变量
2. 使用 `wrangler kv:namespace create nfd` 创建存储空间
3. 部署：
   ```bash
   wrangler publish
