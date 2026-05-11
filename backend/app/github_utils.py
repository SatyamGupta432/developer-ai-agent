from github import Github
import os
from dotenv import load_dotenv

load_dotenv()

def get_remote_commit(repo_name):
    """
    Fetches the latest commit from a remote GitHub repository.
    Example repo_name: 'SatyamGupta432/developer-ai-agent'
    """
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        return {"error": "GITHUB_TOKEN not found in environment"}
    
    g = Github(token)
    try:
        repo = g.get_repo(repo_name)
        commit = repo.get_commits()[0]
        
        return {
            "message": commit.commit.message,
            "author": commit.commit.author.name,
            "hash": commit.sha,
            "url": commit.html_url
        }
    except Exception as e:
        return {"error": str(e)}
