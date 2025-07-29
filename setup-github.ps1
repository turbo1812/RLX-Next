# GitHub Repository Setup Script
# This script will help you create and connect to a GitHub repository

Write-Host "=== GitHub Repository Setup ===" -ForegroundColor Green
Write-Host ""

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Get repository name from user
$repoName = Read-Host "Enter the name for your GitHub repository (e.g., RLX-WMS)"

# Get GitHub username
$username = Read-Host "Enter your GitHub username"

# Create repository URL
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "Repository will be created at: $repoUrl" -ForegroundColor Yellow
Write-Host ""

# Instructions for manual repository creation
Write-Host "=== Manual Steps Required ===" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: $repoName" -ForegroundColor White
Write-Host "3. Make it Public or Private (your choice)" -ForegroundColor White
Write-Host "4. DO NOT initialize with README (we already have one)" -ForegroundColor White
Write-Host "5. Click 'Create repository'" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Press Enter when you've created the repository, or 'q' to quit"

if ($continue -eq 'q') {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    exit 0
}

# Add remote origin
Write-Host "Adding remote origin..." -ForegroundColor Green
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Remote origin added successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add remote origin" -ForegroundColor Red
    exit 1
}

# Set main as default branch
Write-Host "Setting main as default branch..." -ForegroundColor Green
git branch -M main

# Push to GitHub
Write-Host "Pushing code to GitHub..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== SUCCESS! ===" -ForegroundColor Green
    Write-Host "Your repository is now available at: $repoUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "- Visit your repository on GitHub" -ForegroundColor White
    Write-Host "- Set up branch protection rules if needed" -ForegroundColor White
    Write-Host "- Add collaborators if working with a team" -ForegroundColor White
} else {
    Write-Host "✗ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "You may need to authenticate with GitHub first." -ForegroundColor Yellow
    Write-Host "Try running: git config --global user.name 'Your Name'" -ForegroundColor Yellow
    Write-Host "And: git config --global user.email 'your.email@example.com'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")