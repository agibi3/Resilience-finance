    import os
    import pandas as pd
    
    from fastapi import APIRouter
    from fastapi import UploadFile
    from fastapi import File
    from fastapi import HTTPException
    
    router = APIRouter()
    
    UPLOAD_FOLDER = "uploads"
    
    os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
    )
    
    @router.post("/api/upload")
    async def upload_financials(
    file: UploadFile = File(...)
    ):
    
    filename = file.filename
    
    if not filename.endswith(
        (
            ".csv",
            ".xlsx",
            ".xls"
        )
    ):
        raise HTTPException(
            status_code=400,
            detail="Only CSV and Excel files supported"
        )
    
    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )
    
    with open(filepath, "wb") as buffer:
        buffer.write(
            await file.read()
        )
    
    if filename.endswith(".csv"):
        df = pd.read_csv(filepath)
    else:
        df = pd.read_excel(filepath)
    
    required = [
        "Revenue",
        "Expenses",
        "Cash"
    ]
    
    for column in required:
    
        if column not in df.columns:
    
            raise HTTPException(
                status_code=400,
                detail=f"Missing column: {column}"
            )
    
    revenue = float(
        df["Revenue"].mean()
    )
    
    expenses = float(
        df["Expenses"].mean()
    )
    
    cash = float(
        df["Cash"].iloc[-1]
    )
    
    return {
        "filename": filename,
        "revenue": revenue,
        "expenses": expenses,
        "cash": cash
    }