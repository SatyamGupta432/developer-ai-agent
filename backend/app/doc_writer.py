import os

def save_markdown(feature_name, content):

    os.makedirs("docs", exist_ok=True)

    # Sanitize and truncate the filename
    clean_name = "".join(c for c in feature_name if c.isalnum() or c in (" ", "-", "_")).strip()
    safe_name = clean_name.replace(" ", "-")[:50]  # Limit to 50 characters

    if not safe_name:
        safe_name = "documentation"

    path = f"docs/{safe_name}.md"

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    return path