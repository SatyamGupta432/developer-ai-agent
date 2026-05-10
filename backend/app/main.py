from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.git_utils import (
    get_last_commit,
    get_git_diff
)

from app.ai_service import generate_documentation

from app.doc_writer import save_markdown

from app.pdf_generator import generate_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analyze")
def analyze_commit():

    commit = get_last_commit()

    diff = get_git_diff()

    documentation = generate_documentation(
        commit["message"],
        diff
    )

    markdown_path = save_markdown(
        commit["message"],
        documentation
    )

    pdf_path = f"reports/{commit['hash']}.pdf"

    generate_pdf(
        documentation,
        pdf_path
    )

    return {
        "commit": commit,
        "documentation": documentation,
        "markdown": markdown_path,
        "pdf": pdf_path
    }