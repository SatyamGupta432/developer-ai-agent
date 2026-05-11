from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

def generate_pdf(content, filename):
    doc = SimpleDocTemplate(filename)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = styles["Heading1"]
    section_style = styles["Heading2"]
    body_style = styles["BodyText"]

    elements = []

    lines = content.split("\n")

    for line in lines:
        line = line.strip()
        if not line:
            elements.append(Spacer(1, 10))
            continue

        if line.startswith("# "):
            elements.append(Paragraph(line[2:], title_style))
            elements.append(Spacer(1, 12))
        elif line.startswith("## "):
            elements.append(Paragraph(line[3:], section_style))
            elements.append(Spacer(1, 8))
        elif line.startswith("- ") or line.startswith("* "):
            elements.append(Paragraph(f"• {line[2:]}", body_style))
        else:
            elements.append(Paragraph(line, body_style))
        
        elements.append(Spacer(1, 6))

    doc.build(elements)