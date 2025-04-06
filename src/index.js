// 强化版 Telegram Bot Worker
// ✅ 安全性更高 ✅ 注释完整 ✅ 结构清晰

const TOKEN = ENV_BOT_TOKEN; // 来自 BotFather 的 Token
const WEBHOOK = '/endpoint'; // Webhook 路由路径
const SECRET = ENV_BOT_SECRET; // Webhook 校验密钥
const ADMIN_UID = ENV_ADMIN_UID; // 管理员 UID

const NOTIFY_INTERVAL = 3600 * 1000; // 通知间隔
const fraudDbUrl = 'https://raw.githubusercontent.com/kissimok/ljj/main/data/fraud.db';
const notificationUrl = 'https://raw.githubusercontent.com/kissimok/ljj/main/data/notification.txt';
const startMsgUrl = 'https://raw.githubusercontent.com/kissimok/ljj/main/data/startMessage.md';
const enable_notification = true;

function apiUrl(methodName, params = null) {
  let query = params ? '?' + new URLSearchParams(params).toString() : '';
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`;
}

function makeReqBody(body) {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function requestTelegram(methodName, body, params = null) {
  return fetch(apiUrl(methodName, params), body).then(r => r.json());
}

function sendMessage(msg = {}) {
  return requestTelegram('sendMessage', makeReqBody(msg));
}

function copyMessage(msg = {}) {
  return requestTelegram('copyMessage', makeReqBody(msg));
}

function forwardMessage(msg) {
  return requestTelegram('forwardMessage', makeReqBody(msg));
}

addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event));
  } else if (url.pathname === '/registerWebhook') {
    if (url.searchParams.get('key') !== SECRET) {
      event.respondWith(new Response('Unauthorized', { status: 403 }));
    } else {
      event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET));
    }
  } else if (url.pathname === '/unRegisterWebhook') {
    if (url.searchParams.get('key') !== SECRET) {
      event.respondWith(new Response('Unauthorized', { status: 403 }));
    } else {
      event.respondWith(unRegisterWebhook());
    }
  } else {
    event.respondWith(new Response('No handler for this request'));
  }
});

async function handleWebhook(event) {
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
    return new Response('Unauthorized', { status: 403 });
  }
  const update = await event.request.json();
  event.waitUntil(onUpdate(update));
  return new Response('Ok');
}

async function onUpdate(update) {
  if ('message' in update) {
    await onMessage(update.message);
  }
}

async function onMessage(message) {
  if (message.text === '/start') {
    const startMsg = await fetch(startMsgUrl).then(r => r.text()).catch(() => '欢迎使用机器人！');
    return sendMessage({ chat_id: message.chat.id, text: startMsg });
  }
  if (message.chat.id.toString() === ADMIN_UID) {
    if (!message?.reply_to_message?.chat) {
      return sendMessage({
        chat_id: ADMIN_UID,
        text: '请回复用户消息使用：/block /unblock /checkblock'
      });
    }
    if (/^\/block$/.test(message.text)) return handleBlock(message);
    if (/^\/unblock$/.test(message.text)) return handleUnBlock(message);
    if (/^\/checkblock$/.test(message.text)) return checkBlock(message);
    const guestId = await nfd.get('msgmap-' + message.reply_to_message.message_id, { type: 'json' });
    return copyMessage({ chat_id: guestId, from_chat_id: message.chat.id, message_id: message.message_id });
  }
  return handleGuestMessage(message);
}

async function handleGuestMessage(message) {
  const chatId = message.chat.id;
  const blocked = await nfd.get('block-' + chatId, { type: 'json' });
  if (blocked) {
    return sendMessage({ chat_id: chatId, text: 'You are blocked.' });
  }
  const res = await forwardMessage({ chat_id: ADMIN_UID, from_chat_id: chatId, message_id: message.message_id });
  if (res.ok) {
    await nfd.put('msgmap-' + res.result.message_id, chatId);
  }
  return handleNotify(chatId);
}

async function handleNotify(chatId) {
  if (await isFraud(chatId)) {
    return sendMessage({ chat_id: ADMIN_UID, text: `⚠️ 发现诈骗嫌疑用户 UID: ${chatId}` });
  }
  if (!enable_notification) return;
  const last = await nfd.get('lastmsg-' + chatId, { type: 'json' });
  if (!last || Date.now() - last > NOTIFY_INTERVAL) {
    await nfd.put('lastmsg-' + chatId, Date.now());
    const note = await fetch(notificationUrl).then(r => r.text()).catch(() => '请注意核实交易对方身份。');
    return sendMessage({ chat_id: ADMIN_UID, text: note });
  }
}

async function handleBlock(message) {
  const guestId = await nfd.get('msgmap-' + message.reply_to_message.message_id, { type: 'json' });
  if (guestId === ADMIN_UID) return sendMessage({ chat_id: ADMIN_UID, text: '不能屏蔽自己' });
  await nfd.put('block-' + guestId, true);
  return sendMessage({ chat_id: ADMIN_UID, text: `用户 ${guestId} 已被屏蔽` });
}

async function handleUnBlock(message) {
  const guestId = await nfd.get('msgmap-' + message.reply_to_message.message_id, { type: 'json' });
  await nfd.put('block-' + guestId, false);
  return sendMessage({ chat_id: ADMIN_UID, text: `用户 ${guestId} 已解除屏蔽` });
}

async function checkBlock(message) {
  const guestId = await nfd.get('msgmap-' + message.reply_to_message.message_id, { type: 'json' });
  const blocked = await nfd.get('block-' + guestId, { type: 'json' });
  return sendMessage({ chat_id: ADMIN_UID, text: `用户 ${guestId} 当前状态：${blocked ? '🚫 已屏蔽' : '✅ 未屏蔽'}` });
}

async function registerWebhook(event, requestUrl, suffix, secret) {
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`;
  const res = await fetch(apiUrl('setWebhook', { url: webhookUrl, secret_token: secret }));
  const json = await res.json();
  return new Response(json.ok ? 'Webhook 注册成功' : JSON.stringify(json, null, 2));
}

async function unRegisterWebhook() {
  const res = await fetch(apiUrl('setWebhook', { url: '' }));
  const json = await res.json();
  return new Response(json.ok ? 'Webhook 已移除' : JSON.stringify(json, null, 2));
}

async function isFraud(id) {
  id = id.toString();
  try {
    const db = await fetch(fraudDbUrl).then(r => r.text());
    const list = db.split('\n').map(v => v.trim()).filter(Boolean);
    return list.includes(id);
  } catch (_) {
    return false;
  }
}
