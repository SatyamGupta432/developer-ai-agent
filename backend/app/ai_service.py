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

    1. Feature Name
    2. Summary
    3. Technical Changes
    4. Testing Checklist
    5. Risks
    6. Engineering Tasks

    Format properly in markdown.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content
