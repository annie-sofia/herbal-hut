const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { ingredients, category } = JSON.parse(event.body);
  const concern = category === 'All' ? 'general health and wellness' : category;
  const ingredientNames = ingredients.join(', ');

  const prompt = `You are an expert in traditional Indian Ayurvedic home remedies.
Suggest 3 home remedies for ${concern} using some or all of these ingredients: ${ingredientNames}.

For each remedy return a JSON object in this exact format:
{
  "name": "Remedy name",
  "condition": "${category === 'All' ? 'General Wellness' : category}",
  "emoji": "one relevant emoji",
  "description": "One sentence description",
  "ingredientDetails": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "time": "X min",
  "difficulty": "easy",
  "warning": "Any safety warning or contraindication"
}

Return ONLY a valid JSON array of 3 remedy objects. No extra text.`;

  const requestBody = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed.content[0].text;
          const clean = text.replace(/```json|```/g, '').trim();
          resolve({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: clean,
          });
        } catch (e) {
          resolve({ statusCode: 500, body: JSON.stringify({ error: 'Parse error' }) });
        }
      });
    });
    req.on('error', (e) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });
    req.write(requestBody);
    req.end();
  });
};
