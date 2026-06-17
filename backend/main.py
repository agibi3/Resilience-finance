from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

import models
import schemas
import database
from upload import router as upload_router
from stress_engine import run_stress_test
from ai_service import answer_financial_question

# Initialize the database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Resilience Finance API")

# Include routers
app.include_router(upload_router)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schema for incoming AI Chat Requests
class ChatQuery(BaseModel):
    question: str

@app.get("/")
def root():
    return {"message": "API Running"}

@app.get("/api/cash-summary")
def get_cash_summary(db: Session = Depends(database.get_db)):
    latest_upload = db.query(models.FinancialUpload).order_by(models.FinancialUpload.created_at.desc()).first()
    
    if not latest_upload:
        # Fallback if no files have been uploaded yet
        return {
            "cash": 42500,
            "revenue": 25000,
            "expenses": 18650,
            "filename": "Default Data",
            "no_data": True
        }
    
    return {
        "cash": latest_upload.cash,
        "revenue": latest_upload.revenue,
        "expenses": latest_upload.expenses,
        "filename": latest_upload.filename
    }

@app.get("/api/trends")
def get_trends(db: Session = Depends(database.get_db)):
    uploads = db.query(models.FinancialUpload).order_by(models.FinancialUpload.created_at.asc()).all()
    
    if not uploads:
        return []
        
    return [
        {
            "id": u.id,
            "filename": u.filename,
            "revenue": u.revenue,
            "expenses": u.expenses,
            "cash": u.cash,
            "date": u.created_at.strftime("%b %d")
        } for u in uploads
    ]

@app.post("/api/simulate", response_model=schemas.SimulationResult)
def simulate(payload: schemas.ScenarioCreate, db: Session = Depends(database.get_db)):
    
    # Grab the most recent financial data from the database
    latest_upload = db.query(models.FinancialUpload).order_by(models.FinancialUpload.created_at.desc()).first()
    
    if latest_upload:
        cash = latest_upload.cash
        revenue = latest_upload.revenue
        expenses = latest_upload.expenses
    else:
        # Backup default values
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
    
    db.add(scenario)
    db.commit()
    
    return results

@app.get("/api/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(db: Session = Depends(database.get_db)):
    return (
        db.query(models.ScenarioSimulation)
        .order_by(models.ScenarioSimulation.created_at.desc())
        .all()
    )

@app.post("/api/chat")
def chat_with_ai(query: ChatQuery):
    # Pass the frontend's question to your real OpenAI service
    answer = answer_financial_question(query.question)
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
