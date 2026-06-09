import os
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from dotenv import load_dotenv
from datetime import datetime

# 1. CONFIGURACIÓN DE RUTAS DINÁMICAS
# Tomamos la raíz del proyecto (tfg/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Cargamos el archivo .env desde la raíz
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(env_path)

# Variables de la base de datos
DB_USER = os.getenv("POSTGRES_USER")
DB_PASS = os.getenv("POSTGRES_PASSWORD")
DB_NAME = os.getenv("POSTGRES_DB")
DB_HOST = os.getenv(
    "POSTGRES_HOST", "localhost"
)  # Cambiar a 'postgres_db' si este script se dockeriza en el futuro
DB_PORT = os.getenv("POSTGRES_PORT", "5432")


# 2. CONEXIÓN A POSTGRESQL CON SQLALCHEMY
try:
    engine = create_engine(
        f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    print("✅ Conexión a PostgreSQL establecida con éxito.")
except Exception as e:
    print(f"❌ Error crítico al conectar con la base de datos: {e}")
    exit(1)


# 3. CÁLCULO DE ESTADÍSTICAS HISTÓRICAS
def calcular_historial_backend(df):
    print("🔄 Procesando datos históricos y calculando métricas avanzadas (EWM)...")
    df_jugadores = df[df["position"] != "team"].copy()
    df_equipos = df[df["position"] == "team"].copy()

    dict_stats = {"players": {}, "champs_wr": {}, "champs_early": {}, "teams": {}}

    # WR de Jugadores
    df_jugadores["player_win_ratio"] = df_jugadores.groupby("playername")[
        "result"
    ].transform(lambda x: x.ewm(span=20, min_periods=1).mean().round(4))
    df_jugadores["player_games"] = df_jugadores.groupby("playername")[
        "result"
    ].transform(lambda x: x.expanding().count())
    last_player = df_jugadores.drop_duplicates(subset=["playername"], keep="last")
    for _, row in last_player.iterrows():
        dict_stats["players"][row["playername"]] = (
            0.5 if row["player_games"] < 20 else row["player_win_ratio"]
        )

    # WR de Campeones
    df_jugadores["champ_win_ratio"] = df_jugadores.groupby("champion")[
        "result"
    ].transform(lambda x: x.ewm(span=20, min_periods=1).mean().round(4))
    df_jugadores["champ_wr_games"] = df_jugadores.groupby("champion")[
        "result"
    ].transform(lambda x: x.expanding().count())
    last_champ = df_jugadores.drop_duplicates(subset=["champion"], keep="last")
    for _, row in last_champ.iterrows():
        dict_stats["champs_wr"][row["champion"]] = (
            0.5 if row["champ_wr_games"] < 20 else row["champ_win_ratio"]
        )

    # Early Power de Campeones
    df_jugadores["golddiffat15"] = df_jugadores["golddiffat15"].fillna(0)
    df_jugadores["champ_gold_mean"] = df_jugadores.groupby("champion")[
        "golddiffat15"
    ].transform(lambda x: x.ewm(span=20, min_periods=1).mean().round(4))
    df_jugadores["champ_games"] = df_jugadores.groupby("champion")[
        "golddiffat15"
    ].transform(lambda x: x.expanding().count())
    last_champ_gold = df_jugadores.drop_duplicates(subset=["champion"], keep="last")
    for _, row in last_champ_gold.iterrows():
        dict_stats["champs_early"][row["champion"]] = (
            0 if row["champ_games"] < 20 else row["champ_gold_mean"]
        )

    # WR de Equipos
    df_equipos["team_wr_val"] = df_equipos.groupby("teamname")["result"].transform(
        lambda x: x.ewm(span=20, min_periods=1).mean().round(4)
    )
    df_equipos["team_games"] = df_equipos.groupby("teamname")["result"].transform(
        lambda x: x.expanding().count()
    )
    last_team = df_equipos.drop_duplicates(subset=["teamname"], keep="last")
    for _, row in last_team.iterrows():
        dict_stats["teams"][row["teamname"]] = (
            0.5 if row["team_games"] < 20 else row["team_wr_val"]
        )

    return dict_stats


def ejecutar_pipeline():
    # 4. CARGA DE CSVs DESDE LA CARPETA DATA
    data_dir = os.path.join(BASE_DIR, "data", "filtered")
    print(f"📂 Buscando archivos CSV en: {data_dir}")

    csv_files = [f"LECdata-{year}.csv" for year in range(2021, 2026)]
    dfs = []

    for file in csv_files:
        path = os.path.join(data_dir, file)
        if os.path.exists(path):
            dfs.append(pd.read_csv(path, low_memory=False))
        else:
            print(f"⚠️ Advertencia: No se encontró el archivo {file}, se omitirá.")

    if not dfs:
        print("❌ Error: No se encontraron archivos históricos para procesar.")
        return

    df_historico = pd.concat(dfs, ignore_index=True)
    df_historico["teamname"] = df_historico["teamname"].replace(
        {"MAD Lions KOI": "KOI", "Movistar KOI": "KOI"}
    )

    # 5. CÁLCULO DE ESTADÍSTICAS
    backend_stats = calcular_historial_backend(df_historico)

    # 6. TRANSFORMACIÓN A DATAFRAMES Y SUBIDA A DB
    now = datetime.now()
    print("📤 Subiendo tablas optimizadas a PostgreSQL...")

    # Creamos la cadena de conexión directa para Pandas
    db_uri = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    # Equipos
    df_teams = pd.DataFrame(
        list(backend_stats["teams"].items()), columns=["teamname", "win_ratio"]
    )
    df_teams["updated_at"] = now
    df_teams.to_sql("team_stats", db_uri, if_exists="replace", index=False)

    # Jugadores
    df_players = pd.DataFrame(
        list(backend_stats["players"].items()), columns=["playername", "win_ratio"]
    )
    df_players["updated_at"] = now
    df_players.to_sql("player_stats", db_uri, if_exists="replace", index=False)

    # Campeones
    todos_los_champs = set(
        list(backend_stats["champs_wr"].keys())
        + list(backend_stats["champs_early"].keys())
    )
    lista_champs = []
    for champ in todos_los_champs:
        lista_champs.append(
            {
                "champion_name": champ,
                "win_ratio": backend_stats["champs_wr"].get(champ, 0.5),
                "early_power": backend_stats["champs_early"].get(champ, 0.0),
                "updated_at": now,
            }
        )
    df_champs = pd.DataFrame(lista_champs)
    df_champs.to_sql("champion_stats", db_uri, if_exists="replace", index=False)

    print("🚀 ¡Todo listo! Base de datos inicializada y poblada correctamente.")


if __name__ == "__main__":
    ejecutar_pipeline()
