import os
import json
from openai import OpenAI
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Define structured schema to match your UI's internal expectations
class AIAdvisorSchema(BaseModel):
    warnings: List[str]
    recommendations: List[dict] # Expected keys: title, desc

def generate_financial_advice(
    cash_on_hand: float,
    burn_rate: float,
    stress_runway_days: int,
    inflation: float,
    inventory: float,
    wage: float,
    terms: int,
    sales: float
) -> dict:
    
    # Context framing for the LLM
    prompt = f"""
    You are an expert AI Financial Advisor for an SME. 
    Analyze the current baseline and stress test conditions below and provide tailored, realistic corporate recommendations.

    Current Financial Health Metrics:
    - Cash on Hand: ${cash_on_hand}
    - New Simulated Monthly Burn Rate: ${burn_rate}
    - Remaining Cash Runway: {stress_runway_days} Days

    Simulated Macroeconomic Shocks Applied:
    - Inflation Rate Increase: {inflation}%
    - Inventory Cost Cost Hike: {inventory}%
    - Operational Wage Spike: {wage}%
    - Customer Payment Arrears Terms: Net {terms} Days
    - Projected Sales Growth: {sales}%
    """

    try:
        # Utilizing the modern SDK ChatCompletion structure
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",  # Highly cost-effective and hyper-fast for structured metrics
            messages=[
                {"role": "system", "content": "You are a professional CFO advising small-to-medium enterprises under economic duress. Provide exactly 1 targeted timeline warning if the cash runway drops under 60 days, and exactly 3 distinct, highly tactical operational execution strategies to preserve margins."},
                {"role": "user", "content": prompt}
            ],
            response_format=AIAdvisorSchema,
            temperature=0.3
        )
        
        parsed_result = response.choices[0].message.parsed
        return {
            "warnings": parsed_result.warnings,
            "recommendations": parsed_result.recommendations
        }
        
    except Exception as e:
        print(f"AI Generation Failed: {e}")
        # Robust fallback array so your application interface never breaks
        return {
            "warnings": [f"Warning: Runway projection altered to {stress_runway_days} days due to compounding supply-side pressures."],
            "recommendations": [
                {"title": "Optimize Working Capital", "desc": "Audit internal accounting pipelines to streamline outstanding collections immediately."},
                {"title": "Review Cost Structures", "desc": "Identify flexible operation components to offset margin reductions caused by inflation."},
                {"title": "Buffer Cash Reserves", "desc": "Consult secondary financing frameworks to safeguard capital flow stability."}
            ]
        }
