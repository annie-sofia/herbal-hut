export default function RemedyCard({ remedy, onClick }) {
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
