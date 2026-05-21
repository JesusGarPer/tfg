import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager
from app.models_ml import cargar_modelo
from app.routes import prediction, data_api

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Acciones al arrancar el servidor
    try:
        logger.info("Iniciando servicio y cargando artefactos de Machine Learning...")
        cargar_modelo()
        app.state.model_loaded = True
    except Exception as e:
        logger.error(f"Error crítico al cargar el modelo: {e}")
        app.state.model_loaded = False

    yield

    # Acciones al apagar el servidor (limpieza de recursos)
    logger.info("Apagando servidor y liberando recursos...")


app = FastAPI(
    title="LoL LEC Win Predictor API",
    description="Backend asíncrono para la predicción de victorias al minuto 15",
    version="1.0.0",
    lifespan=lifespan,
)

# Configuración del CORS (Vital para que tu Frontend React en local pueda consumir la API)
# Leemos los orígenes permitidos desde las variables de entorno, o usamos "*" como fallback genérico para desarrollo.
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluimos las rutas de predicción de la carpeta /routes
app.include_router(prediction.router, prefix="/api", tags=["Predicciones"])
app.include_router(data_api.router, prefix="/api/data", tags=["Datos Base"])


@app.get("/", tags=["Health"])
def read_root():
    # Redirigir a la documentación automática /docs es de mucha ayuda cuando abres el host por defecto
    return RedirectResponse(url="/docs")


@app.get("/health", tags=["Health"])
def health_check():
    """Ruta para comprobar que el contenedor o servidor está ejecutándose correctamente y tiene los modelos listos."""
    status_model = "ready" if app.state.model_loaded else "unavailable"
    return {
        "status": "online",
        "model_status": status_model,
        "message": "API de Predicción de la LEC operativa.",
    }
