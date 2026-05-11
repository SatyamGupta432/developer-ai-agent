import pandas as pd
import os
from sqlalchemy.orm import Session
from .models import AnalysisRecord

def generate_excel_report(db: Session, output_path: "reports/history_report.xlsx"):
    records = db.query(AnalysisRecord).all()
    
    data = []
    for r in records:
        data.append({
            "ID": r.id,
            "Date": r.created_at,
            "Author": r.author,
            "Hash": r.commit_hash,
            "Message": r.commit_message,
            "Documentation": r.documentation[:500] + "..." if len(r.documentation) > 500 else r.documentation
        })
    
    df = pd.DataFrame(data)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_excel(output_path, index=False, engine='openpyxl')
    
    return output_path
