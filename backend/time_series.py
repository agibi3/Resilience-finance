import pandas as pd
from typing import Any, Dict, List

def aggregate_data(df: pd.DataFrame, period: str = "monthly") -> List[Dict[str, Any]]:
    """Aggregates numeric columns dynamically by detecting datetime constraints."""
    date_column = None

    # Step 1: Look for common keyword matches in headers
    for col in df.columns:
        if any(keyword in col.lower() for keyword in ["date", "time", "month", "period", "timestamp"]):
            date_column = col
            break

    # Step 2: Fallback to pandas dtype inference if no keyword matches
    if not date_column:
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                date_column = col
                break

    if not date_column:
        return []

    df[date_column] = pd.to_datetime(df[date_column], errors="coerce")
    numeric_cols = df.select_dtypes(include="number").columns

    if len(numeric_cols) == 0:
        return []

    # Map frontend inputs directly to Pandas frequency aliases
    frequency_mapping = {
        "monthly": "ME",   # 'ME' is the modern Pandas alias for Month-End
        "quarterly": "QE", # Quarter-End
        "yearly": "YE",    # Year-End
        "annual": "YE"     # Catch-all for TopBar.tsx mismatch
    }
    
    freq = frequency_mapping.get(period.lower(), "YE")

    grouped = (
        df.groupby(pd.Grouper(key=date_column, freq=freq))[numeric_cols]
        .sum()
        .reset_index()
    )

    grouped[date_column] = grouped[date_column].dt.strftime('%Y-%m-%d')

    return grouped.to_dict(orient="records")
