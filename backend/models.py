from datetime import datetime
from typing import Any, Dict, List

import pandas as pd
from pydantic import BaseModel
from sqlalchemy import JSON, Column, DateTime, Float, Integer, String

from database import Base

# ==========================================
# SQLAlchemy Models
# ==========================================

class ScenarioSimulation(Base):
    __tablename__ = "scenario_simulations"

    id = Column(Integer, primary_key=True, index=True)
    scenario_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    inflation_rate = Column(Float)
    inventory_increase = Column(Float)
    wage_increase = Column(Float)
    payment_terms = Column(Integer)
    sales_growth = Column(Float)
    resulting_runway = Column(Integer)
    risk_level = Column(String)


class DatasetAnalysis(Base):
    __tablename__ = "dataset_analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    dataset_type = Column(String)
    business_domain = Column(String)
    executive_summary = Column(String)
    analysis_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================================
# Pydantic Models
# ==========================================

class Insight(BaseModel):
    title: str
    description: str
    severity: str


class DatasetAnalysisResponse(BaseModel):
    filename: str
    dataset_type: str
    business_domain: str
    executive_summary: str
    trend_metrics: List[str]
    trend_data: List[Dict[str, Any]]
    kpis: Dict[str, Any]
    risks: List[str]
    opportunities: List[str]
    insights: List[Insight]


class ChatQuery(BaseModel):
    question: str


class ScenarioBase(BaseModel):
    inflation_rate: float
    inventory_increase: float
    wage_increase: float
    payment_terms: int
    sales_growth: float


class ScenarioCreate(ScenarioBase):
    scenario_name: str


class ScenarioResponse(ScenarioCreate):
    id: int
    created_at: datetime
    resulting_runway: int
    risk_level: str

    class Config:
        from_attributes = True


# ==========================================
# Data Processing Functions
# ==========================================

def clean_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """Cleans a dataframe by removing duplicates and filling missing values."""
    report = {}
    original_rows = len(df)

    df.columns = df.columns.str.strip()
    df = df.drop_duplicates()

    report["duplicates_removed"] = original_rows - len(df)

    # Fill numeric NaNs with median
    numeric_cols = df.select_dtypes(include="number").columns
    for col in numeric_cols:
        df[col] = df[col].fillna(df[col].median())

    # Fill string/object NaNs with 'Unknown'
    text_cols = df.select_dtypes(include="object").columns
    for col in text_cols:
        df[col] = df[col].fillna("Unknown")

    return df, report


def profile_dataframe(df: pd.DataFrame) -> dict:
    """Generates a statistical profile for numeric columns in a dataframe."""
    profile = {}
    numeric_cols = df.select_dtypes(include="number").columns

    for col in numeric_cols:
        profile[col] = {
            "count": int(df[col].count()),
            "mean": float(df[col].mean()),
            "median": float(df[col].median()),
            "min": float(df[col].min()),
            "max": float(df[col].max()),
            "sum": float(df[col].sum()),
        }

    return profile


def aggregate_data(df: pd.DataFrame, period: str = "monthly") -> List[Dict[str, Any]]:
    """Aggregates numeric data based on a datetime column over a specified period."""
    date_column = None

    # Identify the date column
    for col in df.columns:
        if "date" in col.lower():
            date_column = col
            break

    if not date_column:
        return []

    df[date_column] = pd.to_datetime(df[date_column], errors="coerce")
    numeric_cols = df.select_dtypes(include="number").columns

    if len(numeric_cols) == 0:
        return []

    # Map period to pandas frequency aliases
    freq_map = {
        "monthly": "M",
        "quarterly": "Q"
    }
    freq = freq_map.get(period, "Y") # Default to 'Y' (Yearly) if not matched

    # Perform grouped aggregation
    grouped = (
        df.groupby(pd.Grouper(key=date_column, freq=freq))[numeric_cols]
        .sum()
        .reset_index()
    )

    # Convert datetime back to string for JSON serialization
    grouped[date_column] = grouped[date_column].astype(str)

    return grouped.to_dict(orient="records")
