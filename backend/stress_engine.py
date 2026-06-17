from typing import Any, Dict, List


def run_stress_test(
    cash: float,
    revenue: float,
    expenses: float,
    inflation: float,
    inventory: float,
    wage: float,
    terms: int,
    sales: float,
) -> Dict[str, Any]:
    """Calculates runway reductions, burn rates, and financial risk levels

    by applying simulated macroeconomic stress parameters to baseline metrics.
    """
    # --- Stress adjustments ---
    stressed_revenue = revenue * (1 + sales / 100)
    
    # Calculate stressed expenses based on inflation, inventory overhead, and 50% wage pass-through
    expense_multiplier = 1 + (inflation / 100) + (inventory / 100) + ((wage / 100) * 0.5)
    stressed_expenses = expenses * expense_multiplier

    # Payment delay penalty (impact of extended vendor/customer net-terms on liquidity)
    terms_penalty = 0.0
    if terms > 30:
        terms_penalty = ((terms - 30) / 30) * 3000

    final_burn = stressed_expenses - stressed_revenue + terms_penalty
    final_burn = max(final_burn, 5000.0)

    # --- Runway calculations (represented in days) ---
    base_runway = int((cash / expenses) * 30) if expenses > 0 else 999
    stress_runway = int((cash / final_burn) * 30)

    # Categorize business risk position based on remaining survival runway days
    if stress_runway < 30:
        risk_level = "High"
    elif stress_runway < 60:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # --- Time series projection (forward-looking simulation) ---
    months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    chart_data = []
    base_balance = cash
    stress_balance = cash

    for month in months:
        chart_data.append(
            {
                "month": month,
                "baseCase": round(max(0.0, base_balance), 2),
                "stressScenario": round(max(0.0, stress_balance), 2),
            }
        )
        base_balance -= expenses
        stress_balance -= final_burn

    # --- Gross margin calculation ---
    gross_margin = 0.0
    if stressed_revenue != 0:
        gross_margin = ((stressed_revenue - stressed_expenses) / stressed_revenue) * 100

    return {
        "cash_on_hand": cash,
        "cash_runway_base": base_runway,
        "cash_runway_stress": stress_runway,
        "gross_margin": round(gross_margin, 1),
        "burn_rate": round(final_burn, 2),
        "working_capital": round(cash - stressed_expenses, 2),
        "chart_data": chart_data,
        "risk_level": risk_level,
    }
