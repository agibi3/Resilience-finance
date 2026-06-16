from typing import List, Dict, Any
from ai_service import generate_financial_advice

def run_stress_test(
    inflation: float, inventory: float, wage: float, terms: int, sales: float
) -> Dict[str, Any]:
    # Baseline Metrics
    base_cash = 42500.0
    base_burn = 18650.0
    base_revenue = 25000.0
    base_cogs = 13500.0
    
    # Stress alterations based on input parameters
    stressed_burn = base_burn * (1 + (inflation / 100.0) + (wage / 100.0) * 0.4)
    stressed_cogs = base_cogs * (1 + (inventory / 100.0))
    stressed_revenue = base_revenue * (1 + (sales / 100.0))
    
    terms_penalty = 0.0
    if terms > 30:
        terms_penalty = ((terms - 30) / 30.0) * 4000.0

    final_burn = stressed_burn + stressed_cogs - stressed_revenue + terms_penalty
    if final_burn <= 0:
        final_burn = 5000.0 
        
    base_runway = int((base_cash / base_burn) * 30) 
    stress_runway = int((base_cash / final_burn) * 30)
    
    if stress_runway > 180: stress_runway = 180
    if stress_runway < 0: stress_runway = 0

    if stress_runway < 30:
        risk_level = "High"
    elif stress_runway < 60:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    months = ["May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25"]
    chart_data = []
    current_base_cash = base_cash
    current_stress_cash = base_cash
    
    for m in months:
        chart_data.append({
            "month": m,
            "baseCase": max(0.0, round(current_base_cash, 2)),
            "stressScenario": max(0.0, round(current_stress_cash, 2))
        })
        current_base_cash -= (base_burn / 30) * 30
        current_stress_cash -= (final_burn / 30) * 30

    # ✨ Calling the live OpenAI service layer dynamically
    ai_insights = generate_financial_advice(
        cash_on_hand=base_cash,
        burn_rate=round(final_burn, 2),
        stress_runway_days=stress_runway,
        inflation=inflation,
        inventory=inventory,
        wage=wage,
        terms=terms,
        sales=sales
    )

    return {
        "cash_on_hand": base_cash,
        "cash_runway_base": base_runway,
        "cash_runway_stress": stress_runway,
        "gross_margin": round(((stressed_revenue - stressed_cogs) / stressed_revenue) * 100, 1) if stressed_revenue > 0 else 0.0,
        "burn_rate": round(final_burn, 2),
        "working_capital": round(base_cash - (stressed_cogs * 0.5), 2),
        "chart_data": chart_data,
        "risk_level": risk_level,
        "warnings": ai_insights["warnings"],
        "recommendations": ai_insights["recommendations"]  # Passed down directly to schema response
    }
