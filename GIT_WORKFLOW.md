# Git Workflow for WMS Project

## 🎯 Overview

This document outlines the Git workflow and best practices for the Warehouse Management System (WMS) project.

## 📋 Branch Strategy

### Main Branches

- **`main`** - Production-ready code (stable releases)
- **`develop`** - Integration branch for features (development)

### Feature Branches

- **`feature/*`** - New features (e.g., `feature/user-authentication`)
- **`bugfix/*`** - Bug fixes (e.g., `bugfix/inventory-calculations`)
- **`hotfix/*`** - Critical production fixes (e.g., `hotfix/security-patch`)

## 🔄 Workflow

### 1. Starting New Work

```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Making Changes

```bash
# Make your changes
# Stage files
git add .

# Commit with conventional commit message
git commit -m "feat: add user authentication system"
```

### 3. Conventional Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add inventory search functionality"
git commit -m "fix: resolve order status update issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve warehouse layout component"
```

### 4. Pushing Changes

```bash
# Push feature branch
git push origin feature/your-feature-name
```

### 5. Creating Pull Request

1. Go to GitHub repository
2. Create Pull Request from `feature/*` to `develop`
3. Add description of changes
4. Request code review
5. Address review comments
6. Merge to `develop`

### 6. Release Process

```bash
# Merge develop to main for release
git checkout main
git merge develop
git push origin main

# Create release tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 🛠️ Useful Commands

### Branch Management

```bash
# List all branches
git branch -a

# Switch to branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```

### Status and History

```bash
# Check status
git status

# View commit history
git log --oneline

# View file changes
git diff

# View staged changes
git diff --cached
```

### Stashing

```bash
# Stash changes
git stash

# List stashes
git stash list

# Apply stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Undoing Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo staged changes
git reset HEAD

# Undo file changes
git checkout -- filename
```

## 📝 Commit Message Guidelines

### Good Examples

```bash
git commit -m "feat: add real-time inventory tracking"
git commit -m "fix: resolve order processing timeout issue"
git commit -m "docs: update deployment instructions"
git commit -m "refactor: optimize database queries"
git commit -m "test: add unit tests for inventory service"
```

### Bad Examples

```bash
git commit -m "fixed stuff"
git commit -m "updated code"
git commit -m "wip"
git commit -m "changes"
```

## 🔧 Configuration

### Global Git Config

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Repository-specific Config

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 🚨 Best Practices

1. **Always pull before starting new work**
2. **Use descriptive branch names**
3. **Write clear commit messages**
4. **Keep commits atomic and focused**
5. **Test before committing**
6. **Review your changes before pushing**
7. **Use Pull Requests for code review**
8. **Keep feature branches short-lived**

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Remember: Good Git practices lead to better collaboration and code quality!** 🚀 