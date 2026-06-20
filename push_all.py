import sys, json, base64, os, requests as req
sys.stdout.reconfigure(encoding="utf-8")

TOKEN = os.environ.get("GITHUB_TOKEN", "")
H = {"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github+json"}
API = "https://api.github.com/repos/momoheCCdaddy/ivd-b2b-platform"

if not TOKEN:
    print("Error: GITHUB_TOKEN environment variable not set")
    sys.exit(1)

r = req.get(f"{API}/git/refs/heads/main", headers=H)
