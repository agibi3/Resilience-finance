import pandas as pd


def clean_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """Cleans a DataFrame by stripping column whitespaces, removing duplicate rows,

    and filling missing values based on column data types.

    Parameters:
    df (pd.DataFrame): The input DataFrame to clean.

    Returns:
    tuple: A tuple containing the cleaned DataFrame (pd.DataFrame)
           and a summary report (dict) of the operations performed.
    """
    report = {}
    original_rows = len(df)

    # Strip whitespace from column names and drop duplicate rows
    df.columns = df.columns.str.strip()
    df = df.drop_duplicates()
    report["duplicates_removed"] = original_rows - len(df)

    # Impute missing values in numeric columns with the median
    numeric_cols = df.select_dtypes(include="number").columns
    for col in numeric_cols:
        df[col] = df[col].fillna(df[col].median())

    # Impute missing values in object/text columns with 'Unknown'
    text_cols = df.select_dtypes(include="object").columns
    for col in text_cols:
        df[col] = df[col].fillna("Unknown")

    return df, report
