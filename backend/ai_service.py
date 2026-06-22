import os
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

# ==========================================
# Environment Setup (FIXED)
# ==========================================

# Always load .env if it exists (local dev)
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

# This will NOT break on Render even if .env doesn't exist
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()  # fallback (Render / system env vars)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables.")

logger.info("OpenAI API key loaded successfully.")

client = OpenAI(api_key=api_key)

# ==========================================
# Structured Output Schemas
# ==========================================

class Insight(BaseModel):
    title: str
    description: str
    severity: str


class TrendPoint(BaseModel):
    period: str
    revenue: float
    cost_of_sales: float
    indirect_costs: float
    cash_flow: float


class DatasetAnalysis(BaseModel):
    dataset_type: str
    business_domain: str
    executive_summary: str
    trend_metrics: List[str]
    trend_summary: str
    trend_data: List[TrendPoint]
    risks: List[str]
    opportunities: List[str]
    kpis: Dict[str, Any]
    insights: List[Insight]

# ==========================================
# AI CORE FUNCTION
# ==========================================

def analyze_dataset(
    columns: List[str],
    sample_rows: List[Dict[str, Any]],
    statistics: Dict[str, Any],
    trend_data: List[Dict[str, Any]]
) -> DatasetAnalysis:

    prompt = f"""
    You are a world-class CFO, FP&A Director, and Data Scientist.

    COLUMNS:
    {json.dumps(columns, indent=2)}

    STATISTICS:
    {json.dumps(statistics, indent=2)}

    SAMPLE ROWS:
    {json.dumps(sample_rows[:10], indent=2)}

    RAW TREND DATA:
    {json.dumps(trend_data[:20], indent=2)}

    Return structured financial analysis.
    """

    try:
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI CFO producing structured financial insights."
                },
                {"role": "user", "content": prompt}
            ],
            response_format=DatasetAnalysis,
            temperature=0.2
        )

        return response.choices[0].message.parsed

    except Exception as e:
        logger.exception("AI Analysis Error")
        raise

# ==========================================
# CHAT FUNCTION
# ==========================================

def answer_financial_question(
    question: str,
    business_context: Optional[Dict[str, Any]] = None
) -> str:

    context_string = ""
    if business_context:
        context_string = f"\nBusiness Context:\n{json.dumps(business_context, indent=2)}"

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI CFO expert in finance, forecasting, and BI."
                        f"{context_string}"
                    )
                },
                {"role": "user", "content": question}
            ],
            temperature=0.4,
            max_tokens=500
        )

        return response.choices[0].message.content

    except Exception as e:
        logger.exception("AI Chat Error")
        return f"ERROR: {str(e)}"