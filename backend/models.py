from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

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
