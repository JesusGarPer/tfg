from locust import HttpUser, task, between


class LECPredictorUser(HttpUser):
    # Simula un tiempo de espera de entre 1 y 3 segundos entre acciones del usuario
    wait_time = between(1, 3)

    @task(1)
    def check_health(self):
        """Simula pings de monitorización."""
        self.client.get("/health")

    @task(1)
    def predict_min_15(self):
        """Simula peticiones intensivas de cálculo al minuto 15."""
        payload = {
            "playoffs": 1,
            "side": "Red",
            "teamname": "Fnatic",
            "team_wr": 0.55,
            "champ_top": "Renekton",
            "champ_jng": "Sejuani",
            "champ_mid": "Azir",
            "champ_bot": "Xayah",
            "champ_sup": "Rakan",
            "wr_champ_top": 0.50,
            "wr_champ_jng": 0.48,
            "wr_champ_mid": 0.49,
            "wr_champ_bot": 0.51,
            "wr_champ_sup": 0.52,
            "firstdragon": 0.0,
            "golddiffat15": -500.0,
            "xpdiffat15": -200.0,
            "csdiffat15": -5.0,
            "killsat15": 2.0,
            "assistsat15": 3.0,
            "deathsat15": 4.0,
            "wr_top": 0.52,
            "wr_jng": 0.50,
            "wr_mid": 0.54,
            "wr_bot": 0.55,
            "wr_sup": 0.51,
            "comp_early_power": 4.0,
        }

        # Agrupamos la petición bajo el nombre '/api/predict' en los reportes
        with self.client.post(
            "/api/predict", json=payload, catch_response=True, name="/api/predict"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Falló con código: {response.status_code}")

    @task(4)
    def predict_match_full(self):
        """Simula peticiones intensivas al motor de Machine Learning para el enfrentamiento completo."""
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
                    "top": {"nombre": "Oscarinin", "campeon": "Ambessa"},
                    "jng": {"nombre": "Razork", "campeon": "Xin Zhao"},
                    "mid": {"nombre": "Humanoid", "campeon": "Orianna"},
                    "bot": {"nombre": "Noah", "campeon": "Aphelios"},
                    "sup": {"nombre": "Jun", "campeon": "Rell"},
                },
            },
            "equipo_rojo": {
                "teamname": "G2 Esports",
                "playoffs": 0,
                "side": "Red",
                "jugadores": {
                    "top": {"nombre": "BrokenBlade", "campeon": "K'Sante"},
                    "jng": {"nombre": "Yike", "campeon": "Maokai"},
                    "mid": {"nombre": "Caps", "campeon": "Tristana"},
                    "bot": {"nombre": "Hans Sama", "campeon": "Draven"},
                    "sup": {"nombre": "Mikyx", "campeon": "Nautilus"},
                },
            },
        }

        # Agrupamos la petición bajo el nombre '/api/predict-match' en los reportes
        with self.client.post(
            "/api/predict-match",
            json=payload,
            catch_response=True,
            name="/api/predict-match",
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Falló con código: {response.status_code}")
