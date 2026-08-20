from __future__ import annotations

from pathlib import Path

from radar_preventivo import create_app
from radar_preventivo.config import AppSettings
from radar_preventivo.repositories.dataset_repository import CsvDatasetRepository
from scripts.generate_synthetic_data import write_datasets

CSV_FIXTURE = """Data;QUANTIDADE;Motorista;Localidade;Tipo de Evento;Criticidade
01/01/2026;5;CONDUTOR-SINTETICO-01;ZONA-DEMO-A;ACELERACAO-DEMO;BAIXA-DEMO
02/01/2026;4;CONDUTOR-SINTETICO-02;ZONA-DEMO-A;FADIGA-DEMO;MEDIA-DEMO
03/01/2026;6;CONDUTOR-SINTETICO-01;ZONA-DEMO-B;ACELERACAO-DEMO;ALTA-DEMO
04/01/2026;3;CONDUTOR-SINTETICO-03;ZONA-DEMO-C;DIRECAO-BRUSCA-DEMO;MEDIA-DEMO
05/01/2026;7;CONDUTOR-SINTETICO-02;ZONA-DEMO-A;FADIGA-DEMO;ALTA-DEMO
"""


def build_test_app(tmp_path: Path):
    data_file = tmp_path / "synthetic_safety_events.csv"
    data_file.write_text(CSV_FIXTURE, encoding="utf-8")

    dismissed_file = tmp_path / "synthetic_dismissed_drivers.csv"
    dismissed_file.write_text("Motorista\n", encoding="utf-8")

    app = create_app(
        {
            "data_file": data_file,
            "dismissed_drivers_file": dismissed_file,
            "predictor_mode": "mock",
            "allow_demo_users": True,
            "secret_key": "test-secret",
            "bootstrap_prediction_date": "2026-01-06",
        }
    )
    app.config["TESTING"] = True
    return app


def login(client, email: str, password: str) -> str:
    response = client.post(
        "/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.get_json()["access_token"]


def test_health_endpoint_returns_dataset_summary(tmp_path: Path):
    app = build_test_app(tmp_path)
    client = app.test_client()

    response = client.get("/health")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["status"] == "ok"
    assert payload["records_loaded"] == 5
    assert payload["predictor_mode"] == "mock"


def test_predict_requires_authentication(tmp_path: Path):
    app = build_test_app(tmp_path)
    client = app.test_client()

    response = client.get("/predict?date=2026-01-06")

    assert response.status_code == 401


def test_analyst_can_login_and_predict(tmp_path: Path):
    app = build_test_app(tmp_path)
    client = app.test_client()
    token = login(client, "analista@radar.local", "Analista123!")

    response = client.get(
        "/predict?date=2026-01-06",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["data_previsao"] == "2026-01-06"
    assert "top_10_motoristas_geral" in payload
    assert payload["meta"]["predictor_mode"] == "mock"


def test_admin_can_list_users(tmp_path: Path):
    app = build_test_app(tmp_path)
    client = app.test_client()
    token = login(client, "admin@radar.local", "Admin123!")

    response = client.get(
        "/auth/users",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    users = response.get_json()["users"]
    assert len(users) == 3
    assert {user["role"] for user in users} == {"admin", "gestor", "analista"}


def test_non_admin_cannot_list_users(tmp_path: Path):
    app = build_test_app(tmp_path)
    client = app.test_client()
    token = login(client, "gestor@radar.local", "Gestor123!")

    response = client.get(
        "/auth/users",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403


def test_published_dataset_is_explicitly_synthetic(monkeypatch):
    monkeypatch.delenv("APP_DATA_FILE", raising=False)
    monkeypatch.delenv("APP_DISMISSED_DRIVERS_FILE", raising=False)

    settings = AppSettings.from_env()
    repository = CsvDatasetRepository(settings)
    events = repository.load_events()

    assert settings.data_file.name == "synthetic_safety_events.csv"
    assert settings.dismissed_drivers_file.name == "synthetic_dismissed_drivers.csv"
    assert len(events) == 30
    assert not {"CPF", "Placa", "Latitude", "Longitude"}.intersection(events.columns)
    assert events["Motorista"].str.fullmatch(r"CONDUTOR-SINTETICO-\d{2}").all()
    assert events["Localidade"].str.fullmatch(r"ZONA-DEMO-[A-C]").all()


def test_synthetic_dataset_generator_is_reproducible(tmp_path: Path):
    write_datasets(tmp_path)
    project_data_dir = Path(__file__).resolve().parent.parent / "data"

    for filename in ("synthetic_safety_events.csv", "synthetic_dismissed_drivers.csv"):
        assert (tmp_path / filename).read_text(encoding="utf-8") == (
            project_data_dir / filename
        ).read_text(encoding="utf-8")
