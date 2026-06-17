import os
import pandas as pd

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

import database
import models

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/api/upload")
async def upload_financials(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    filename = file.filename
    
    if not filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Only CSV and Excel files supported"
        )
    
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())
    
    if filename.endswith(".csv"):
        df = pd.read_csv(filepath)
    else:
        df = pd.read_excel(filepath)
    
    # Strip any accidental spaces around column headers (e.g. " Revenue " -> "Revenue")
    df.columns = df.columns.str.strip()
    
    required = ["Revenue", "Expenses", "Cash"]
    
    for column in required:
        if column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing column: {column}. Please ensure exact spelling and capitalization."
            )
    
    revenue = float(df["Revenue"].mean())
    expenses = float(df["Expenses"].mean())
    cash = float(df["Cash"].iloc[-1])
    
    # Save the uploaded file metrics to the database
    db_upload = models.FinancialUpload(
        filename=filename,
        revenue=revenue,
        expenses=expenses,
        cash=cash
    )
    db.add(db_upload)
    db.commit()
    db.refresh(db_upload)
    
    return {
        "filename": filename,
        "revenue": revenue,
        "expenses": expenses,
        "cash": cash
    }
