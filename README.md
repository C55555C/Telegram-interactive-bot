# Telegram interactive bot - Group two-way messaging customer service

## 🤖 项目概述

一个基于 Telegram Bot 构建的**开源轻量客服系统** 通过群组双向消息转发来提供客户服务。
在群组中会为每个客户创建独立的话题，支持多客服以同一个机器人身份持续为客户提供服务。

## 🧩 角色定义

|角色|描述|
|---|---|
|客户|完成验证码后发送消息将被分配独立话题|
|客服|可多客服同时处理多个用户话题|
|管理员|通过关闭/开启话题决定是否继续和客户对话|


## 🚀 快速开始

# ✅ 面板安装

- 请访问： https://1panel.cn/docs/installation/online_installation/  也可以通过下面指令面板安装
- RedHat / CentOS
```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sh quick_start.sh
```
- Ubuntu
```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh
```
- Debian
```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && bash quick_start.sh
```
- openEuler / 其他
安装 docker
```bash
bash <(curl -sSL https://linuxmirrors.cn/docker.sh)
```
安装 1Panel
```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sh quick_start.sh
```
- 通过SSH登录服务器后，复制上方指令直接执行。然后无脑一路 next 即可。
- 最终，安装成功后，会有形如下面的登录信息：
```bash
[1Panel Log]: =================感谢您的耐心等待，安装已经完成==================
[1Panel Log]:
[1Panel Log]: 请用浏览器访问面板:
[1Panel Log]: 外网地址: http://xxxxxxxxxxxxxxx:31332/676cccc1c
[1Panel Log]: 内网地址: http://xxxxxxxxxxxxxxx:31332/676cccc1c
[1Panel Log]: 面板用户: 83xxxxxd84c
[1Panel Log]: 面板密码: 00cYYYY9e6
[1Panel Log]:
[1Panel Log]: 项目官网: https://1panel.cn
[1Panel Log]: 项目文档: https://1panel.cn/docs
[1Panel Log]: 代码仓库: https://github.com/1Panel-dev/1Panel
[1Panel Log]:
[1Panel Log]: 如果使用的是云服务器，请至安全组开放 31332 端口
[1Panel Log]:
[1Panel Log]: 为了您的服务器安全，在您离开此界面后您将无法再看到您的密码，请务必牢记您的密码。
```

# ✅ 额外安装的包

安装 python 的虚环境包以及supervisor
```bash
apt install python3-venv supervisor
```

# ✅ 设置 .env 所需的配置

|名称|获取途径|用途|
|---|---|---|
|BOT_TOKEN|搜索 @BotFather 输入 /newbot 申请机器人后获取 Token|你的 Telegram Bot token|
|ADMIN_GROUP_ID|搜索 @getuseridbot 奖其拉到群组中，获取群组ID|用与将机器人绑定此群组|
|ADMIN_USER_IDS|搜索 @getuseridbot 获取ID，有多个使用","分隔|你和其他管理员的 UID|

- 创建群组，开启“话题”功能
- 加入机器人，设置其为群管理
- 机器人权限必须开启“管理话题”和“修改群组信息”
- 打开.env_example，将自己机器人的Token、群组ID和管理员ID
- 修改完检查无误后将.env_example 另存为 .env


# ✅ 获取代码/构建python venv配置进程守护

```bash
git clone https://github.com/C55555C/Telegram-interactive-bot.git
cd Telegram-interactive-bot
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```
普通执行
```bash
python -m interactive-bot
```

测试完功能后 Ctrl+C 停止服务，配置Supervisor进程守护
- 1Panel后台点击 工具箱 → 进程守护
- 第一次使用，需要”初始化“，查看下靠近顶部的菜单，点击后，输入”立即重启“即可。
- 点击创建守护进程，并输入一下参数后点击创建。
- **名称**：`tgbot-InteractiveBot`
- **启动用户**：`root`
- **运行目录**：`/srv/Telegram-interactive-bot`
- **启动命令**：`/srv/Telegram-interactive-bot/venv/bin/python -m interactive-bot`
- **进程数量**：`1`


# ✅ Docker执行

1. 安装docker ， 参看 [Install Docker under Ubuntu 22.04](https://gist.github.com/dehsilvadeveloper/c3bdf0f4cdcc5c177e2fe9be671820c7)
2. 执行`docker build -t tgibot .` 生成一个tgibot的镜像
3. 执行`docker run --restart always --name telegram-interactive-bot  -v "$PWD":/app tgibot:latest` 生成容器并执行。


# 📂 ToDoList
- [x] 准备完善下，docker化
- [x] 支持消息回复功能。消息间可以相互引用。
- [x] 完善下数据库。
- [x] 添加客户的人机识别，防止无聊的人用userbot来刷
- [x] 添加并识别媒体组消息。
- [x] 精简点代码，利用**payload来展开forwarding的参数。

