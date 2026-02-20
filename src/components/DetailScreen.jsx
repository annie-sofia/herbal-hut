export default function DetailScreen({ remedy, onBack }) {
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
