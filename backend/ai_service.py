import json
import logging
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

# Initialize environment and logging
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = OpenAI()


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
    
    # Enforce strict parsing using the TrendPoint schema
    trend_data: List[TrendPoint] 
    
    risks: List[str]
    opportunities: List[str]
    kpis: Dict[str, Any]
    insights: List[Insight]


# ==========================================
# AI Core Functions
# ==========================================

def analyze_dataset(
    columns: List[str],
    sample_rows: List[Dict[str, Any]],
    statistics: Dict[str, Any],
    trend_data: List[Dict[str, Any]]
) -> DatasetAnalysis:
    """Generates a structured financial analysis utilizing OpenAI's 
    Pydantic-enforced Structured Outputs feature.
    """
    prompt = f"""
    You are a world-class CFO, FP&A Director, and Data Scientist.

    Analyze this dataset deeply.

    COLUMNS:
    {json.dumps(columns, indent=2)}

    STATISTICS:
    {json.dumps(statistics, indent=2)}

    SAMPLE ROWS:
    {json.dumps(sample_rows[:10], indent=2)}

    RAW TREND DATA (if available):
    {json.dumps(trend_data[:20], indent=2)}

    ---
    TASKS:
    1. Identify dataset type.
    2. Identify business domain.
    3. Extract KPIs.
    4. Identify financial trends over time.
    5. Build structured trend data for visualization.
    6. Identify risks.
    7. Identify opportunities.
    8. Write an executive summary.
    9. Provide actionable insights.

    ---
    TREND DATA FORMAT REQUIRED:
    Return trend_data as a structured array.
    If a metric is missing from the raw data, estimate logically or output 0.0.
    """

    try:
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI CFO specializing in FP&A, financial modeling, "
                        "forecasting, and business intelligence. "
                        "You always output strictly structured financial intelligence."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            response_format=DatasetAnalysis,
            temperature=0.2
        )

        return response.choices[0].message.parsed

    except Exception as e:
        logger.error(f"AI Analysis Error: {e}", exc_info=True)

        return DatasetAnalysis(
            dataset_type="Unknown",
            business_domain="Unknown",
            executive_summary="Analysis failed to complete due to an internal error.",
            trend_metrics=[],
            trend_summary="",
            trend_data=[],
            risks=[],
            opportunities=[],
            kpis={},
            insights=[]
        )


def answer_financial_question(
    question: str,
    business_context: Optional[Dict[str, Any]] = None
) -> str:
    """Answers arbitrary financial questions using injected dataset context."""
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
                        "You are an AI CFO with expertise in financial analysis, "
                        "forecasting, accounting, and business intelligence."
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
        logger.error(f"AI Chat Error: {e}", exc_info=True)
        return "Unable to generate a response at this time."
