import logging
from typing import List
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Core dependency layout modules
import database
import models
import schemas
from ai_service import answer_financial_question
from stress_engine import run_stress_test
from analysis import router as analysis_router

# Setup framework structured logging standard
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize relational core schema definitions mapping vectors
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="ResilienceFinance Core AI CFO Platform",
    description="Automated business intelligence analytics & stress testing API engines."
)

# FIX: Added prefix so frontend axios requests to /api/analyze find the target router route
app.include_router(analysis_router, prefix="/api")

# CORS policy enforcement matching specific frontend domains
app.add_middleware(
    CORSMiddleware,
    # FIX: Explicit origin matching is mandatory when allow_credentials=True
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Service health monitoring validation node directly check indicator flag."""
    return {"status": "healthy", "service": "AI CFO Platform API Running"}


@app.get("/api/analysis/latest")
def latest_analysis(db: Session = Depends(database.get_db)):
    """Retrieves the most recent dataset analysis summary record database state payload."""
    latest = (
        db.query(models.DatasetAnalysis)
        .order_by(models.DatasetAnalysis.created_at.desc())
        .first()
    )
    
    if not latest:
        return {"message": "No analysis found"}

    return {
        "id": latest.id,
        "filename": latest.filename,
        "dataset_type": latest.dataset_type,
        "business_domain": latest.business_domain,
        "executive_summary": latest.executive_summary,
        "analysis_json": latest.analysis_json,
    }


@app.get("/api/scenarios", response_model=List[schemas.ScenarioResponse])
def scenarios(db: Session = Depends(database.get_db)):
    """Fetches a chronological historical ledger trace tracking simulated scenarios executed."""
    return (
        db.query(models.ScenarioSimulation)
        .order_by(models.ScenarioSimulation.created_at.desc())
        .all()
    )


@app.post("/api/simulate", response_model=schemas.SimulationResult)
def simulate(
    payload: schemas.ScenarioCreate, 
    db: Session = Depends(database.get_db)
):
    """
    Pulls cash flows indicators dynamically from context histories, processes mathematical transformations
    via localized stress testing kernels, and saves scenario profiles.
    """
    latest = (
        db.query(models.DatasetAnalysis)
        .order_by(models.DatasetAnalysis.created_at.desc())
        .first()
    )

    # Baseline asset assumptions if structure profile data is unavailable
    cash = 50000.0
    revenue = 25000.0
    expenses = 18000.0

    if latest and latest.analysis_json:
        analysis = latest.analysis_json
        # Locate KPIs block inside stored dictionary maps safely
        kpis = analysis.get("kpis", {})

        for key, value in kpis.items():
            key_lower = key.lower()
            if "cash" in key_lower and isinstance(value, (int, float)):
                cash = float(value)
            elif "revenue" in key_lower and isinstance(value, (int, float)):
                revenue = float(value)
            elif "expense" in key_lower and isinstance(value, (int, float)):
                expenses = float(value)

    try:
        # Run calculation simulation script kernel
        results = run_stress_test(
            cash=cash,
            revenue=revenue,
            expenses=expenses,
            inflation=payload.inflation_rate,
            inventory=payload.inventory_increase,
            wage=payload.wage_increase,
            terms=payload.payment_terms,
            sales=payload.sales_growth,
        )

        # Save current adjustment parameter configuration records log model schema
        scenario = models.ScenarioSimulation(
            scenario_name=payload.scenario_name,
            inflation_rate=payload.inflation_rate,
            inventory_increase=payload.inventory_increase,
            wage_increase=payload.wage_increase,
            payment_terms=payload.payment_terms,
            sales_growth=payload.sales_growth,
            resulting_runway=results["cash_runway_stress"],
            risk_level=results["risk_level"],
        )
        
        db.add(scenario)
        db.commit()

        return results

    except Exception as e:
        logger.error(f"Simulation runner execution process failure exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulation tracking calculations failure error context: {str(e)}")


@app.post("/api/chat")
def chat(query: schemas.ChatQuery, db: Session = Depends(database.get_db)):
    """Context-aware specialized LLM business advisor answering natural conversation threads."""
    context = query.context

    # Explicit fallback trace queries latest metrics index context maps database states
    if not context:
        latest = (
            db.query(models.DatasetAnalysis)
            .order_by(models.DatasetAnalysis.created_at.desc())
            .first()
        )
        if latest:
            context = latest.analysis_json

    try:
        answer = answer_financial_question(
            question=query.question,
            business_context=context
        )
        return {"answer": answer}
    except Exception as e:
        logger.error(f"AI Chat interaction node error trace: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to synthesize advice due to service pipeline interruption.")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
