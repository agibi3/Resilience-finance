import os
import logging
import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, Form, UploadFile
from sqlalchemy.orm import Session

# Core infrastructure and utility modules imports
import database
import models
from ai_service import analyze_dataset
from data_cleaner import clean_dataframe
from data_profiler import profile_dataframe
from time_series import aggregate_data

# Configure localized routing logging
logger = logging.getLogger(__name__)
router = APIRouter(tags=["Analytics Engine"])

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/api/analyze")
async def analyze_uploaded_file(
    file: UploadFile = File(...),
    period: str = Form(...),
    db: Session = Depends(database.get_db)
):
    """
    Ingests financial document spreadsheets, runs algorithmic cleaning pipelines,
    extracts time-series aggregations, and invokes LLM structured insight models.
    """
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="Invalid submission. Filename missing.")

    if not filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file layout. Only CSV, XLS, and XLSX file standards are permitted."
        )

    # Persist file binary securely to disk cache
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    try:
        with open(filepath, "wb") as buffer:
            buffer.write(await file.read())
    except Exception as e:
        logger.error(f"File writing disk transaction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to cache source document stream: {e}")

    # Ingest data matrix into Pandas processing layer safely
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(filepath)
        else:
            df = pd.read_excel(filepath)
    except Exception as e:
        logger.error(f"Pandas processing execution failed on parsing: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Unable to process or parse spreadsheet structure: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="Incompatible dataset context. DataFrame yields empty structure.")

    try:
        # Run algorithmic cleanup, profiling matrices, and structural data points aggregations
        df, cleaning_report = clean_dataframe(df)
        statistics = profile_dataframe(df)
        trend_data = aggregate_data(df, period)

        # Extract structured AI projections via LLM JSON schemas
        ai_analysis = analyze_dataset(
            columns=list(df.columns),
            sample_rows=df.head(20).to_dict("records"),
            statistics=statistics,
            trend_data=trend_data
        )

        # Map insights structurally matching downstream consumers schema profiles
        serialized_insights = [insight.model_dump() for insight in ai_analysis.insights]
        
        # Build unified analytics state context dictionary payload
        analysis_payload = {
            "dataset_type": ai_analysis.dataset_type,
            "business_domain": ai_analysis.business_domain,
            "executive_summary": ai_analysis.executive_summary,
            "trend_metrics": ai_analysis.trend_metrics,
            "trend_summary": ai_analysis.trend_summary,
            "risks": ai_analysis.risks,
            "opportunities": ai_analysis.opportunities,
            "kpis": ai_analysis.kpis,
            "insights": serialized_insights
        }

        # Save record context inside persistent storage infrastructure
        saved_analysis = models.DatasetAnalysis(
            filename=filename,
            dataset_type=ai_analysis.dataset_type,
            business_domain=ai_analysis.business_domain,
            executive_summary=ai_analysis.executive_summary,
            analysis_json=analysis_payload
        )
        
        db.add(saved_analysis)
        db.commit()
        db.refresh(saved_analysis)

        # Return comprehensive data envelope matching structural payload expectation
        return {
            "filename": filename,
            "period": period,
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "cleaning_report": cleaning_report,
            "statistics": statistics,
            "trend_data": trend_data,
            **analysis_payload
        }

    except Exception as e:
        logger.exception("Internal error executing analytics processing stream pipelines.")
        raise HTTPException(status_code=500, detail=f"Analytics processing stream pipeline exception: {str(e)}")
