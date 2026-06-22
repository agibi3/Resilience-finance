import logging
from typing import List
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Core dependency layout modules[span_59](start_span)[span_59](end_span)
import database
import models
import schemas
from ai_service import answer_financial_question
from stress_engine import run_stress_test
from analysis import router as analysis_router

# Setup framework structured logging standard
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize relational core schema definitions mapping vectors[span_60](start_span)[span_60](end_span)
models.Base.metadata.create_all(bind=database.engine)[span_61](start_span)[span_61](end_span)

app = FastAPI(
    title="ResilienceFinance Core AI CFO Platform",
    description="Automated business intelligence analytics & stress testing API engines."
)

app.include_router(analysis_router)[span_62](start_span)[span_62](end_span)

# CORS policy enforcement matching specific frontend domains[span_63](start_span)[span_63](end_span)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Swap out for explicit whitelist arrays in formal production configs[span_64](start_span)[span_64](end_span)
    allow_credentials=True,[span_65](start_span)[span_65](end_span)
    allow_methods=["*"],[span_66](start_span)[span_66](end_span)
    allow_headers=["*"],[span_67](start_span)[span_67](end_span)
)


@app.get("/")
def root():
    """Service health monitoring validation node directly check indicator flag."""
    return {"status": "healthy", "service": "AI CFO Platform API Running"}[span_68](start_span)[span_68](end_span)


@app.get("/api/analysis/latest")
def latest_analysis(db: Session = Depends(database.get_db)):
    """Retrieves the most recent dataset analysis summary record database state payload."""
    latest = ([span_69](start_span)[span_69](end_span)
        db.query(models.DatasetAnalysis)
        .order_by(models.DatasetAnalysis.created_at.desc())
        .first()
    )[span_70](start_span)[span_70](end_span)
    
    if not latest:[span_71](start_span)[span_71](end_span)
        return {"message": "No analysis found"}[span_72](start_span)[span_72](end_span)

    return {[span_73](start_span)[span_73](end_span)
        "id": latest.id,[span_74](start_span)[span_74](end_span)
        "filename": latest.filename,[span_75](start_span)[span_75](end_span)
        "dataset_type": latest.dataset_type,[span_76](start_span)[span_76](end_span)
        "business_domain": latest.business_domain,[span_77](start_span)[span_77](end_span)
        "executive_summary": latest.executive_summary,[span_78](start_span)[span_78](end_span)
        "analysis_json": latest.analysis_json,[span_79](start_span)[span_79](end_span)
    }


@app.get("/api/scenarios", response_model=List[schemas.ScenarioResponse])
def scenarios(db: Session = Depends(database.get_db)):
    """Fetches a chronological historical ledger trace tracking simulated scenarios executed."""
    return ([span_80](start_span)[span_80](end_span)
        db.query(models.ScenarioSimulation)
        .order_by(models.ScenarioSimulation.created_at.desc())
        .all()
    )[span_81](start_span)[span_81](end_span)


