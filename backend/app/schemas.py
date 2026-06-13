from pydantic import BaseModel, Field
from typing import Literal


class PlayerData(BaseModel):
    nombre: str = Field(..., min_length=1)
    campeon: str = Field(..., min_length=1)


class TeamPlayers(BaseModel):
    top: PlayerData
    jng: PlayerData
    mid: PlayerData
    bot: PlayerData
    sup: PlayerData


class TeamData(BaseModel):
    teamname: str = Field(..., min_length=1)
    playoffs: int
    side: Literal["Blue", "Red"]
    jugadores: TeamPlayers


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
    first_dragon_team: Literal["Blue", "Red", "None"]
    stats_min_15: MatchStats15
    equipo_azul: TeamData
    equipo_rojo: TeamData
