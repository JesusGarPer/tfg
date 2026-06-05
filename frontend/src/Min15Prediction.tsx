import { useState, useEffect, type FormEvent } from 'react';
import { getChampImage, getTeamLogo } from './utils/imageMapping';
import SearchableSelect from './utils/SearchableSelect';

interface Props {
  onBack: () => void;
}

const ROLES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

const TEAMS = [
  {
    id: 'blue', name: 'Equipo Azul',
    badgeBg: 'bg-cyan-400', textTitle: 'text-cyan-400',
    containerBorder: 'border-cyan-900/50', statsBorder: 'border-cyan-900/40',
    inputFocus: 'focus:border-cyan-500/50'
  },
  {
    id: 'red', name: 'Equipo Rojo',
    badgeBg: 'bg-red-400', textTitle: 'text-red-400',
    containerBorder: 'border-red-900/50', statsBorder: 'border-red-900/40',
    inputFocus: 'focus:border-red-500/50'
  }
];

const DEFAULT_ROSTERS: Record<string, Record<string, string>> = {
  'Karmine Corp': { top: 'Canna', jungle: 'Yike', mid: 'kyeahoo', adc: 'Caliste', support: 'Busio' },
  'KOI': { top: 'Myrwwn', jungle: 'Elyoya', mid: 'Jojopyun', adc: 'Supa', support: 'Alvaro' },
  'G2 Esports': { top: 'BrokenBlade', jungle: 'SkewMond', mid: 'Caps', adc: 'Hans Sama', support: 'Labrov' },
  'Team Heretics': { top: 'Tracyn', jungle: 'Daglas', mid: 'Serin', adc: 'Hype', support: 'Way' },
  'Fnatic': { top: 'Empyros', jungle: 'Razork', mid: 'Vladi', adc: 'Upset', support: 'Lospa' },
  'Natus Vincere': { top: 'Maynter', jungle: 'Rhilech', mid: 'Poby', adc: 'SamD', support: 'Parus' },
  'Team Vitality': { top: 'Naak Nako', jungle: 'Lyncas', mid: 'Humanoid', adc: 'Carzzy', support: 'Fleshy' },
  'GiantX': { top: 'Lot', jungle: 'ISMA', mid: 'Jackies', adc: 'Noah', support: 'Jun' },
  'Shifters': { top: 'Rooster', jungle: 'Boukada', mid: 'nuc', adc: 'Paduck', support: 'Stend' },
  'SK Gaming': { top: 'Wunder', jungle: 'Skeanz', mid: 'LIDER', adc: 'Jopa', support: 'Mikyx' }
};

