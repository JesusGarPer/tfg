import { useState, useEffect } from 'react';
import Min15Prediction from './Min15Prediction';
import PreMatchPrediction from './PreMatchPrediction';

function App() {
  const [view, setView] = useState<'home' | 'min15' | 'prematch'>('home');
  const [showWarning, setShowWarning] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowWarning(false);
      }
    };

    if (showWarning) {
      // Escuchamos la tecla ESC a nivel global
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup: Limpiamos todo si el modal se cierra o el componente se desmonta
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showWarning]);

  if (view === 'min15') {
    return <Min15Prediction onBack={() => setView('home')} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />;
  }

  if (view === 'prematch') {
    return <PreMatchPrediction onBack={() => setView('home')} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />;
  }

  return (
    <div className="min-h-screen bg-white transition-colors duration-200 dark:bg-[#0A0D14] text-black dark:text-white flex flex-col items-center justify-center p-6 font-sans">

      {/* Pop-up de Aviso (Modal) */}
      {showWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setShowWarning(false)} // Cerrar al clickar fuera
        >
          <div
            className="bg-white dark:bg-[#0F121C] border border-gray-200 dark:border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(168,85,247,0.15)] relative transform transition-all"
            onClick={(e) => e.stopPropagation()} // Evitar que el click dentro del modal lo cierre
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-500/30">
              <span className="text-2xl leading-none pb-1">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Módulo Deshabilitado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-sm">
              El modelo predictivo prepartida se encuentra deshabilitado temporalmente. Tras la fase de pruebas, esta funcionalidad fue descartada debido a la alta volatilidad predictiva.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="cursor-pointer w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Selector de modo oscuro */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        title="Cambiar Modo"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Header */}
      <div className="text-center mb-16 mt-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-5xl font-bold tracking-tight">LEC Predictor AI</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">Sistema de Predicción ML para League of Legends</p>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-400 via-purple-500 to-purple-600 rounded-full"></div>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl w-full justify-center px-4">

        {/* Card 1: Prepartida */}
        <button
          type="button"
          onClick={() => setShowWarning(true)} // Cambiado de setView('prematch') a setShowWarning(true)
          className="relative block w-full text-left flex-1 bg-gray-300 dark:bg-[#0F121C] border border-gray-200 dark:border-purple-500/20 rounded-2xl p-10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] cursor-pointer overflow-hidden group focus:outline-none focus:ring-2 focus:ring-purple-500/50 opacity-80 hover:opacity-100"
        >
          {/* Badge de "No disponible" opcional para dar contexto visual antes de clickar */}
          <div className="absolute top-4 right-4 bg-red-500 dark:bg-red-800 text-dark-100 dark:text-gray-100 text-xs px-2 py-1 rounded-md font-medium">
            Deshabilitado
          </div>

          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div className="flex flex-col items-center text-center h-full relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-transparent flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-500/30 group-hover:border-purple-500/60 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <span className="text-2xl">🏆</span>
            </div>

            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-200 mb-4">Modelo Predictivo Prepartida</h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-12 leading-relaxed flex-grow max-w-sm">
              Predicción basada únicamente en la composición de equipos, jugadores y datos históricos. Ideal para análisis antes del inicio de la partida.
            </p>

            <div className="flex items-center gap-2 mt-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Sin estadísticas en tiempo real</span>
            </div>
          </div>
        </button>

        {/* Card 2: Minuto 15 */}
        <button
          type="button"
          onClick={() => setView('min15')}
          className="relative block w-full text-left flex-1 bg-gray-300 dark:bg-[#0F121C] border border-gray-200 dark:border-cyan-500/20 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] cursor-pointer overflow-hidden group focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div className="flex flex-col items-center text-center h-full relative z-10">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-transparent flex items-center justify-center mb-6 border border-cyan-200 dark:border-cyan-500/30 group-hover:border-cyan-500/60 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="text-2xl">⏱️</span>
            </div>

            <h2 className="text-xl font-semibold text-cyan-600 dark:text-cyan-200 mb-4">Modelo Predictivo Minuto 15</h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-12 leading-relaxed flex-grow max-w-sm">
              Predicción avanzada que incluye estadísticas del minuto 15:00 (oro, XP, kills, dragón). Mayor precisión basada en el estado real de la partida.
            </p>

            <div className="flex items-center gap-2 mt-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,1)]"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Incluye datos en tiempo real</span>
            </div>
          </div>
        </button>

      </div>

      {/* Footer */}
      <div className="mt-24 text-center pb-8">
        <p className="text-xs text-gray-500 dark:text-gray-600">
          Potenciado por Machine Learning | Datos de la LEC 2021-2025
        </p>
      </div>

    </div>
  );
}

export default App;
