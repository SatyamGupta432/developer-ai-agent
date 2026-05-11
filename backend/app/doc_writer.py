import os

def save_markdown(feature_name, content):

    os.makedirs("reports", exist_ok=True)

    # Sanitize and truncate the filename
    clean_name = "".join(c for c in feature_name if c.isalnum() or c in (" ", "-", "_")).strip()
    safe_name = clean_name.replace(" ", "_").upper()[:50]  # Limit to 50 characters

    if not safe_name:
        safe_name = "DOCUMENTATION"

    path = f"reports/FEATURE_{safe_name}.md"

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    return path