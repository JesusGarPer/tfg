import { useState } from 'react';
import Min15Prediction from './Min15Prediction';
import PreMatchPrediction from './PreMatchPrediction';

function App() {
  const [view, setView] = useState<'home' | 'min15' | 'prematch'>('home');

  if (view === 'min15') {
    return <Min15Prediction onBack={() => setView('home')} />;
  }

  if (view === 'prematch') {
    return <PreMatchPrediction onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col items-center justify-center p-6 font-sans">

      {/* Header */}
      <div className="text-center mb-16 mt-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-5xl font-bold tracking-tight text-white">LEC Predictor AI</h1>
        </div>
        <p className="text-gray-400 text-lg mb-6">Sistema de Predicción ML para League of Legends</p>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-400 via-purple-500 to-purple-600 rounded-full"></div>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl w-full justify-center px-4">

        {/* Card 1: Prepartida */}
        <div
          onClick={() => setView('prematch')}
          className="relative flex-1 bg-[#0F121C] border border-purple-500/20 rounded-2xl p-10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] cursor-pointer overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div className="flex flex-col items-center text-center h-full relative z-10">
            <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center mb-6 border border-purple-500/30 group-hover:border-purple-500/60 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <span className="text-2xl">🏆</span>
            </div>

            <h2 className="text-xl font-semibold text-purple-200 mb-4">Modelo Predictivo Prepartida</h2>

            <p className="text-gray-400 text-sm mb-12 leading-relaxed flex-grow max-w-sm">
              Predicción basada únicamente en la composición de equipos, jugadores y datos históricos. Ideal para análisis antes del inicio de la partida.
            </p>

            <div className="flex items-center gap-2 mt-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]"></div>
              <span className="text-xs text-gray-400">Sin estadísticas en tiempo real</span>
            </div>
          </div>
        </div>

        {/* Card 2: Minuto 15 */}
        <div
          onClick={() => setView('min15')}
          className="relative flex-1 bg-[#0F121C] border border-cyan-500/20 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] cursor-pointer overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div className="flex flex-col items-center text-center h-full relative z-10">
            <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:border-cyan-500/60 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="text-2xl">⏱️</span>
            </div>

            <h2 className="text-xl font-semibold text-cyan-200 mb-4">Modelo Predictivo @ Minuto 15</h2>

            <p className="text-gray-400 text-sm mb-12 leading-relaxed flex-grow max-w-sm">
              Predicción avanzada que incluye estadísticas del minuto 15:00 (oro, XP, kills, dragón). Mayor precisión basada en el estado real de la partida.
            </p>

            <div className="flex items-center gap-2 mt-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,1)]"></div>
              <span className="text-xs text-gray-400">Incluye datos en tiempo real</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-24 text-center pb-8">
        <p className="text-xs text-gray-600">
          Potenciado por Machine Learning | Datos de la LEC 2021-2025
        </p>
      </div>

    </div>
  );
}

export default App;
