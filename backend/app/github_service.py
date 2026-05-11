from github import Github

g = Github("YOUR_GITHUB_TOKEN")

repo = g.get_repo("username/repo")

issue = repo.get_issue(number=1)

issue.create_comment("✅ AI analysis completed")
