import { useState } from 'react'
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
          {loading ? '🌿 Finding Remedies...' : `✨ Find Remedies ${selectedIngredients.length > 0 ? `(${selectedIngredients.length} selected)` : ''}`}
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
