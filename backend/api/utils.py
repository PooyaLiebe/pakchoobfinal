import datetime


def generate_formcode(phase, section_code, problemdate):
    """
    Generates a unique formcode based on the phase, section code, and problem date.

    Args:
    - phase (str): The phase of the form (e.g., "01", "02", etc.).
    - section_code (str): The section code (e.g., "01", "02").
    - problemdate (datetime): The problem date for the form, used for generating a unique part of the form code.

    Returns:
    - str: The generated formcode.
    """
    # Format the problemdate into a YYYYMMDD string
    date_str = problemdate.strftime("%Y%m%d")

    # Combine phase, section code, and the date string to generate the formcode
    formcode = f"{phase}-{section_code}-{date_str}-"

    return formcode
