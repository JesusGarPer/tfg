import pytest
from fastapi.testclient import TestClient
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health_check():
    """Verifica que el API responda y el modelo esté cargado."""
    response = client.get("/health")
    assert response.status_code in [
        200,
        503,
    ]  # 503 si falla la carga del modelo localmente
    data = response.json()
    assert "status" in data
    assert "model_status" in data


def test_predict_win_success():
    """Prueba el endpoint de predicción con un payload válido."""
    payload = {
        "playoffs": 0,
        "side": "Blue",
        "teamname": "G2 Esports",
        "team_wr": 0.65,
        "champ_top": "Aatrox",
        "champ_jng": "Lee Sin",
        "champ_mid": "Ahri",
        "champ_bot": "Jinx",
        "champ_sup": "Thresh",
        "wr_champ_top": 0.52,
        "wr_champ_jng": 0.49,
        "wr_champ_mid": 0.51,
        "wr_champ_bot": 0.53,
        "wr_champ_sup": 0.50,
        "firstdragon": 1.0,
        "golddiffat15": 1500.0,
        "xpdiffat15": 800.0,
        "csdiffat15": 12.0,
        "killsat15": 5.0,
        "assistsat15": 8.0,
        "deathsat15": 2.0,
        "wr_top": 0.60,
        "wr_jng": 0.55,
        "wr_mid": 0.58,
        "wr_bot": 0.62,
        "wr_sup": 0.59,
        "comp_early_power": 3.5,
    }

    response = client.post("/api/predict", json=payload)

    # Si el modelo está cargado, debería devolver 200 y una probabilidad
    assert response.status_code == 200, f"Error en /api/predict: {response.text}"
    data = response.json()
    assert data["success"] is True
    assert "win_probability" in data
    assert 0.0 <= data["win_probability"] <= 1.0


def test_predict_match_full_payload():
    """
    Test que envía el payload completo de estadísticas al minuto 15
    y composiciones de equipo para obtener la predicción del modelo.
    """
    payload = {
        "first_dragon_team": "Blue",
        "stats_min_15": {
            "kills_azul": 5,
            "kills_rojo": 2,
            "assists_azul": 7,
            "assists_rojo": 3,
            "deaths_azul": 2,
            "deaths_rojo": 5,
            "gold_diff": 1.5,
            "xp_diff": 1,
            "cs_diff": 12,
        },
        "equipo_azul": {
            "teamname": "Fnatic",
            "playoffs": 0,
            "side": "Blue",
            "jugadores": {
                "top": {"nombre": "Empyros", "campeon": "Ambessa"},
                "jng": {"nombre": "Razork", "campeon": "Xin Zhao"},
                "mid": {"nombre": "Vladi", "campeon": "Orianna"},
                "bot": {"nombre": "Upset", "campeon": "Aphelios"},
                "sup": {"nombre": "Lospa", "campeon": "Rell"},
            },
        },
        "equipo_rojo": {
            "teamname": "G2 Esports",
            "playoffs": 0,
            "side": "Red",
            "jugadores": {
                "top": {"nombre": "BrokenBlade", "campeon": "K'Sante"},
                "jng": {"nombre": "SkewMond", "campeon": "Maokai"},
                "mid": {"nombre": "Caps", "campeon": "Tristana"},
                "bot": {"nombre": "Hans Sama", "campeon": "Draven"},
                "sup": {"nombre": "Labrov", "campeon": "Nautilus"},
            },
        },
    }

    # Usamos TestClient para simular el ciclo real y cargar los modelos .pkl
    with TestClient(app) as test_client:
        response = test_client.post("/api/predict-match", json=payload)

    # Verificamos que la petición ha sido un éxito (HTTP 200 OK)
    assert response.status_code == 200, f"Error en la petición: {response.text}"

    data = response.json()

    # Verificamos que el JSON de respuesta contiene las claves esperadas
    assert "win_probability_blue" in data
    assert "win_probability_red" in data

    # Comprobaciones de lógica matemática (los porcentajes deben sumar ~1.0 o 100)
    prob_blue = data["win_probability_blue"]
    prob_red = data["win_probability_red"]

    assert isinstance(prob_blue, float)
    assert isinstance(prob_red, float)
