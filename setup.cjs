// Herbal Hut - Automated Project Setup Script
// Run this from your project root: node setup.js

const fs = require('fs');
const path = require('path');

console.log('🌿 Setting up Herbal Hut...\n');

// ─── HELPER ───────────────────────────────────────────────────────────────────
function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Created: ${filePath}`);
}

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

// ─── src/index.css ────────────────────────────────────────────────────────────
write('src/index.css', `@import "tailwindcss";
`);

// ─── src/data/ingredients.js ──────────────────────────────────────────────────
write('src/data/ingredients.js', `export const INGREDIENTS = [
  { id: 'turmeric',  emoji: '🟡', name: 'Turmeric' },
  { id: 'honey',     emoji: '🍯', name: 'Honey' },
  { id: 'ginger',    emoji: '🫚', name: 'Ginger' },
  { id: 'lemon',     emoji: '🍋', name: 'Lemon' },
  { id: 'coconut',   emoji: '🥥', name: 'Coconut Oil' },
  { id: 'neem',      emoji: '🌿', name: 'Neem' },
  { id: 'aloe',      emoji: '🌵', name: 'Aloe Vera' },
  { id: 'milk',      emoji: '🥛', name: 'Milk' },
  { id: 'garlic',    emoji: '🧄', name: 'Garlic' },
  { id: 'tulsi',     emoji: '🍃', name: 'Tulsi' },
  { id: 'cinnamon',  emoji: '🪵', name: 'Cinnamon' },
  { id: 'rosewater', emoji: '🌹', name: 'Rose Water' },
  { id: 'besan',     emoji: '🌾', name: 'Besan' },
  { id: 'oliveoil',  emoji: '🫙', name: 'Olive Oil' },
  { id: 'curd',      emoji: '🥣', name: 'Curd' },
  { id: 'salt',      emoji: '🧂', name: 'Salt' },
];