export default function Min15Prediction({ onBack }: Props) {
  const [teamsData, setTeamsData] = useState<string[]>([]);
  const [playersData, setPlayersData] = useState<string[]>([]);
  const [champsData, setChampsData] = useState<string[]>([]);

  const [firstDragon, setFirstDragon] = useState<"Blue" | "Red" | "None">("None");
  const [levelAdvantage, setLevelAdvantage] = useState(0);
  const [isPlayoffs, setIsPlayoffs] = useState(false);

  const [prediction, setPrediction] = useState<{blue: number, red: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para las imagenes dinámicas
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setSelections(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/data/teams')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeamsData(data.map((t: string) => t === 'Team BDS' ? 'Shifters' : t));
        } else {
          setTeamsData([]);
        }
      })
      .catch(console.error);

    fetch('http://localhost:8000/api/data/players')
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setPlayersData(data) : setPlayersData([]))
      .catch(console.error);

    fetch('http://localhost:8000/api/data/champions')
      .then(res => res.json())
      .then(async (data) => {
        let finalChamps = Array.isArray(data) ? data : [];
        try {
          // Obtenemos todos los campeones oficiales desde Riot DataDragon (v16.11.1)
          const riotRes = await fetch('https://ddragon.leagueoflegends.com/cdn/16.11.1/data/en_US/champion.json');
          if (riotRes.ok) {
            const riotData = await riotRes.json();
            const riotChamps = Object.values(riotData.data).map((c: any) => c.name);
            // Fusionamos los de la base de datos con los oficiales y quitamos duplicados
            finalChamps = Array.from(new Set([...finalChamps, ...riotChamps])).sort();
          }
        } catch (err) {
          console.warn('No se pudieron obtener campeones extras de DataDragon', err);
        }
        setChampsData(finalChamps);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    const fd = new FormData(e.currentTarget);

    // Función auxiliar para extraer datos de los jugadores de un equipo
    const getTeamData = (teamId: string) => {
      const getPlayer = (roleNameEnHtml: string) => ({
        nombre: fd.get(`${teamId}_player_${roleNameEnHtml}`) as string,
        campeon: fd.get(`${teamId}_champ_${roleNameEnHtml}`) as string
      });

      let rawTeamName = fd.get(`${teamId}_team`) as string;
      if (rawTeamName === 'Shifters') {
        rawTeamName = 'Team BDS';
      }

      return {
        teamname: rawTeamName,
        playoffs: isPlayoffs ? 1 : 0,
        side: teamId === 'blue' ? "Blue" : "Red",
        jugadores: {
          top: getPlayer('top'),
          jng: getPlayer('jungle'),
          mid: getPlayer('mid'),
          bot: getPlayer('adc'),
          sup: getPlayer('support')
        }
      };
    };

    const payload = {
      first_dragon_team: firstDragon,
      stats_min_15: {
        kills_azul: Number(fd.get(`blue_kills_15`)) || 0,
        kills_rojo: Number(fd.get(`red_kills_15`)) || 0,
        assists_azul: Number(fd.get(`blue_assists_15`)) || 0,
        assists_rojo: Number(fd.get(`red_assists_15`)) || 0,
        deaths_azul: Number(fd.get(`blue_deaths_15`)) || 0,
        deaths_rojo: Number(fd.get(`red_deaths_15`)) || 0,
        gold_diff: Number(fd.get(`diff_gold`)) || 0,
        xp_diff: levelAdvantage * 1180, // aproximación de "Ventaja de Niveles" -> xp
        cs_diff: Number(fd.get(`diff_cs`)) || 0,
      },
      equipo_azul: getTeamData('blue'),
      equipo_rojo: getTeamData('red')
    };

    try {
        const res = await fetch('http://localhost:8000/api/predict-match', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errData = await res.json();
            // Si el error es de validación de FastAPI (Pydantic), viene como un array en 'detail'
            if (Array.isArray(errData.detail)) {
              const msg = errData.detail.map((e: any) => `${e.loc.join('.')} -> ${e.msg}`).join('\n');
              throw new Error(msg);
            }
            throw new Error(errData.detail || "Error en la predicción");
        }

        const data = await res.json();
        setPrediction({ blue: data.win_probability_blue, red: data.win_probability_red });
    } catch(err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0D14] text-gray-900 dark:text-white p-6 font-sans">
      {/* Volver */}
      <button onClick={onBack} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white flex items-center gap-2 mb-4 text-sm transition-colors">
        <span>&larr;</span> Volver al Inicio
      </button>

      {/* Titulo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
           <span className="text-cyan-400 text-xl transform -scale-x-100 -rotate-45">🗡️</span> Predicción @ Minuto 15
        </h1>
        <p className="text-gray-500 text-xs mt-1">Configuración completa con estadísticas en tiempo real</p>
      </div>

      <form onSubmit={handleSubmit} onChange={handleFormChange} className="max-w-screen-2xl mx-auto space-y-6 pb-12">
        {/* Sección 1: Configuración de Partida */}
        <div className="flex flex-col items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Configuración de Partida</h2>
            <button
              type="button"
              onClick={() => setIsPlayoffs(!isPlayoffs)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                isPlayoffs
                  ? 'border-yellow-500/50 bg-yellow-900/20 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                  : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#0A0D14] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className={isPlayoffs ? '' : 'grayscale opacity-50'}>🏆</span>
              {isPlayoffs ? 'Playoffs' : 'Temporada Regular'}
            </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {TEAMS.map(team => {
            return (
            <div key={team.id} className={`border ${team.containerBorder} bg-white/50 dark:bg-[#0F121C]/50 rounded-xl p-6`}>
              <h3 className={`${team.textTitle} font-medium flex items-center gap-2 mb-6`}>
                <span className={`w-2 h-2 rounded-full ${team.badgeBg}`}></span> {team.name}
              </h3>
              <div className="mb-6 relative">
                <label htmlFor={`${team.id}-team-name`} className="text-xs text-gray-500 block mb-1">Nombre del Equipo</label>
                <SearchableSelect
                  name={`${team.id}_team`}
                  options={teamsData}
                  placeholder="Seleccionar equipo..."
                  value={selections[`${team.id}_team`] || ''}
                  onChange={(val) => {
                    setSelections(prev => {
                      const updated = { ...prev, [`${team.id}_team`]: val };
                      const roster = DEFAULT_ROSTERS[val];
                      if (roster) {
                        updated[`${team.id}_player_top`] = roster.top;
                        updated[`${team.id}_player_jungle`] = roster.jungle;
                        updated[`${team.id}_player_mid`] = roster.mid;
                        updated[`${team.id}_player_adc`] = roster.adc;
                        updated[`${team.id}_player_support`] = roster.support;
                      }
                      return updated;
                    });
                  }}
                  getImage={getTeamLogo}
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 block mb-3">Composición (5 jugadores)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                  {ROLES.map(role => {

                    return (
                      <div key={role} className="flex flex-col gap-2 relative">
                        <span className="text-[10px] text-gray-500 text-center lowercase">{role}</span>

                        <div className="relative">
                            <SearchableSelect
                            name={`${team.id}_champ_${role.toLowerCase()}`}
                            options={champsData}
                            placeholder="Campeón"
                            value={selections[`${team.id}_champ_${role.toLowerCase()}`] || ''}
                            onChange={(val) => setSelections(prev => ({ ...prev, [`${team.id}_champ_${role.toLowerCase()}`]: val }))}
                            getImage={getChampImage}
                            />
                        </div>

                        <div className="relative mt-1">
                            <SearchableSelect
                            name={`${team.id}_player_${role.toLowerCase()}`}
                            options={playersData}
                            placeholder="Jugador"
                            value={selections[`${team.id}_player_${role.toLowerCase()}`] || ''}
                            onChange={(val) => setSelections(prev => ({ ...prev, [`${team.id}_player_${role.toLowerCase()}`]: val }))}
                            />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )})}
        </div>

        {/* Sección 2: Estadísticas del Minuto 15 */}
        <div className="border border-gray-500 dark:border-gray-800 bg-white/40 dark:bg-[#0F121C]/40 rounded-xl p-6 mt-8">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
               <span className="text-purple-400">🎯</span> Estadísticas del Minuto 15:00
            </h2>

            <div className="mt-6 flex flex-col items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">🐉 Primer Dragón</span>
              <div className="flex gap-4">
                <button type="button" onClick={() => setFirstDragon(prev => prev === 'Blue' ? 'None' : 'Blue')} className={`flex items-center gap-2 px-5 py-1.5 rounded-full border ${firstDragon === 'Blue' ? 'border-cyan-400 bg-cyan-900/40 text-cyan-400' : 'border-gray-500 dark:border-gray-800 bg-gray50 dark:bg-[#0A0D14] text-gray-500 hover:text-cyan-400'} text-xs transition-colors`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Equipo Azul
                </button>
                <button type="button" onClick={() => setFirstDragon(prev => prev === 'Red' ? 'None' : 'Red')} className={`flex items-center gap-2 px-5 py-1.5 rounded-full border ${firstDragon === 'Red' ? 'border-red-400 bg-red-900/40 text-red-400' : 'border-gray-500 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0D14] text-gray-500 hover:text-red-400'} text-xs transition-colors`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Equipo Rojo
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAMS.map(team => (
              <div key={team.id} className={`border ${team.statsBorder} bg-gray-50/70 dark:bg-[#0A0D14]/70 rounded-xl p-5`}>
                <h3 className={`${team.textTitle} font-medium flex items-center gap-2 mb-4 text-sm`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${team.badgeBg}`}></span> {team.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor={`${team.id}-kills-15`} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-200 dark:border-gray-800 pb-1">⚔️ Asesinatos @ 15</label>
                    <input id={`${team.id}-kills-15`} name={`${team.id}_kills_15`} type="number" min={0} step={1} defaultValue={0} className={`w-full bg-gray-300 dark:bg-[#0A0D14] border border-gray-200 dark:border-gray-800 rounded-lg p-2.5 text-sm text-gray-800 dark:text-gray-300 ${team.inputFocus} outline-none mt-1`} />
                  </div>
                  <div>
                    <label htmlFor={`${team.id}-assists-15`} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-200 dark:border-gray-800 pb-1">👥 Asistencias @ 15</label>
                    <input id={`${team.id}-assists-15`} name={`${team.id}_assists_15`} type="number" min={0} step={1} defaultValue={0} className={`w-full bg-gray-300 dark:bg-[#0A0D14] border border-gray-200 dark:border-gray-800 rounded-lg p-2.5 text-sm text-gray-800 dark:text-gray-300 ${team.inputFocus} outline-none mt-1`} />
                  </div>
                  <div>
                    <label htmlFor={`${team.id}-deaths-15`} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1 border-b border-gray-200 dark:border-gray-800 pb-1">💀 Muertes @ 15</label>
                    <input id={`${team.id}-deaths-15`} name={`${team.id}_deaths_15`} type="number" min={0} step={1} defaultValue={0} className={`w-full bg-gray-300 dark:bg-[#0A0D14] border border-gray-200 dark:border-gray-800 rounded-lg p-2.5 text-sm text-gray-800 dark:text-gray-300 ${team.inputFocus} outline-none mt-1`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Diferenciales */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800/80">
            <h3 className="text-sm text-center text-gray-800 dark:text-gray-300 mb-6">Diferenciales @ 15:00</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="border border-gray-200 dark:border-gray-800 bg-gray-300 dark:bg-[#0A0D14] rounded-xl p-4">
                <label htmlFor="diff-gold" className="text-xs text-yellow-500 flex items-center gap-1 mb-3">💰 Diferencia de Oro</label>
                <input id="diff-gold" name="diff_gold" type="number" defaultValue={0} className="w-full bg-white dark:bg-[#0F121C] border border-gray-200 dark:border-gray-800 rounded-lg p-2 text-sm text-gray-800 dark:text-gray-300 outline-none mb-2" />
                <span className="text-[10px] text-gray-600 block leading-tight">Positivo favorece azul, negativo favorece rojo</span>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 bg-gray-300 dark:bg-[#0A0D14] rounded-xl p-4 flex flex-col items-center justify-center">
                <div className="text-xs text-blue-400 flex items-center gap-1 mb-4">⭐ Ventaja de Niveles (Global)</div>
                <div className="flex items-center justify-between w-full max-w-[150px] bg-white dark:bg-[#0F121C] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-1.5 mb-3">
                  <button type="button" onClick={() => setLevelAdvantage(p => p - 1)} className="text-gray-500 hover:text-gray-900 dark:text-white px-2">-</button>
                  <span className="text-lg font-medium">{levelAdvantage}</span>
                  <button type="button" onClick={() => setLevelAdvantage(p => p + 1)} className="text-gray-500 hover:text-gray-900 dark:text-white px-2">+</button>
                </div>
                <div className="w-full h-[2px] bg-gray-800 rounded-full mb-3 flex relative">
                  <div className="absolute left-1/2 w-[2px] h-2 -top-[3px] bg-gray-600"></div>
                </div>
                <span className="text-[10px] text-gray-600 block text-center leading-tight">Diferencia total sumando las 5 posiciones<br/><br/>Positivo favorece azul, negativo favorece rojo</span>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 bg-gray-300 dark:bg-[#0A0D14] rounded-xl p-4">
                <label htmlFor="diff-cs" className="text-xs text-green-400 flex items-center gap-1 mb-3">🎯 Diferencia de CS (Farmeo)</label>
                <input id="diff-cs" name="diff_cs" type="number" defaultValue={0} className="w-full bg-white dark:bg-[#0F121C] border border-gray-200 dark:border-gray-800 rounded-lg p-2 text-sm text-gray-800 dark:text-gray-300 outline-none mb-2" />
                <span className="text-[10px] text-gray-600 block leading-tight">Positivo favorece azul, negativo favorece rojo</span>
              </div>

            </div>
          </div>
        </div>

        {error && (
            <div className="mt-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {error}
            </div>
        )}

        {prediction && (
            <div className="mt-8 p-6 bg-gradient-to-r from-cyan-900/40 flex justify-around to-red-900/40 border border-purple-500/30 rounded-xl text-center">
                <div>
                   <div className="text-cyan-400 font-bold text-3xl">{(prediction.blue * 100).toFixed(1)}%</div>
                   <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Victoria Azul</div>
                </div>
                <div>
                   <div className="text-red-400 font-bold text-3xl">{(prediction.red * 100).toFixed(1)}%</div>
                   <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Victoria Rojo</div>
                </div>
            </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center mt-10">
          <button type="submit" disabled={loading} className={`bg-gradient-to-r from-cyan-800 to-blue-900 hover:from-cyan-700 hover:to-blue-800 border border-cyan-500/30 text-cyan-50 text-sm font-medium py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.2)] transition-all transform hover:scale-[1.02] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? 'Calculando...' : 'Ejecutar Modelo Predictivo'}
          </button>
        </div>

      </form>
    </div>
  );
}
