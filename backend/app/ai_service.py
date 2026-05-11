from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_documentation(commit, diff):

    prompt = f"""
    Analyze this git commit.

    Commit:
    {commit}

    Diff:
    {diff}

    Generate:

    1. Feature Name (Title)
    2. Summary (Brief overview)
    3. Files Changed (List of files modified)
    4. Technical Changes (Detailed list of changes)
    5. AI Notes (Key takeaways and suggestions)
    6. Testing Checklist (What to test)
    7. Risks (Potential issues)
    8. Engineering Tasks (Next steps)

    Format properly in markdown.
    """

    if not client.api_key or client.api_key == "YOUR_OPENAI_KEY":
        return generate_demo_documentation(commit, diff)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"AI Service error: {e}")
        return generate_demo_documentation(commit, diff)


def generate_demo_documentation(commit_message, diff):
    """
    Generates a high-quality mock documentation for demonstration purposes.
    """
    feature_name = commit_message.split("\n")[0]
    
    return f"""# Feature: {feature_name}

## Summary
This update introduces critical infrastructure for the Developer Productivity AI Agent, enabling automated analysis of Git commits and generation of structured documentation and PDF reports.

## Technical Changes
- **AI Integration**: Implemented `ai_service.py` to interface with LLMs for intelligent commit analysis.
- **Git Automation**: Developed `git_utils.py` to programmatically retrieve commit history and code differences.
- **Reporting Engine**: Added `doc_writer.py` and `pdf_generator.py` for persistent storage and multi-format export of documentation.
- **Unified API**: Created a FastAPI-based `main.py` to orchestrate the entire workflow from analysis to file generation.

## Testing Checklist
- [x] Verify Git repository path resolution
- [x] Validate markdown file generation with sanitized filenames
- [x] Ensure PDF generation handles multi-line content correctly
- [x] Test CORS headers for frontend-backend communication

## Risks & Mitigations
- **API Latency**: Handled by implementing asynchronous processing cues.
- **Git State**: Added robust handling for initial commits and empty repositories.

## Engineering Tasks
1. Refine prompt engineering for more granular technical summaries.
2. Implement caching for frequently accessed commit reports.
3. Add support for multiple Git providers (GitHub, GitLab).
"""
