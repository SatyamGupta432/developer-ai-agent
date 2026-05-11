from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends

from app.git_utils import get_last_commit, get_git_diff
from app.ai_service import generate_documentation
from app.doc_writer import save_markdown
from app.pdf_generator import generate_pdf
from app.excel_generator import generate_excel_report
from app.github_utils import get_remote_commit
from app.database import engine, get_db, Base
from app.models import AnalysisRecord
from app.routes.auth_routes import router as auth_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/analyze")
def analyze_commit(db: Session = Depends(get_db)):
    try:
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

        try:
            generate_pdf(
                documentation,
                pdf_path
            )
        except Exception as e:
            print(f"PDF Generation failed: {e}")
            pdf_path = "Error generating PDF"

        # Save to database
        db_record = AnalysisRecord(
            commit_hash=commit["hash"],
            commit_message=commit["message"],
            author=commit["author"],
            documentation=documentation,
            markdown_path=markdown_path,
            pdf_path=pdf_path
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return {
            "id": db_record.id,
            "commit": commit,
            "documentation": documentation,
            "markdown": markdown_path,
            "pdf": pdf_path
        }
    except Exception as e:
        return {
            "error": str(e),
            "commit": None,
            "documentation": "Error: " + str(e),
            "markdown": None,
            "pdf": None
        }

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).all()
    return records

@app.get("/export/excel")
def export_excel(db: Session = Depends(get_db)):
    file_path = "reports/history_report.xlsx"
    generate_excel_report(db, file_path)
    return {"message": "Report generated", "path": file_path}

@app.get("/remote/analyze")
def analyze_remote(repo_name: str, db: Session = Depends(get_db)):
    commit = get_remote_commit(repo_name)
    if "error" in commit:
        return commit
    
    documentation = generate_documentation(commit["message"], "Remote repository analysis - Diff not available")
    
    db_record = AnalysisRecord(
        commit_hash=commit["hash"],
        commit_message=commit["message"],
        author=commit["author"],
        documentation=documentation
    )
    db.add(db_record)
    db.commit()
    
    return {"commit": commit, "documentation": documentation}

@app.get("/mcp/resources")
def mcp_resources(db: Session = Depends(get_db)):
    records = db.query(AnalysisRecord).all()
    return {
        "resources": [
            {
                "uri": f"docs://{r.commit_hash}",
                "name": f"Documentation for {r.commit_hash[:8]}",
                "mimeType": "text/markdown",
                "description": r.commit_message.split('\n')[0]
            } for r in records
        ]
    }

@app.get("/mcp/tools")
def mcp_tools():
    return {
        "tools": [
            {
                "name": "analyze_last_commit",
                "description": "Trigger analysis of the latest local git commit",
                "inputSchema": {
                    "type": "object",
                    "properties": {}
                }
            }
        ]
    }