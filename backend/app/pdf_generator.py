from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

def generate_pdf(content, filename):

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    elements = []

    paragraphs = content.split("\n")

    for p in paragraphs:

        elements.append(
            Paragraph(p, styles["BodyText"])
        )

        elements.append(
            Spacer(1, 10)
        )

    doc.build(elements)