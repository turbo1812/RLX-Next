Write-Host "=== GitHub Repository Setup ===" -ForegroundColor Green
Write-Host ""

$repoName = Read-Host "Enter repository name (e.g., RLX-WMS)"
$username = Read-Host "Enter your GitHub username"

$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "Please create a repository at: $repoUrl" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Name: $repoName" -ForegroundColor White
Write-Host "3. Don't initialize with README" -ForegroundColor White
Write-Host "4. Click Create repository" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter when done"

Write-Host "Adding remote origin..." -ForegroundColor Green
git remote add origin $repoUrl

Write-Host "Setting main branch..." -ForegroundColor Green
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Done! Visit: $repoUrl" -ForegroundColor Green