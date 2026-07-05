# How to publish 2039 Tools on GitHub

All files are prepared and committed locally. You only need to **log in to GitHub once** and run the script.

## Step 1 — Log in to GitHub (one time)

Open PowerShell and run:

```powershell
& "$env:TEMP\ghcli\bin\gh.exe" auth login
```

Choose:
- **GitHub.com**
- **HTTPS**
- **Login with a web browser** (copy the code and confirm in your browser)

## Step 2 — Publish

```powershell
cd "C:\Users\denis\Desktop\2039 Tools"
powershell -ExecutionPolicy Bypass -File .\publish.ps1
```

The script will automatically:
1. Create the `2039-tools` repository on your account
2. Upload all files
3. Enable GitHub Pages

## Step 3 — Open your site

After 1–3 minutes, your site will be live at:

**https://denislopdev.github.io/2039-tools/**

---

## What's ready locally

- `index.html` — showcase page with all tools
- 9 HTML tools + visual editor JS
- `LICENSE` — free use with "Made by Denis Lop" attribution
- "Denis Lop" credit in every tool footer
- `README.md` for GitHub

## Preview locally (without GitHub)

Open in your browser:

`C:\Users\denis\Desktop\2039 Tools\index.html`
