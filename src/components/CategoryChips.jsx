import { CATEGORIES } from '../data/ingredients';

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
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all
              ${selected === cat
                ? 'bg-orange-600 border-orange-600 text-white'
                : 'bg-white border-amber-200 text-amber-800'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
