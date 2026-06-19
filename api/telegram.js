export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { message, text, chatId } = req.body;
  const msgText = text || message;
  
  if (!msgText) {
    return res.status(400).json({ error: 'Missing message/text' });
  }
  
  // Use provided chatId or fall back to environment variable
  const finalChatId = chatId || process.env.TELEGRAM_CHAT_ID;
  if (!finalChatId) {
    return res.status(400).json({ error: 'Missing chatId' });
  }
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN not configured' });
  }
  
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: finalChatId,
        text: msgText,
        parse_mode: 'HTML'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Telegram API returned ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
