from git import Repo
import os
from dotenv import load_dotenv

load_dotenv()

repo = Repo(os.getenv("PROJECT_PATH"))


def get_last_commit():

    commit = repo.head.commit

    return {
        "message": commit.message,
        "author": str(commit.author),
        "hash": commit.hexsha,
    }


def get_git_diff():

    commit = repo.head.commit
    
    if not commit.parents:
        # 4b825dc642cb6eb9a060e54bf8d69288fbee4904 is the universal git empty tree hash
        diff = repo.git.diff("4b825dc642cb6eb9a060e54bf8d69288fbee4904", commit.hexsha)
    else:
        parent = commit.parents[0]
        diff = repo.git.diff(parent.hexsha, commit.hexsha)

    return diff