@app.post("/api/simulate", response_model=schemas.SimulationResult)
def simulate(
    payload: schemas.ScenarioCreate, 
    db: Session = Depends(database.get_db)
):
    """
    Pulls cash flows indicators dynamically from context histories, processes mathematical transformations
    via localized stress testing kernels, and saves scenario profiles.[span_82](start_span)[span_82](end_span)
    """
    latest = ([span_83](start_span)[span_83](end_span)
        db.query(models.DatasetAnalysis)
        .order_by(models.DatasetAnalysis.created_at.desc())
        .first()
    )[span_84](start_span)[span_84](end_span)

    # Baseline asset assumptions if structure profile data is unavailable[span_85](start_span)[span_85](end_span)
    cash = 50000.0[span_86](start_span)[span_86](end_span)
    revenue = 25000.0[span_87](start_span)[span_87](end_span)
    expenses = 18000.0[span_88](start_span)[span_88](end_span)

    if latest and latest.analysis_json:[span_89](start_span)[span_89](end_span)
        analysis = latest.analysis_json[span_90](start_span)[span_90](end_span)
        # Locate KPIs block inside stored dictionary maps safely
        kpis = analysis.get("kpis", {})[span_91](start_span)[span_91](end_span)

        for key, value in kpis.items():
            key_lower = key.lower()[span_92](start_span)[span_92](end_span)
            if "cash" in key_lower and isinstance(value, (int, float)):[span_93](start_span)[span_93](end_span)
                cash = float(value)[span_94](start_span)[span_94](end_span)
            elif "revenue" in key_lower and isinstance(value, (int, float)):[span_95](start_span)[span_95](end_span)
                revenue = float(value)[span_96](start_span)[span_96](end_span)
            elif "expense" in key_lower and isinstance(value, (int, float)):[span_97](start_span)[span_97](end_span)
                expenses = float(value)[span_98](start_span)[span_98](end_span)

    try:
        # Run calculation simulation script kernel[span_99](start_span)[span_99](end_span)
        results = run_stress_test(
            cash=cash,[span_100](start_span)[span_100](end_span)
            revenue=revenue,[span_101](start_span)[span_101](end_span)
            expenses=expenses,[span_102](start_span)[span_102](end_span)
            inflation=payload.inflation_rate,[span_103](start_span)[span_103](end_span)
            inventory=payload.inventory_increase,[span_104](start_span)[span_104](end_span)
            wage=payload.wage_increase,[span_105](start_span)[span_105](end_span)
            terms=payload.payment_terms,[span_106](start_span)[span_106](end_span)
            sales=payload.sales_growth,[span_107](start_span)[span_107](end_span)
        )[span_108](start_span)[span_108](end_span)

        # Save current adjustment parameter configuration records log model schema[span_109](start_span)[span_109](end_span)
        scenario = models.ScenarioSimulation(
            scenario_name=payload.scenario_name,[span_110](start_span)[span_110](end_span)
            inflation_rate=payload.inflation_rate,[span_111](start_span)[span_111](end_span)
            inventory_increase=payload.inventory_increase,[span_112](start_span)[span_112](end_span)
            wage_increase=payload.wage_increase,[span_113](start_span)[span_113](end_span)
            payment_terms=payload.payment_terms,[span_114](start_span)[span_114](end_span)
            sales_growth=payload.sales_growth,[span_115](start_span)[span_115](end_span)
            resulting_runway=results["cash_runway_stress"],[span_116](start_span)[span_116](end_span)
            risk_level=results["risk_level"],[span_117](start_span)[span_117](end_span)
        )[span_118](start_span)[span_118](end_span)
        
        db.add(scenario)[span_119](start_span)[span_119](end_span)[span_120](start_span)[span_120](end_span)
        db.commit()[span_121](start_span)[span_121](end_span)

        return results

    except Exception as e:
        logger.error(f"Simulation runner execution process failure exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulation tracking calculations failure error context: {str(e)}")


@app.post("/api/chat")
def chat(query: schemas.ChatQuery, db: Session = Depends(database.get_db)):
    """Context-aware specialized LLM business advisor answering natural conversation threads."""
    context = query.context[span_122](start_span)[span_122](end_span)

    # Explicit fallback trace queries latest metrics index context maps database states[span_123](start_span)[span_123](end_span)
    if not context:[span_124](start_span)[span_124](end_span)
        latest = ([span_125](start_span)[span_125](end_span)
            db.query(models.DatasetAnalysis)
            .order_by(models.DatasetAnalysis.created_at.desc())
            .first()
        )[span_126](start_span)[span_126](end_span)
        if latest:[span_127](start_span)[span_127](end_span)
            context = latest.analysis_json[span_128](start_span)[span_128](end_span)

    try:
        answer = answer_financial_question(
            question=query.question,[span_129](start_span)[span_129](end_span)
            business_context=context[span_130](start_span)[span_130](end_span)
        )[span_131](start_span)[span_131](end_span)
        return {"answer": answer}[span_132](start_span)[span_132](end_span)
    except Exception as e:
        logger.error(f"AI Chat interaction node error trace: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to synthesize advice due to service pipeline interruption.")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)[span_133](start_span)[span_133](end_span)
