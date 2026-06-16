from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from database import Base

class ScenarioSimulation(Base):
tablename = "scenario_simulations"

id = Column(Integer, primary_key=True, index=True)

scenario_name = Column(String, nullable=False)

created_at = Column(
    DateTime,
    default=datetime.utcnow
)

inflation_rate = Column(Float)
inventory_increase = Column(Float)
wage_increase = Column(Float)

payment_terms = Column(Integer)
sales_growth = Column(Float)

resulting_runway = Column(Integer)

risk_level = Column(String)

class FinancialUpload(Base):
tablename = "financial_uploads"

id = Column(Integer, primary_key=True, index=True)

filename = Column(String)

revenue = Column(Float)

expenses = Column(Float)

cash = Column(Float)

created_at = Column(
    DateTime,
    default=datetime.utcnow
)