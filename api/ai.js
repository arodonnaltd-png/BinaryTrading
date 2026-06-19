export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { prompt, provider } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }
  
  try {
    let response;
    
    if (provider === 'groq' || !provider) {
      // Default to Groq
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
      }
      
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
          temperature: 0.3
        })
      });
      
      if (!response.ok) {
        throw new Error(`Groq API returned ${response.status}`);
      }
      
      const data = await response.json();
      return res.status(200).json({
        provider: 'groq',
        content: data.choices[0].message.content
      });
      
    } else if (provider === 'gemini') {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
      }
      
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.3 }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API returned ${response.status}`);
      }
      
      const data = await response.json();
      return res.status(200).json({
        provider: 'gemini',
        content: data.candidates[0].content.parts[0].text
      });
      
    } else if (provider === 'anthropic') {
      const anthropicKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicKey) {
        return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
      }
      
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Anthropic API returned ${response.status}`);
      }
      
      const data = await response.json();
      return res.status(200).json({
        provider: 'anthropic',
        content: data.content.map(b => b.text || '').join('')
      });
      
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
