import { INGREDIENTS } from '../data/ingredients';

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
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all
                ${isSelected
                  ? 'border-orange-500 bg-orange-50 scale-105'
                  : 'border-transparent bg-white shadow-sm'
                }`}
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
