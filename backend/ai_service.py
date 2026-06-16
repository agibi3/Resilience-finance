import os
from typing import List
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
api_key=os.getenv("OPENAI_API_KEY")
)

class Recommendation(BaseModel):
    title: str
    description: str
    
class AIAdvisorResponse(BaseModel):
    warnings: List[str]
    recommendations: List[Recommendation]
    
def generate_financial_advice(
    cash_on_hand: float,
    burn_rate: float,
    stress_runway_days: int,
    inflation: float,
    inventory: float,
    wage: float,
    terms: int,
    sales: float
    ):
    
    prompt = f"""
    
    You are an experienced SME Chief Financial Officer.
    
    Financial Position:
    Cash On Hand: ${cash_on_hand}
    Monthly Burn Rate: ${burn_rate}
    Cash Runway: {stress_runway_days} days
    
    Stress Conditions:
    Inflation Increase: {inflation}%
    Inventory Cost Increase: {inventory}%
    Wage Increase: {wage}%
    Customer Payment Terms: {terms} days
    Sales Growth: {sales}%
    
    Provide:
    1 warning if risk exists.
    Exactly 3 practical recommendations.
    """
    
    try:
    
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a CFO helping small businesses survive financial stress."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format=AIAdvisorResponse,
            temperature=0.3
        )
    
        result = response.choices[0].message.parsed
    
        return {
            "warnings": result.warnings,
            "recommendations": [
                {
                    "title": r.title,
                    "description": r.description
                }
                for r in result.recommendations
            ]
        }
    
    except Exception as e:
    
        print("AI ERROR:", e)
    
        return {
            "warnings": [
                f"Cash runway reduced to {stress_runway_days} days."
            ],
            "recommendations": [
                {
                    "title": "Reduce Costs",
                    "description": "Review discretionary spending immediately."
                },
                {
                    "title": "Improve Collections",
                    "description": "Speed up customer payments."
                },
                {
                    "title": "Increase Liquidity",
                    "description": "Secure a backup funding source."
                }
            ]
        }