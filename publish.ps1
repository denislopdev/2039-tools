# Publish 2039 Tools to GitHub Pages
# Run after: gh auth login

$ErrorActionPreference = "Stop"

$git  = "$env:TEMP\mingit\cmd\git.exe"
$gh   = "$env:TEMP\ghcli\bin\gh.exe"
$repo = "C:\Users\denis\Desktop\2039 Tools"
$name = "2039-tools"

Set-Location $repo
$env:PATH = "$env:TEMP\mingit\cmd;$env:PATH"

if (-not (Test-Path $git)) {
    Write-Host "MinGit not found. Re-run publish from Cursor Agent." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $gh)) {
    Write-Host "GitHub CLI not found. Re-run publish from Cursor Agent." -ForegroundColor Red
    exit 1
}

& $gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in. Run first:" -ForegroundColor Yellow
    Write-Host ('  & "' + $gh + '" auth login') -ForegroundColor Cyan
    exit 1
}

& $gh auth setup-git 2>&1 | Out-Null

Write-Host "Creating repository $name..." -ForegroundColor Cyan
& $gh repo create ("denislopdev/" + $name) --public --source . --remote origin --description "2039 Tools - free web utilities by Denis Lop" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Repo may already exist, adding remote..." -ForegroundColor Yellow
    & $git remote remove origin 2>$null
    & $git remote add origin ("https://github.com/denislopdev/" + $name + ".git")
}

$branch = & $git branch --show-current
if ($branch -eq "master") {
    & $git branch -M main
}

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
& $git push -u origin main
if ($LASTEXITCODE -ne 0) {
    & $git push -u origin master
}

Write-Host "Enabling GitHub Pages..." -ForegroundColor Cyan
& $gh api ("repos/denislopdev/" + $name + "/pages") -X POST -f build_type=legacy -f "source[branch]=main" -f "source[path]=/" 2>&1
if ($LASTEXITCODE -ne 0) {
    & $gh api ("repos/denislopdev/" + $name + "/pages") -X POST -f build_type=legacy -f "source[branch]=master" -f "source[path]=/" 2>&1
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
Write-Host ("Site (wait 1-3 min): https://denislopdev.github.io/" + $name + "/") -ForegroundColor Green
Write-Host ("Repo: https://github.com/denislopdev/" + $name) -ForegroundColor Green
