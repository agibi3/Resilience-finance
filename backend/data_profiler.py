import pandas as pd


def profile_dataframe(df: pd.DataFrame) -> dict:
    """Generates descriptive statistics (count, mean, median, min, max, sum)

    for all numeric columns in a DataFrame.

    Parameters:
    df (pd.DataFrame): The input DataFrame to profile.

    Returns:
    dict: A dictionary containing structural metrics for each numeric column.
    """
    profile = {}
    numeric_cols = df.select_dtypes(include="number").columns

    for col in numeric_cols:
        profile[col] = {
            "count": int(df[col].count()),
            "mean": float(df[col].mean()),
            "median": float(df[col].median()),
            "min": float(df[col].min()),
            "max": float(df[col].max()),
            "sum": float(df[col].sum()),
        }

    return profile
