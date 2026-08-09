module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // max_tokens y model son OPCIONALES: sin ellos el comportamiento es el de siempre.
    // El lector de facturas los usa porque devuelve un JSON más largo que una respuesta de chat.
    const { messages, system, max_tokens, model } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(200).json({
        error: 'sin_api_key',
        content: [{ type: 'text', text: 'Falta configurar ANTHROPIC_API_KEY en el entorno.' }],
      });
    }

    // El lector del cuaderno necesita mas espacio que un chat: una hoja completa son
    // muchas filas de JSON. Con el tope viejo (4000) las hojas largas se cortaban a la mitad.
    const mt = Math.min(Math.max(parseInt(max_tokens, 10) || 400, 1), 8000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-haiku-4-5-20251001',
        max_tokens: mt,
        system: system || 'Eres el asistente de Deepmine.',
        messages: messages && messages.length ? messages : [{ role: 'user', content: 'Hola' }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude error:', response.status, errText);
      // Antes esto se devolvia como un texto suelto ("Error API: 429 - {...}") que el que
      // llamaba no podia interpretar: no sabia si reintentar, si faltaba saldo o si la clave
      // estaba mal. Ahora va estructurado, con el tipo de error de Anthropic y el segundero
      // de reintento, para poder decidir y para poder explicarlo en cristiano en pantalla.
      let tipo = '';
      try { tipo = (JSON.parse(errText).error || {}).type || ''; } catch (e) {}
      return res.status(200).json({
        error: 'api',
        status: response.status,
        tipo,
        detalle: String(errText).slice(0, 500),
        // Cuanto esperar antes de reintentar, si el servidor lo indica.
        reintentarEn: Number(response.headers.get('retry-after')) || 0,
        content: [{ type: 'text', text: 'Error API: ' + response.status + ' - ' + errText }],
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(200).json({ 
      content: [{ type: 'text', text: 'Error: ' + error.message }] 
    });
  }
};
