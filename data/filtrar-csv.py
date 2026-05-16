import pandas as pd
import os
from pathlib import Path

print("Iniciando proceso de filtrado...")

BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = BASE_DIR / "data" / "raw"
FILTERED_DIR = BASE_DIR / "data" / "filtered"
FILTERED_DIR.mkdir(parents=True, exist_ok=True)

años = ["2021", "2022", "2023", "2024", "2025", "2026"]

for año in años:
    ruta_raw = RAW_DIR / f"data-{año}.csv"
    ruta_filtered = FILTERED_DIR / f"LECdata-{año}.csv"

    print(f"-> Leyendo {ruta_raw.name} (esto tardará un poco...)")

    try:
        df_raw = pd.read_csv(ruta_raw, low_memory=False)
        if "league" not in df_raw.columns:
            print(f"   [WARN] Columna 'league' no encontrada en {ruta_raw}. Se omite.")
            continue
        df_lec = df_raw[df_raw["league"] == "LEC"]
        df_lec.to_csv(ruta_filtered, index=False)
    except FileNotFoundError:
        print(f"   [WARN] No existe {ruta_raw}. Se omite.")
        continue
    except Exception as e:
        print(f"   [ERROR] Falló {ruta_raw}: {e}")
        continue

    print(f"   ¡Guardado! {ruta_filtered} ({len(df_lec)} filas)")

print(
    "\n¡Filtrado completado! Los archivos filtrados se encuentran en 'data/filtered/'."
)
