// Herbal Hut - Netlify Setup Script
// Run from project root: node setup2.cjs

const fs = require('fs');
const path = require('path');

console.log('🌿 Setting up Netlify for Herbal Hut...\n');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Created: ${filePath}`);
}

// ─── netlify/functions/getRemedies.cjs ────────────────────────────────────────
// This runs on Netlify's server - API key stays hidden from browser
write('netlify/functions/getRemedies.cjs', `const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { ingredients, category } = JSON.parse(event.body);
  const concern = category === 'All' ? 'general health and wellness' : category;
  const ingredientNames = ingredients.join(', ');

  const prompt = \`You are an expert in traditional Indian Ayurvedic home remedies.
Suggest 3 home remedies for \${concern} using some or all of these ingredients: \${ingredientNames}.

For each remedy return a JSON object in this exact format:
{
  "name": "Remedy name",
  "condition": "\${category === 'All' ? 'General Wellness' : category}",
  "emoji": "one relevant emoji",
  "description": "One sentence description",
  "ingredientDetails": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "time": "X min",
  "difficulty": "easy",
  "warning": "Any safety warning or contraindication"
}

Return ONLY a valid JSON array of 3 remedy objects. No extra text.\`;

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
          const clean = text.replace(/\`\`\`json|\`\`\`/g, '').trim();
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
`);

// ─── src/services/claudeApi.js ────────────────────────────────────────────────
// Now calls our Netlify function instead of Claude directly
write('src/services/claudeApi.js', `export async function getRemedies(ingredients, category) {
  const response = await fetch('/.netlify/functions/getRemedies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, category }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch remedies');
  }

  const data = await response.json();
  return data;
}
`);

// ─── netlify.toml ─────────────────────────────────────────────────────────────
write('netlify.toml', `[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"
`);

// ─── vite.config.js ───────────────────────────────────────────────────────────
write('vite.config.js', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
`);

// ─── .env ─────────────────────────────────────────────────────────────────────
write('.env', `CLAUDE_API_KEY=your_new_api_key_here
`);

// ─── .gitignore ───────────────────────────────────────────────────────────────
write('.gitignore', `node_modules
dist
.env
.DS_Store
`);

console.log('\n✅ Netlify setup complete!\n');
console.log('Next steps:');
console.log('  1. Add your NEW Claude API key to the .env file');
console.log('  2. Run: npm run build');
console.log('  3. We will deploy to Netlify next!\n');
