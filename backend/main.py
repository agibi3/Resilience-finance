from fastapi import FastAPI
from fastapi import Depends

from sqlalchemy.orm import Session
    
from typing import List

import models
import schemas
import database

from upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware
from stress_engine import run_stress_test

models.Base.metadata.create_all(
bind=database.engine
)
    
app = FastAPI(title="Resilience Finance API")
    
app.include_router(upload_router)
    
app.add_middleware(
        CORSMiddleware,
        allow_origins=[""],
        allow_credentials=True,
        allow_methods=[""],
        allow_headers=["*"]
    )
    
@app.get("/")
def root():
    return {
    "message": "API Running"
    }
    
@app.post(
    "/api/simulate",
    response_model=schemas.SimulationResult
    )
def simulate(
    payload: schemas.ScenarioCreate,
    db: Session = Depends(
    database.get_db
    )
    ):
    
    cash = 42500
    revenue = 25000
    expenses = 18650
    
    results = run_stress_test(
        cash=cash,
        revenue=revenue,
        expenses=expenses,
        inflation=payload.inflation_rate,
        inventory=payload.inventory_increase,
        wage=payload.wage_increase,
        terms=payload.payment_terms,
        sales=payload.sales_growth
    )
    
    scenario = models.ScenarioSimulation(
        scenario_name=payload.scenario_name,
        inflation_rate=payload.inflation_rate,
        inventory_increase=payload.inventory_increase,
        wage_increase=payload.wage_increase,
        payment_terms=payload.payment_terms,
        sales_growth=payload.sales_growth,
        resulting_runway=results["cash_runway_stress"],
        risk_level=results["risk_level"]
    )
    
    db.add(
        scenario
    )
    
    db.commit()
    
    return results
    
@app.get(
    "/api/scenarios",
    response_model=List[
    schemas.ScenarioResponse
    ]
    )
def get_scenarios(
    db: Session = Depends(
    database.get_db
    )
    ):
    
    return (
        db.query(
            models.ScenarioSimulation
        )
        .order_by(
            models.ScenarioSimulation.created_at.desc()
        )
        .all()
    )
    
if __name__ == "__main__":
    
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )