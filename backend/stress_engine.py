from ai_service import generate_financial_advice
    
def run_stress_test(
    cash,
    revenue,
    expenses,
    inflation,
    inventory,
    wage,
    terms,
    sales
    ):
    
    base_cash = cash
    base_revenue = revenue
    base_expenses = expenses
    
    stressed_revenue = (
        base_revenue * (1 + sales / 100)
    )
    
    stressed_expenses = (
        base_expenses *
        (
            1 +
            inflation / 100 +
            inventory / 100 +
            (wage / 100 * 0.5)
        )
    )
    
    terms_penalty = 0
    
    if terms > 30:
        terms_penalty = (
            (terms - 30) / 30
        ) * 3000
    
    final_burn = (
        stressed_expenses -
        stressed_revenue +
        terms_penalty
    )
    
    if final_burn < 5000:
        final_burn = 5000
    
    base_runway = int(
        (base_cash / base_expenses) * 30
    )
    
    stress_runway = int(
        (base_cash / final_burn) * 30
    )
    
    if stress_runway < 30:
        risk_level = "High"
    elif stress_runway < 60:
        risk_level = "Medium"
    else:
        risk_level = "Low"
    
    months = [
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]
    
    chart_data = []
    
    base_balance = base_cash
    stress_balance = base_cash
    
    for month in months:
    
        chart_data.append(
            {
                "month": month,
                "baseCase": max(
                    0,
                    round(base_balance, 2)
                ),
                "stressScenario": max(
                    0,
                    round(stress_balance, 2)
                )
            }
        )
    
        base_balance -= base_expenses
        stress_balance -= final_burn
    
    ai = generate_financial_advice(
        cash_on_hand=base_cash,
        burn_rate=final_burn,
        stress_runway_days=stress_runway,
        inflation=inflation,
        inventory=inventory,
        wage=wage,
        terms=terms,
        sales=sales
    )
    
    gross_margin = (
        (
            stressed_revenue -
            stressed_expenses
        ) / stressed_revenue
    ) * 100
    
    return {
        "cash_on_hand": base_cash,
        "cash_runway_base": base_runway,
        "cash_runway_stress": stress_runway,
        "gross_margin": round(
            gross_margin,
            1
        ),
        "burn_rate": round(
            final_burn,
            2
        ),
        "working_capital": round(
            base_cash -
            stressed_expenses,
            2
        ),
        "chart_data": chart_data,
        "risk_level": risk_level,
        "warnings": ai["warnings"],
        "recommendations": ai["recommendations"]
    }