import { useState } from 'react';

interface Props {
  onBack: () => void;
}

const ROLES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

export default function Min15Prediction({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 font-sans">
      {/* Volver */}
      <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 text-sm transition-colors">
        <span>&larr;</span> Volver al Inicio
      </button>

      {/* Titulo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
           <span className="text-cyan-400 text-xl transform -scale-x-100 -rotate-45">🗡️</span> Predicción @ Minuto 15
        </h1>
        <p className="text-gray-500 text-xs mt-1">Configuración completa con estadísticas en tiempo real</p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Sección 1: Configuración de Partida */}
        <div className="flex flex-col items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Configuración de Partida</h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Equipo Azul */}
          <div className="border border-cyan-900/50 bg-[#0F121C]/50 rounded-xl p-6">
            <h3 className="text-cyan-400 font-medium flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Equipo Azul
            </h3>
            <div className="mb-6">
              <label htmlFor="blue-team-name" className="text-xs text-gray-500 block mb-1">Nombre del Equipo</label>
              <select id="blue-team-name" className="w-full bg-[#0A0D14] border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300 focus:border-cyan-500/50 outline-none">
                <option>Seleccionar equipo...</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 block mb-3">Composición (5 jugadores)</div>
              <div className="grid grid-cols-5 gap-2">
                {ROLES.map(role => (
                  <div key={role} className="flex flex-col gap-2">
                    <span className="text-[10px] text-gray-500 text-center lowercase">{role}</span>
                    <select className="bg-[#0A0D14] border border-gray-800 rounded p-2 text-xs text-gray-300 text-center w-full appearance-none">
                      <option>Campeón</option>
                    </select>
                    <select className="bg-[#0A0D14] border border-gray-800 rounded p-2 text-xs text-gray-300 text-center w-full appearance-none">
                      <option>Jugador</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipo Rojo */}
          <div className="border border-red-900/50 bg-[#0F121C]/50 rounded-xl p-6">
            <h3 className="text-red-400 font-medium flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-400"></span> Equipo Rojo
            </h3>
            <div className="mb-6">
              <label htmlFor="red-team-name" className="text-xs text-gray-500 block mb-1">Nombre del Equipo</label>
              <select id="red-team-name" className="w-full bg-[#0A0D14] border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300 focus:border-red-500/50 outline-none">
                <option>Seleccionar equipo...</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 block mb-3">Composición (5 jugadores)</div>
              <div className="grid grid-cols-5 gap-2">
                {ROLES.map(role => (
                  <div key={role} className="flex flex-col gap-2">
                    <span className="text-[10px] text-gray-500 text-center lowercase">{role}</span>
                    <select className="bg-[#0A0D14] border border-gray-800 rounded p-2 text-xs text-gray-300 text-center w-full appearance-none">
                      <option>Campeón</option>
                    </select>
                    <select className="bg-[#0A0D14] border border-gray-800 rounded p-2 text-xs text-gray-300 text-center w-full appearance-none">
                      <option>Jugador</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sección 2: Estadísticas del Minuto 15 */}
        <div className="border border-gray-800 bg-[#0F121C]/40 rounded-xl p-6 mt-8">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
               <span className="text-purple-400">🎯</span> Estadísticas del Minuto 15:00
            </h2>

            <div className="mt-6 flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-2 flex items-center gap-1">🐉 Primer Dragón</span>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-cyan-900/50 bg-cyan-900/20 text-cyan-400 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Equipo Azul
                </button>
                <button className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-gray-800 bg-[#0A0D14] text-gray-400 text-xs hover:border-red-900/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Equipo Rojo
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Azul Stats */}
            <div className="border border-cyan-900/40 bg-[#0A0D14]/70 rounded-xl p-5">
              <h3 className="text-cyan-400 font-medium flex items-center gap-2 mb-4 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Equipo Azul
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="blue-kills-15" className="text-xs text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-800 pb-1">⚔️ Asesinatos @ 15</label>
                  <input id="blue-kills-15" type="number" defaultValue={0} className="w-full bg-[#0A0D14] border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300 focus:border-cyan-500/50 outline-none mt-1" />
                </div>
                <div>
                  <label htmlFor="blue-assists-15" className="text-xs text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-800 pb-1">👥 Asistencias @ 15</label>
                  <input id="blue-assists-15" type="number" defaultValue={0} className="w-full bg-[#0A0D14] border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300 focus:border-cyan-500/50 outline-none mt-1" />
                </div>
                <div>
                  <label htmlFor="blue-deaths-15" className="text-xs text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-800 pb-1">💀 Muertes @ 15</label>
                  <input id="blue-deaths-15" type="number" defaultValue={0} className="w-full bg-[#0A0D14] border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300 focus:border-cyan-500/50 outline-none mt-1" />
                </div>
              </div>
            </div>

            {/* Rojo Stats */}
            <div className="border border-red-900/40 bg-[#0A0D14]/70 rounded-xl p-5">
              <h3 className="text-red-400 font-medium flex items-center gap-2 mb-4 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Equipo Rojo
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="red-kills-15" className="text-xs text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-800 pb-1">⚔️ Asesinatos @ 15</label>
                  <input id="red-kills-15" type="number" defaultValue={0} className="w-full bg-[#0A0D14] border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300 focus:border-red-500/50 outline-none mt-1" />
                </div>
                <div>
                  <label htmlFor="red-assists-15" className="text-xs text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-800 pb-1">👥 Asistencias @ 15</label>
                  <input id="red-assists-15" type="number" defaultValue={0} className="w-full bg-[#0A0D14] border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300 focus:border-red-500/50 outline-none mt-1" />
                </div>
                <div>
                  <label htmlFor="red-deaths-15" className="text-xs text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-800 pb-1">💀 Muertes @ 15</label>
                  <input id="red-deaths-15" type="number" defaultValue={0} className="w-full bg-[#0A0D14] border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300 focus:border-red-500/50 outline-none mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Diferenciales */}
          <div className="mt-8 pt-6 border-t border-gray-800/80">
            <h3 className="text-sm text-center text-gray-300 mb-6">Diferenciales @ 15:00</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="border border-gray-800 bg-[#0A0D14] rounded-xl p-4">
                <label htmlFor="diff-gold" className="text-xs text-yellow-500 flex items-center gap-1 mb-3">💰 Diferencia de Oro</label>
                <input id="diff-gold" type="number" defaultValue={0} className="w-full bg-[#0F121C] border border-gray-800 rounded-lg p-2 text-sm text-gray-300 outline-none mb-2" />
                <span className="text-[10px] text-gray-600 block leading-tight">Positivo favorece azul, negativo favorece rojo</span>
              </div>

              <div className="border border-gray-800 bg-[#0A0D14] rounded-xl p-4 flex flex-col items-center justify-center">
                <div className="text-xs text-blue-400 flex items-center gap-1 mb-4">⭐ Ventaja de Niveles (Global)</div>
                <div className="flex items-center justify-between w-full max-w-[150px] bg-[#0F121C] border border-gray-800 rounded-lg px-4 py-1.5 mb-3">
                  <button className="text-gray-500 hover:text-white px-2">-</button>
                  <span className="text-lg font-medium">0</span>
                  <button className="text-gray-500 hover:text-white px-2">+</button>
                </div>
                <div className="w-full h-[2px] bg-gray-800 rounded-full mb-3 flex relative">
                  <div className="absolute left-1/2 w-[2px] h-2 -top-[3px] bg-gray-600"></div>
                </div>
                <span className="text-[10px] text-gray-600 block text-center leading-tight">Diferencia total sumando las 5 posiciones<br/><br/>Positivo favorece azul, negativo favorece rojo</span>
              </div>

              <div className="border border-gray-800 bg-[#0A0D14] rounded-xl p-4">
                <label htmlFor="diff-cs" className="text-xs text-green-400 flex items-center gap-1 mb-3">🎯 Diferencia de CS (Farmeo)</label>
                <input id="diff-cs" type="number" defaultValue={0} className="w-full bg-[#0F121C] border border-gray-800 rounded-lg p-2 text-sm text-gray-300 outline-none mb-2" />
                <span className="text-[10px] text-gray-600 block leading-tight">Positivo favorece azul, negativo favorece rojo</span>
              </div>

            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-10">
          <button className="bg-gradient-to-r from-cyan-800 to-blue-900 hover:from-cyan-700 hover:to-blue-800 border border-cyan-500/30 text-cyan-50 text-sm font-medium py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.2)] transition-all transform hover:scale-[1.02]">
            Ejecutar Modelo Predictivo
          </button>
        </div>

      </div>
    </div>
  );
}
