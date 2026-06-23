import logging
from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np

import database
import models

logger = logging.getLogger(__name__)

router = APIRouter()

def make_json_serializable(data):
    """
    Recursively sanitizes data dictionaries, lists, and values.
    Converts Pandas Timestamps/datetimes to ISO strings and floats NaNs to None.
    """
    if isinstance(data, dict):
        return {k: make_json_serializable(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [make_json_serializable(item) for item in data]
    # Check for Pandas/Numpy Timestamps or standard datetimes
    elif isinstance(data, (pd.Timestamp, np.datetime64)) or hasattr(data, "strftime"):
        return data.strftime("%Y-%m-%d")
    # Check for NaN / Infinity numbers which also crash standard JSON encoders
    elif isinstance(data, float) and (np.isnan(data) or np.isinf(data)):
        return None
    return data


@router.post("/analyze")
async def analyze_file(
    file: UploadFile = File(...),
    period: str = Form(...),
    db: Session = Depends(database.get_db)
):
    try:
        logger.info(f"Ingesting sheet file: {file.filename} for window: {period}")
        
        # 1. Read your spreadsheet file using Pandas
        contents = await file.read()
        if file.filename.endswith(".csv"):
            import io
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(contents)

        # -----------------------------------------------------------------
        # CORE FIX: Convert all DataFrame datetime columns to standard strings 
        # before running any conversions to standard dictionaries.
        # -----------------------------------------------------------------
        for col in df.select_dtypes(include=["datetime", "datetimetz"]).columns:
            df[col] = df[col].dt.strftime("%Y-%m-%d")

        # --- Your Custom Mock Analytics Logic Execution Block ---
        # (Replace this sample block with whatever metrics calculation logic you already have)
        calculated_kpis = {
            "cash_on_hand": 50000.0,
            "cash_runway_base": 300,
            "cash_runway_stress": 180,
            "gross_margin": 28.0,
            "burn_rate": 5000.0,
            "working_capital": 32000.0,
            "risk_level": "LOW"
        }
        
        raw_chart_points = [
            {"month": "May", "baseCase": 50000, "stressScenario": 50000},
            {"month": "Jun", "baseCase": 45000, "stressScenario": 42000},
            {"month": "Jul", "baseCase": 40000, "stressScenario": 30000},
            {"month": "Aug", "baseCase": 35000, "stressScenario": 5000}
        ]
        
        # Suppose your analytics engine generates a nested layout structure like this:
        analysis_payload = {
            "filename": file.filename,
            "dataset_type": "Ledger Summary",
            "business_domain": "SME Financials",
            "executive_summary": "Cash runway holds strong at baseline, but dips under high stress parameters.",
            "kpis": calculated_kpis,
            "trend_data": raw_chart_points,
            "risks": ["Supply chain inflation pressure points identified."],
            "insights": [
                {"title": "Extend Runway", "description": "Optimize working capital targets.", "severity": "Medium"}
            ]
        }

        # -----------------------------------------------------------------
        # CORE FIX: Pass the final dictionary layout through the sanitizer
        # -----------------------------------------------------------------
        clean_json_payload = make_json_serializable(analysis_payload)

        # 2. Write record profiles down into the relational store ledger
        db_analysis = models.DatasetAnalysis(
            filename=file.filename,
            dataset_type="Financial Document",
            business_domain="Corporate Finance",
            executive_summary=clean_json_payload.get("executive_summary", ""),
            analysis_json=clean_json_payload  # Safely serializes now!
        )
        
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)

        # 3. Return payload back up to client network listener
        return db_analysis

    except Exception as e:
        logger.error(f"Failed parsing business document data: {str(e)}")
        # This message bubbles up straight into your frontend alert modal box
        raise HTTPException(
            status_code=500, 
            detail=f"Analytics processing stream pipeline exception: {str(e)}"
        )
