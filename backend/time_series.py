from typing import Any, Dict, List
import pandas as pd


def aggregate_data(df: pd.DataFrame, period: str = "monthly") -> List[Dict[str, Any]]:
    """Identifies a date column in the DataFrame and aggregates numeric columns

    by summing them over a specified period (monthly, quarterly, or yearly).

    Parameters:
    df (pd.DataFrame): The input DataFrame.
    period (str): The time interval for aggregation ('monthly', 'quarterly', 'yearly').

    Returns:
    List[Dict[str, Any]]: A list of dictionaries representing the aggregated records.
    """
    date_column = None

    # Dynamically locate the first column with 'date' in its name
    for col in df.columns:
        if "date" in col.lower():
            date_column = col
            break

    if not date_column:
        return []

    # Enforce datetime parsing and filter out non-numeric columns
    df[date_column] = pd.to_datetime(df[date_column], errors="coerce")
    numeric_cols = df.select_dtypes(include="number").columns

    if len(numeric_cols) == 0:
        return []

    # Map period keywords to standard Pandas frequency aliases
    frequency_mapping = {
        "monthly": "M",
        "quarterly": "Q",
        "yearly": "Y"
    }
    # Fallback to 'Y' (yearly) if an unrecognized period is provided
    freq = frequency_mapping.get(period.lower(), "Y")

    # Aggregate data using a single consolidated groupby pipeline (DRY approach)
    grouped = (
        df.groupby(pd.Grouper(key=date_column, freq=freq))[numeric_cols]
        .sum()
        .reset_index()
    )

    # Cast datetime objects to strings to make the output JSON-serializable
    grouped[date_column] = grouped[date_column].astype(str)

    return grouped.to_dict(orient="records")
