from pydantic import BaseModel
from typing import Dict


class PlayerData(BaseModel):
    nombre: str
    campeon: str


class TeamData(BaseModel):
    teamname: str
    playoffs: int
    side: str
    jugadores: Dict[str, PlayerData]


class MatchStats15(BaseModel):
    kills_azul: float
    kills_rojo: float
    assists_azul: float
    assists_rojo: float
    deaths_azul: float
    deaths_rojo: float
    gold_diff: float
    xp_diff: float
    cs_diff: float


class MatchRequest(BaseModel):
    first_dragon_team: str
    stats_min_15: MatchStats15
    equipo_azul: TeamData
    equipo_rojo: TeamData
