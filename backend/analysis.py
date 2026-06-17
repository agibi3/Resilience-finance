import os
import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, Form, UploadFile
from sqlalchemy.orm import Session

# Import core infrastructure and models
import database
import models
from ai_service import analyze_dataset
from data_cleaner import clean_dataframe
from data_profiler import profile_dataframe
from time_series import aggregate_data

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/api/analyze")
async def analyze_uploaded_file(
    file: UploadFile = File(...),
    period: str = Form(...),
    db: Session = Depends(database.get_db)
):
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="Invalid file.")

    if not filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=400, 
            detail="Only CSV and Excel files are supported."
        )

    # Save uploaded file to disk
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    try:
        with open(filepath, "wb") as buffer:
            buffer.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    # Load dataset into a Pandas DataFrame
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(filepath)
        else:
            df = pd.read_excel(filepath)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to read file: {e}")

    if df.empty:
        raise HTTPException(status_code=400, detail="Dataset is empty.")

    # Process and transform the data
    df, cleaning_report = clean_dataframe(df)
    statistics = profile_dataframe(df)
    trend_data = aggregate_data(df, period)

    # Extract strategic insights using the AI service
    ai_analysis = analyze_dataset(
        columns=list(df.columns),
        sample_rows=df.head(20).to_dict("records"),
        statistics=statistics,
        trend_data=trend_data
    )

    # Build response payload and parse insights
    serialized_insights = [insight.model_dump() for insight in ai_analysis.insights]
    
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

    # Persist analysis details into database
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

    # Return summary + metadata
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
