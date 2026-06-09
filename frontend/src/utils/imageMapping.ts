export const LEC_TEAMS = [
  {
    name: 'Shifters',
    logo: '/logoShifters.webp'
  },
  {
    name: 'Fnatic',
    logo: '/logoFnatic.webp'
  },
  {
    name: 'G2 Esports',
    logo: '/logoG2.webp'
  },
  {
    name: 'Team Heretics',
    logo: '/logoHeretics.jpg'
  },
  {
    name: 'KOI',
    logo: '/logoKOI.jpg'
  },
  {
    name: 'GiantX',
    logo: '/logoGiantX.svg'
  },
  {
    name: 'SK Gaming',
    logo: '/logoSK.png'
  },
  {
    name: 'Karmine Corp',
    logo: '/logoKarmineCorp.jpg'
  },
  {
    name: 'Team Vitality',
    logo: '/logoVitality.png'
  },
  {
    name: 'Natus Vincere',
    logo: '/logoNAVI.png'
  }
];

// Función para obtener el logo del equipo
export const getTeamLogo = (teamName: string | undefined) => {
  if (!teamName) return '';
  const team = LEC_TEAMS.find(t => t.name === teamName);
  return team ? team.logo : `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&background=0D1117&color=06B6D4&bold=true&format=svg`;
};

// Función para obtener la URL de imagen de un campeón desde Riot DataDragon
export const getChampImage = (champName: string | undefined) => {
  if (!champName) return '';
  // Correcciones básicas de formato Riot
  let safeName = champName.replace(/[\s'.]/g, '');
  if (safeName === 'Wukong') safeName = 'MonkeyKing';
  if (safeName === 'RenataGlasc') safeName = 'Renata';
  if (safeName === 'Nunu&Willump') safeName = 'Nunu';
  if (safeName === 'BelVeth') safeName = 'Belveth';
  if (safeName === 'ChoGath') safeName = 'Chogath';
  if (safeName === 'KaiSa') safeName = 'Kaisa';
  if (safeName === 'KhaZix') safeName = 'Khazix';
  if (safeName === 'LeBlanc') safeName = 'Leblanc';
  if (safeName === 'VelKoz') safeName = 'Velkoz';
  return `https://ddragon.leagueoflegends.com/cdn/16.11.1/img/champion/${safeName}.png`;
};
