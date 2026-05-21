from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from app.models_ml import ejecutar_inferencia
from app.schemas import MatchRequest
from app.database import get_db
import logging

router = APIRouter()
logger = logging.getLogger("uvicorn.error")


class MatchDataInput(BaseModel):
    playoffs: int
    side: str
    teamname: str
    team_wr: float
    champ_top: str
    champ_jng: str
    champ_mid: str
    champ_bot: str
    champ_sup: str
    wr_champ_top: float
    wr_champ_jng: float
    wr_champ_mid: float
    wr_champ_bot: float
    wr_champ_sup: float
    firstdragon: float
    golddiffat15: float
    xpdiffat15: float
    csdiffat15: float
    killsat15: float
    assistsat15: float
    deathsat15: float
    wr_top: float
    wr_jng: float
    wr_mid: float
    wr_bot: float
    wr_sup: float
    comp_early_power: float


@router.post("/predict")
async def predict_win(data: MatchDataInput):
    """
    Ruta que recibe un JSON Payload con las características de una partida al minuto 15.
    Llama a la función ejecutar_inferencia y devuelve la probabilidad estimada de victoria.
    """
    try:
        # Llamamos al modelo que tenemos cargado en memoria, extrayendo el diccionario de Pydantic
        probabilidad = ejecutar_inferencia(data.model_dump())

        return {
            "success": True,
            "win_probability": float(probabilidad),
            "message": "Inferencia calculada correctamente",
        }
    except ValueError as ve:
        # Error conocido (el modelo no cargó o faltan características)
        logger.error(f"Error de validación en /predict: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Error inesperado (caída genérica)
        logger.error(f"Excepción en /predict: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Error interno calculando la predicción"
        )


# LÓGICA DE BACKEND PARA PREPARAR DATOS EXTRAÍDA DEL NOTEBOOK
def procesar_equipo(
    datos_equipo: dict, is_blue: bool, form_stats: dict, backend_dict: dict
):
    """
    Toma los datos del formulario de un equipo y los cruza con el historial falso o BD.
    (En un entorno real, `backend_dict` se sustituye por consultas a una base de datos).
    """
    equipo = datos_equipo["teamname"]

    # Cálculos en min 15 respecto a la perspectiva del equipo actual
    signo = 1 if is_blue else -1

    # Variables directas del formulario
    playoffs = datos_equipo["playoffs"]
    side = datos_equipo["side"]

    # Usando el nuevo enfoque de "Blue", "Red" o "None"
    if form_stats["first_dragon_team"] == "Blue" and is_blue:
        firstdragon = 1
    elif form_stats["first_dragon_team"] == "Red" and not is_blue:
        firstdragon = 1
    else:
        firstdragon = 0

    golddiffat15 = form_stats["stats_min_15"]["gold_diff"] * signo
    xpdiffat15 = form_stats["stats_min_15"]["xp_diff"] * signo
    csdiffat15 = form_stats["stats_min_15"]["cs_diff"] * signo

    if is_blue:
        killsat15 = form_stats["stats_min_15"]["kills_azul"]
        assistsat15 = form_stats["stats_min_15"]["assists_azul"]
        deathsat15 = form_stats["stats_min_15"]["deaths_azul"]
    else:
        killsat15 = form_stats["stats_min_15"]["kills_rojo"]
        assistsat15 = form_stats["stats_min_15"]["assists_rojo"]
        deathsat15 = form_stats["stats_min_15"]["deaths_rojo"]

    champ_top = datos_equipo["jugadores"]["top"]["campeon"]
    champ_jng = datos_equipo["jugadores"]["jng"]["campeon"]
    champ_mid = datos_equipo["jugadores"]["mid"]["campeon"]
    champ_bot = datos_equipo["jugadores"]["bot"]["campeon"]
    champ_sup = datos_equipo["jugadores"]["sup"]["campeon"]

    # Aquí usaríamos la BD, por ahora usamos "0.5" o el valor neutral por defecto
    team_wr = backend_dict.get("teams", {}).get(equipo, 0.5)
    wr_top = backend_dict.get("players", {}).get(
        datos_equipo["jugadores"]["top"]["nombre"], 0.5
    )
    wr_jng = backend_dict.get("players", {}).get(
        datos_equipo["jugadores"]["jng"]["nombre"], 0.5
    )
    wr_mid = backend_dict.get("players", {}).get(
        datos_equipo["jugadores"]["mid"]["nombre"], 0.5
    )
    wr_bot = backend_dict.get("players", {}).get(
        datos_equipo["jugadores"]["bot"]["nombre"], 0.5
    )
    wr_sup = backend_dict.get("players", {}).get(
        datos_equipo["jugadores"]["sup"]["nombre"], 0.5
    )

    wr_champ_top = backend_dict.get("champs_wr", {}).get(champ_top, 0.5)
    wr_champ_jng = backend_dict.get("champs_wr", {}).get(champ_jng, 0.5)
    wr_champ_mid = backend_dict.get("champs_wr", {}).get(champ_mid, 0.5)
    wr_champ_bot = backend_dict.get("champs_wr", {}).get(champ_bot, 0.5)
    wr_champ_sup = backend_dict.get("champs_wr", {}).get(champ_sup, 0.5)

    comp_early_power = (
        backend_dict.get("champs_early", {}).get(champ_top, 0)
        + backend_dict.get("champs_early", {}).get(champ_jng, 0)
        + backend_dict.get("champs_early", {}).get(champ_mid, 0)
        + backend_dict.get("champs_early", {}).get(champ_bot, 0)
        + backend_dict.get("champs_early", {}).get(champ_sup, 0)
    )

    return {
        "playoffs": playoffs,
        "side": side,
        "teamname": equipo,
        "team_wr": team_wr,
        "champ_top": champ_top,
        "champ_jng": champ_jng,
        "champ_mid": champ_mid,
        "champ_bot": champ_bot,
        "champ_sup": champ_sup,
        "wr_champ_top": wr_champ_top,
        "wr_champ_jng": wr_champ_jng,
        "wr_champ_mid": wr_champ_mid,
        "wr_champ_bot": wr_champ_bot,
        "wr_champ_sup": wr_champ_sup,
        "firstdragon": float(firstdragon),
        "golddiffat15": float(golddiffat15),
        "xpdiffat15": float(xpdiffat15),
        "csdiffat15": float(csdiffat15),
        "killsat15": float(killsat15),
        "assistsat15": float(assistsat15),
        "deathsat15": float(deathsat15),
        "wr_top": float(wr_top),
        "wr_jng": float(wr_jng),
        "wr_mid": float(wr_mid),
        "wr_bot": float(wr_bot),
        "wr_sup": float(wr_sup),
        "comp_early_power": float(comp_early_power),
    }


def obtener_metricas_bd(db: Session):
    """Extrae todos los diccionarios de métricas históricas de la DB."""
    if not db:
        return {}

    stats = {"teams": {}, "players": {}, "champs_wr": {}, "champs_early": {}}

    # Equipos
    for row in db.execute(
        text("SELECT teamname, win_ratio FROM team_stats")
    ).fetchall():
        stats["teams"][row[0]] = float(row[1])

    # Jugadores
    for row in db.execute(
        text("SELECT playername, win_ratio FROM player_stats")
    ).fetchall():
        stats["players"][row[0]] = float(row[1])

    # Campeones
    for row in db.execute(
        text("SELECT champion_name, win_ratio, early_power FROM champion_stats")
    ).fetchall():
        stats["champs_wr"][row[0]] = float(row[1])
        stats["champs_early"][row[0]] = float(row[2])

    return stats


@router.post("/predict-match")
async def predict_full_match(match_data: MatchRequest, db: Session = Depends(get_db)):
    """
    Ruta que simula el proceso completo del formulario web.
    Calcula las predicciones para ambos lados y las balancea para que sumen 100%.
    """
    try:
        # Convertimos la petición de Pydantic a diccionarios
        form_stats_dict = match_data.model_dump()

        # Realizamos la llamada a la BD real (o un placeholder si está caída)
        backend_stats = obtener_metricas_bd(db)

        # Procesamos lado azul y rojo
        vector_azul = procesar_equipo(
            form_stats_dict["equipo_azul"], True, form_stats_dict, backend_stats
        )
        vector_rojo = procesar_equipo(
            form_stats_dict["equipo_rojo"], False, form_stats_dict, backend_stats
        )

        # Ejecutamos las inferencias individuales
        prob_azul_bruta = ejecutar_inferencia(vector_azul)
        prob_rojo_bruta = ejecutar_inferencia(vector_rojo)

        # Balanceamos las probabilidades para que sumen el 100% como en el Jupyter
        prob_azul_final = (prob_azul_bruta + (1.0 - prob_rojo_bruta)) / 2.0
        prob_rojo_final = (prob_rojo_bruta + (1.0 - prob_azul_bruta)) / 2.0

        return {
            "success": True,
            "blue_team": form_stats_dict["equipo_azul"]["teamname"],
            "red_team": form_stats_dict["equipo_rojo"]["teamname"],
            "win_probability_blue": round(float(prob_azul_final), 4),
            "win_probability_red": round(float(prob_rojo_final), 4),
            "message": "Partida evaluada globalmente y balanceada",
        }

    except ValueError as ve:
        logger.error(f"Error de validación en /predict-match: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Excepción en /predict-match: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Error interno calculando la partida completa"
        )
