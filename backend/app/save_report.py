from app.database import SessionLocal
from app.models import CommitReport


def save_commit_report(data):

    db = SessionLocal()

    report = CommitReport(
        project_name=data["project_name"],
        project_path=data["project_path"],
        commit_hash=data["commit_hash"],
        commit_message=data["commit_message"],
        author=data["author"],
        documentation=data["documentation"],
        risks=data["risks"],
        tasks=data["tasks"],
    )

    db.add(report)

    db.commit()

    db.refresh(report)

    db.close()

    return report
