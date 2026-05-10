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

    parent = commit.parents[0]

    diff = repo.git.diff(parent, commit)

    return diff
