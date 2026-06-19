export default async function handler(req, res) {
  const { symbol, interval, outputsize } = req.query;
  
  if (!symbol || !interval) {
    return res.status(400).json({ error: 'Missing symbol or interval' });
  }
  
  const apiKey = process.env.TWELVEDATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'TWELVEDATA_API_KEY not configured' });
  }
  
  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize || 200}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Twelve Data API returned ${response.status}`);
    }
    
    const data = await response.json();
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
