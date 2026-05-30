interface Props {
  onBack: () => void;
}

export default function PreMatchPrediction({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-white p-6 font-sans flex flex-col">
      {/* Volver */}
      <button
        onClick={onBack}
        className="text-gray-600 dark:text-gray-400 hover:text-white flex items-center gap-2 mb-4 text-sm transition-colors self-start"
      >
        <span>&larr;</span> Volver al Inicio
      </button>

      <div className="flex-grow flex flex-col items-center justify-center">
        <span className="text-6xl mb-6">🚧</span>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Modelo Predictivo Prepartida</h1>
        <p className="text-purple-400 text-xl animate-pulse">En desarrollo...</p>
      </div>
    </div>
  );
}
