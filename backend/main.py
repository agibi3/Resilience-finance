from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, engine

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="ResilienceFinance SME Stress Testing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/simulate", response_model=schemas.SimulationResult)
def simulate_scenario(payload: schemas.ScenarioCreate, db: Session = Depends(database.get_db)):
    # Run dynamic calculations
    results = engine.run_stress_test(
        inflation=payload.inflation_rate,
        inventory=payload.inventory_increase,
        wage=payload.wage_increase,
        terms=payload.payment_terms,
        sales=payload.sales_growth
    )
    
    # Save simulated snapshot history to Database
    db_scenario = models.ScenarioSimulation(
        scenario_name=payload.scenario_name,
        inflation_rate=payload.inflation_rate,
        inventory_increase=payload.inventory_increase,
        wage_increase=payload.wage_increase,
        payment_terms=payload.payment_terms,
        sales_growth=payload.sales_growth,
        resulting_runway=results["cash_runway_stress"],
        risk_level=results["risk_level"]
    )
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    
    return results

@app.get("/api/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(db: Session = Depends(database.get_db)):
    return db.query(models.ScenarioSimulation).order_by(models.ScenarioSimulation.created_at.desc()).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
