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
from fastapi import FastAPI
from git import Repo
from app.database import SessionLocal
from app.models import CommitReport
from app.schemas import AnalyzeRequest

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
        commit_data = get_last_commit()
        diff = get_git_diff()

        documentation = generate_documentation(commit_data["message"], diff)

        # Save to AnalysisRecord
        db_record = AnalysisRecord(
            commit_hash=commit_data["hash"],
            commit_message=commit_data["message"],
            author=commit_data["author"],
            documentation=documentation,
        )
        db.add(db_record)

        # Save to CommitReport
        report = CommitReport(
            commit_hash=commit_data["hash"],
            commit_message=commit_data["message"],
            ai_summary=documentation
        )
        db.add(report)
        db.commit()
        db.refresh(report)

        return {
            "status": "success",
            "commit_hash": commit_data["hash"],
            "documentation": documentation,
            "report_id": report.id
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


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

    documentation = generate_documentation(
        commit["message"], "Remote repository analysis - Diff not available"
    )

    db_record = AnalysisRecord(
        commit_hash=commit["hash"],
        commit_message=commit["message"],
        author=commit["author"],
        documentation=documentation,
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
                "description": r.commit_message.split("\n")[0],
            }
            for r in records
        ]
    }


@app.get("/mcp/tools")
def mcp_tools():
    return {
        "tools": [
            {
                "name": "analyze_last_commit",
                "description": "Trigger analysis of the latest local git commit",
                "inputSchema": {"type": "object", "properties": {}},
            }
        ]
    }


@app.post("/analyze")
def analyze(data: AnalyzeRequest, db: Session = Depends(get_db)):
    try:
        import os
        repo = Repo(data.project_path)
        commit = repo.head.commit
        
        # Get diff
        if not commit.parents:
            diff = repo.git.diff("4b825dc642cb6eb9a060e54bf8d69288fbee4904", commit.hexsha)
        else:
            parent = commit.parents[0]
            diff = repo.git.diff(parent.hexsha, commit.hexsha)

        documentation = generate_documentation(commit.message, diff)
        
        # Save to AnalysisRecord
        db_record = AnalysisRecord(
            commit_hash=commit.hexsha,
            commit_message=commit.message,
            author=str(commit.author),
            documentation=documentation,
        )
        db.add(db_record)
        
        # Save to CommitReport
        report = CommitReport(
            commit_hash=commit.hexsha,
            commit_message=commit.message,
            ai_summary=documentation
        )
        db.add(report)
        db.commit()

        return {
            "status": "success",
            "commit_hash": commit.hexsha,
            "documentation": documentation,
            "report_id": report.id
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/reports")
def get_reports():

    db = SessionLocal()

    reports = db.query(CommitReport).all()

    db.close()

    return reports
