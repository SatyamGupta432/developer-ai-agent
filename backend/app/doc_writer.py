import os

def save_markdown(feature_name, content):

    os.makedirs("docs", exist_ok=True)

    safe_name = feature_name.replace(" ", "-")

    path = f"docs/{safe_name}.md"

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    return path