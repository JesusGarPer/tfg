import pandas as pd
import os

print("Iniciando proceso de filtrado...")

os.makedirs("data/filtered", exist_ok=True)

años = ["2021", "2022", "2023", "2024", "2025"]

for año in años:
    ruta_raw = f"data/raw/data-{año}.csv"
    ruta_filtered = f"data/filtered/LECdata-{año}.csv"

    print(f"-> Leyendo {ruta_raw} (esto tardará un poco...)")

    df_raw = pd.read_csv(ruta_raw, low_memory=False)
    df_lec = df_raw[df_raw["league"] == "LEC"]
    df_lec.to_csv(ruta_filtered, index=False)

    print(f"   ¡Guardado! {ruta_filtered} ({len(df_lec)} filas)")

print(
    "\n¡Filtrado completado! Los archivos filtrados se encuentran en 'data/filtered/'."
)
