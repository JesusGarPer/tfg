import joblib
import os
import logging
import pandas as pd

logger = logging.getLogger("uvicorn.error")

# Variables globales que contendrán el modelo y sus preprocesadores en memoria
modelo_predictivo = None
scaler = None
label_encoders = None


def cargar_modelo():
    """Carga los artefactos .pkl en memoria al iniciar la aplicación"""
    global modelo_predictivo, scaler, label_encoders

    # base_dir apunta a la carpeta backend
    base_dir = os.path.dirname(os.path.dirname(__file__))

    ruta_modelo = os.path.join(base_dir, "models", "modelo_regresion_logistica.pkl")
    ruta_scaler = os.path.join(base_dir, "models", "scaler.pkl")
    ruta_encoders = os.path.join(base_dir, "models", "label_encoders.pkl")

    try:
        if (
            os.path.exists(ruta_modelo)
            and os.path.exists(ruta_scaler)
            and os.path.exists(ruta_encoders)
        ):
            modelo_predictivo = joblib.load(ruta_modelo)
            scaler = joblib.load(ruta_scaler)
            label_encoders = joblib.load(ruta_encoders)
            logger.info(
                "✅ Artefactos de ML (modelo, scaler, encoders) cargados correctamente en memoria."
            )
        else:
            raise FileNotFoundError(
                "Faltan algunos archivos .pkl en la ruta del modelo. Asegúrate de ejecutar el notebook previo."
            )
    except Exception:
        logger.exception("❌ Error crítico al intentar cargar los artefactos de ML")
        raise


def ejecutar_inferencia(datos_entrada_dict):
    """
    Recibe un diccionario con las características. Aplica codificación, escalado
    e infiere la probabilidad de victoria.
    """
    if None in (modelo_predictivo, scaler, label_encoders):
        raise ValueError("Los artefactos de ML no están cargados en memoria.")

    # Hacemos una copia para no alterar el diccionario original por referencia
    datos_procesados = datos_entrada_dict.copy()

    # Transformamos las variables categóricas
    for col, le in label_encoders.items():
        if col in datos_procesados:
            valor_str = str(datos_procesados[col])

            # Si el valor no fue visto durante el entrenamiento, detenemos la inferencia y lanzamos un error claro
            if valor_str not in le.classes_:
                raise ValueError(
                    f"Valor desconocido '{valor_str}' para la variable '{col}'."
                )

            datos_procesados[col] = le.transform([valor_str])[0]

    # Convertimos el diccionario a un array manteniendo el orden exacto en el que se entrenó el modelo
    orden_variables = [
        "playoffs",
        "side",
        "teamname",
        "team_wr",
        "champ_top",
        "champ_jng",
        "champ_mid",
        "champ_bot",
        "champ_sup",
        "wr_champ_top",
        "wr_champ_jng",
        "wr_champ_mid",
        "wr_champ_bot",
        "wr_champ_sup",
        "firstdragon",
        "golddiffat15",
        "xpdiffat15",
        "csdiffat15",
        "killsat15",
        "assistsat15",
        "deathsat15",
        "wr_top",
        "wr_jng",
        "wr_mid",
        "wr_bot",
        "wr_sup",
        "comp_early_power",
    ]

    # Usamos .get(col, 0) para proveer un valor nulo por si alguna vez falta un dato no rompa el backend
    valores = [[datos_procesados.get(col, 0) for col in orden_variables]]

    # Envolvemos los datos en un DataFrame con los nombres exactos para que scikit-learn no envie warnings
    df_vector = pd.DataFrame(valores, columns=orden_variables)

    # Escalamos los datos
    vector_escalado = scaler.transform(df_vector)

    # Obtenemos la probabilidad de victoria
    prediccion = modelo_predictivo.predict_proba(vector_escalado)
    probabilidad_victoria = prediccion[0][1]

    return probabilidad_victoria
