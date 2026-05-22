import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
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
    except Exception:
        app.state.model_loaded = False
        logger.exception("Error crítico al cargar el modelo")
        raise RuntimeError("El modelo no pudo ser cargado correctamente.")

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
# localhost durante el desarrollo, agregar url en producción (ej: CORS_ORIGINS=https://tu-frontend.vercel.app)
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
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
    model_loaded = getattr(app.state, "model_loaded", False)

    if not model_loaded:
        # Si el modelo falla, devolvemos un error 503 para que Docker lo sepa
        return JSONResponse(
            status_code=503,
            content={
                "status": "degraded",
                "model_status": "unavailable",
                "message": "API activa, pero el modelo de ML no se pudo cargar.",
            },
        )

    # Si todo va bien, FastAPI devuelve un 200 OK por defecto
    return {
        "status": "online",
        "model_status": "ready",
        "message": "API de Predicción de la LEC operativa.",
    }
