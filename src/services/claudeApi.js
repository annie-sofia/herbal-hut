const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export async function getRemedies(ingredients, category) {
  const ingredientNames = ingredients.join(', ');
  const concern = category === 'All' ? 'general health and wellness' : category;

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

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content[0].text;
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
