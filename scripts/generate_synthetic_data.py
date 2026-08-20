from __future__ import annotations

import argparse
import csv
from datetime import date, timedelta
from pathlib import Path

START_DATE = date(2026, 1, 1)
RECORD_COUNT = 30
DRIVERS = tuple(f"CONDUTOR-SINTETICO-{number:02d}" for number in range(1, 7))
LOCATIONS = ("ZONA-DEMO-A", "ZONA-DEMO-B", "ZONA-DEMO-C")
EVENT_TYPES = (
    "ACELERACAO-DEMO",
    "FADIGA-DEMO",
    "DIRECAO-BRUSCA-DEMO",
    "GESTAO-RISCO-DEMO",
)
SEVERITIES = ("BAIXA-DEMO", "MEDIA-DEMO", "ALTA-DEMO")
EVENTS_FILENAME = "synthetic_safety_events.csv"
DISMISSED_FILENAME = "synthetic_dismissed_drivers.csv"


def build_events() -> list[dict[str, str | int]]:
    events: list[dict[str, str | int]] = []
    for index in range(RECORD_COUNT):
        events.append(
            {
                "Data": (START_DATE + timedelta(days=index)).strftime("%d/%m/%Y"),
                "QUANTIDADE": 4 + ((index * 3) % 9),
                "Motorista": DRIVERS[index % len(DRIVERS)],
                "Localidade": LOCATIONS[index % len(LOCATIONS)],
                "Tipo de Evento": EVENT_TYPES[index % len(EVENT_TYPES)],
                "Criticidade": SEVERITIES[index % len(SEVERITIES)],
            }
        )
    return events


def write_datasets(output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    events_path = output_dir / EVENTS_FILENAME
    fieldnames = ["Data", "QUANTIDADE", "Motorista", "Localidade", "Tipo de Evento", "Criticidade"]
    with events_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames, delimiter=";", lineterminator="\n")
        writer.writeheader()
        writer.writerows(build_events())

    dismissed_path = output_dir / DISMISSED_FILENAME
    with dismissed_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file, delimiter=";", lineterminator="\n")
        writer.writerow(["Motorista"])
        writer.writerow(["CONDUTOR-SINTETICO-06"])


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Gera datasets pequenos e integralmente sinteticos para a demonstracao SafeOps AI."
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "data",
        help="Diretorio de saida (default: data/ no repositorio).",
    )
    return parser.parse_args()


if __name__ == "__main__":
    write_datasets(parse_args().output_dir)
