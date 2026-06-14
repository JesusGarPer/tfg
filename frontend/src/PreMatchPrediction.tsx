interface Props {
  onBack: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function PreMatchPrediction({ onBack, isDark, toggleTheme }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-white p-6 font-sans flex flex-col">
      {/* Volver */}
      <button
        onClick={onBack} className="w-max text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer flex items-center gap-2 mb-4 text-sm transition-colors">
        <span>&larr;</span> Volver al Inicio
      </button>

      {/* Selector de modo oscuro */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        title="Cambiar Modo"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className="flex-grow flex flex-col items-center justify-center">
        <span className="text-6xl mb-6">🚧</span>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Modelo Predictivo Prepartida</h1>
        <p className="text-purple-400 text-xl animate-pulse">En desarrollo...</p>
      </div>
    </div>
  );
}
