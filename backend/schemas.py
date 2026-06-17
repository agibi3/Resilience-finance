from pydantic import BaseModel
from datetime import datetime
from typing import List
    
class Recommendation(BaseModel):
    title: str
    description: str
    
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
    
class ChartPoint(BaseModel):
    month: str
    baseCase: float
    stressScenario: float
    
class SimulationResult(BaseModel):
    cash_on_hand: float
    
    cash_runway_base: int
    cash_runway_stress: int
    
    gross_margin: float
    burn_rate: float
    
    working_capital: float
    
    chart_data: List[ChartPoint]
    
    risk_level: str
    
    warnings: List[str]
    
    recommendations: List[Recommendation]