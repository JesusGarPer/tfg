# Backend del TFG - Predicción de Partidas LoL

Para arrancar el entorno de desarrollo:
 `uvicorn app.main:app --reload`

Para correr los tests unitarios de la API:
 `python -m pytest tests/test_api.py -v`

Para correr los test de carga:
 `locust -f load_tests/locustfile.py`
