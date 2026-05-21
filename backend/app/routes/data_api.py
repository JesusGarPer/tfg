from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter()


@router.get("/teams")
def get_teams(db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT teamname FROM team_stats ORDER BY teamname")
    ).fetchall()
    return [row[0] for row in result]


@router.get("/players")
def get_players(db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT playername FROM player_stats ORDER BY playername")
    ).fetchall()
    return [row[0] for row in result]


@router.get("/champions")
def get_champions(db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT champion_name FROM champion_stats ORDER BY champion_name")
    ).fetchall()
    return [row[0] for row in result]