export const CATEGORIES = [
  'All',
  'Skin Care',
  'Hair Care',
  'Cold & Flu',
  'Digestion',
  'Immunity',
  'Pain Relief',
];
`);

// ─── src/services/claudeApi.js ────────────────────────────────────────────────
write('src/services/claudeApi.js', `const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export async function getRemedies(ingredients, category) {
  const ingredientNames = ingredients.join(', ');
  const concern = category === 'All' ? 'general health and wellness' : category;

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
  const clean = text.replace(/\`\`\`json|\`\`\`/g, '').trim();
  return JSON.parse(clean);
}
`);

// ─── src/components/Header.jsx ────────────────────────────────────────────────
write('src/components/Header.jsx', `export default function Header() {
  return (
    <div className="bg-gradient-to-br from-amber-900 via-orange-700 to-amber-500 px-6 pt-8 pb-10">
      <div className="text-4xl mb-1">🌿</div>
      <h1 className="text-3xl font-bold text-white tracking-tight">Herbal Hut</h1>
      <p className="text-amber-200 text-sm mt-1">Nature's remedies, straight from your kitchen</p>
    </div>
  );
}
`);

// ─── src/components/IngredientGrid.jsx ────────────────────────────────────────
write('src/components/IngredientGrid.jsx', `import { INGREDIENTS } from '../data/ingredients';

export default function IngredientGrid({ selected, onToggle }) {
  return (
    <div className="px-4 pt-5">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
        🧺 Select Your Ingredients
      </p>
      <div className="grid grid-cols-4 gap-2">
        {INGREDIENTS.map((ing) => {
          const isSelected = selected.includes(ing.id);
          return (
            <button
              key={ing.id}
              onClick={() => onToggle(ing.id)}
              className={\`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all
                \${isSelected
                  ? 'border-orange-500 bg-orange-50 scale-105'
                  : 'border-transparent bg-white shadow-sm'
                }\`}
            >
              <span className="text-2xl">{ing.emoji}</span>
              <span className="text-xs font-semibold text-amber-900 text-center leading-tight">
                {ing.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
`);

// ─── src/components/CategoryChips.jsx ─────────────────────────────────────────
write('src/components/CategoryChips.jsx', `import { CATEGORIES } from '../data/ingredients';

export default function CategoryChips({ selected, onSelect }) {
  return (
    <div className="px-4 pt-4">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
        🌿 Health Concern
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={\`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all
              \${selected === cat
                ? 'bg-orange-600 border-orange-600 text-white'
                : 'bg-white border-amber-200 text-amber-800'
              }\`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
`);

// ─── src/components/RemedyCard.jsx ────────────────────────────────────────────
write('src/components/RemedyCard.jsx', `export default function RemedyCard({ remedy, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 cursor-pointer active:scale-95 transition-all"
    >
      <div className="flex justify-between items-start">
        <span className="text-3xl">{remedy.emoji}</span>
        <span className="text-xs font-bold uppercase tracking-wide bg-green-100 text-green-700 px-2 py-1 rounded-full">
          {remedy.difficulty}
        </span>
      </div>
      <h3 className="font-bold text-amber-900 mt-2 text-base leading-tight">{remedy.name}</h3>
      <p className="text-xs font-bold text-green-600 uppercase tracking-wide mt-1">{remedy.condition}</p>
      <p className="text-sm text-amber-700 mt-2 leading-relaxed">{remedy.description}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {remedy.ingredientDetails.map((ing, i) => (
          <span key={i} className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">
            {ing}
          </span>
        ))}
      </div>
      <p className="text-xs text-amber-500 mt-3 font-semibold">⏱ {remedy.time}</p>
    </div>
  );
}
`);

// ─── src/components/DetailScreen.jsx ──────────────────────────────────────────
write('src/components/DetailScreen.jsx', `export default function DetailScreen({ remedy, onBack }) {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-900 via-orange-700 to-amber-500 px-6 pt-8 pb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-5"
        >
          ← Back
        </button>
        <div className="text-5xl mb-3">{remedy.emoji}</div>
        <h1 className="text-2xl font-bold text-white leading-tight">{remedy.name}</h1>
        <p className="text-amber-200 text-xs mt-1 uppercase tracking-wide font-semibold">
          {remedy.condition} · {remedy.time} · {remedy.difficulty}
        </p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Ingredients */}
        <div>
          <h2 className="font-bold text-amber-900 text-base mb-3">🧺 Ingredients Needed</h2>
          <div className="space-y-2">
            {remedy.ingredientDetails.map((ing, i) => (
              <div key={i} className="bg-white rounded-xl px-4 py-3 text-sm text-amber-900 font-medium border border-orange-100">
                • {ing}
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h2 className="font-bold text-amber-900 text-base mb-3">📋 Step-by-Step Method</h2>
          <div className="space-y-3">
            {remedy.steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-amber-800 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-4">
          <h2 className="font-bold text-orange-700 text-sm mb-1">⚠️ Important Note</h2>
          <p className="text-sm text-amber-700 leading-relaxed">{remedy.warning}</p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-amber-400 text-center leading-relaxed pb-4">
          These are traditional home remedies for general wellness only.
          Please consult a doctor for medical conditions.
        </p>
      </div>
    </div>
  );
}
`);

// ─── src/App.jsx ──────────────────────────────────────────────────────────────
write('src/App.jsx', `import { useState } from 'react'
import Header from './components/Header'
import IngredientGrid from './components/IngredientGrid'
import CategoryChips from './components/CategoryChips'
import RemedyCard from './components/RemedyCard'
import DetailScreen from './components/DetailScreen'
import { getRemedies } from './services/claudeApi'

export default function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [remedies, setRemedies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeRemedy, setActiveRemedy] = useState(null)

  function toggleIngredient(id) {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  async function handleFind() {
    if (selectedIngredients.length === 0) {
      setError('Please select at least one ingredient!')
      return
    }
    setError(null)
    setLoading(true)
    setRemedies([])
    try {
      const results = await getRemedies(selectedIngredients, selectedCategory)
      setRemedies(results)
    } catch (err) {
      setError('Something went wrong. Please check your API key and try again.')
    }
    setLoading(false)
  }

  if (activeRemedy) {
    return <DetailScreen remedy={activeRemedy} onBack={() => setActiveRemedy(null)} />
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <IngredientGrid selected={selectedIngredients} onToggle={toggleIngredient} />
      <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Find Button */}
      <div className="px-4 pt-4">
        <button
          onClick={handleFind}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? '🌿 Finding Remedies...' : \`✨ Find Remedies \${selectedIngredients.length > 0 ? \`(\${selectedIngredients.length} selected)\` : ''}\`}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-4xl animate-bounce">🌿</div>
          <p className="text-amber-600 mt-3 font-medium">Brewing your remedies...</p>
        </div>
      )}

      {/* Results */}
      {remedies.length > 0 && (
        <div className="px-4 pt-5 pb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
            ✦ {remedies.length} Remedies Found
          </p>
          <div className="space-y-3">
            {remedies.map((remedy, i) => (
              <RemedyCard key={i} remedy={remedy} onClick={() => setActiveRemedy(remedy)} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && remedies.length === 0 && !error && (
        <div className="text-center py-16 px-6">
          <div className="text-5xl mb-3">🧺</div>
          <p className="text-amber-700 font-medium">Select ingredients above and tap Find Remedies!</p>
        </div>
      )}
    </div>
  )
}
`);

// ─── src/main.jsx ─────────────────────────────────────────────────────────────
write('src/main.jsx', `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`);

// ─── .env ─────────────────────────────────────────────────────────────────────
if (!fs.existsSync('.env')) {
  write('.env', `VITE_CLAUDE_API_KEY=your_api_key_here
`);
  console.log('\n  ⚠️  Remember to add your Claude API key to the .env file!');
}

// ─── .gitignore ───────────────────────────────────────────────────────────────
write('.gitignore', `node_modules
dist
.env
.DS_Store
`);

console.log('\n✅ Herbal Hut setup complete!\n');
console.log('Next steps:');
console.log('  1. Add your Claude API key to the .env file');
console.log('  2. Run: npm run dev');
console.log('  3. Open: http://localhost:5174\n');
