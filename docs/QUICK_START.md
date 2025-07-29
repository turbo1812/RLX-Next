# Quick Start Guide - Branch Strategy

## 🚀 Getting Started

This guide provides a quick overview of our branch strategy and common workflows.

## 📋 Branch Overview

```
main (production)
├── develop (integration)
    ├── feature/123-inventory-management
    ├── feature/456-fleet-tracking
    ├── bugfix/777-ui-layout-issue
    └── release/v1.1.0
```

## 🔄 Common Workflows

### Starting a New Feature

```bash
# 1. Ensure you're on develop and it's up to date
git checkout develop
git pull origin develop

# 2. Create a new feature branch
git checkout -b feature/123-inventory-management

# 3. Make your changes and commit
git add .
git commit -m "feat(inventory): add barcode scanning functionality"

# 4. Push your branch
git push -u origin feature/123-inventory-management

# 5. Create a Pull Request to develop
# Go to GitHub and create PR from feature/123-inventory-management to develop
```

### Fixing a Bug

```bash
# 1. Create bugfix branch from develop
git checkout develop
git pull origin develop
git checkout -b bugfix/777-ui-layout-issue

# 2. Fix the bug and commit
git add .
git commit -m "fix(ui): resolve layout issue in inventory grid"

# 3. Push and create PR to develop
git push -u origin bugfix/777-ui-layout-issue
```

### Critical Production Fix (Hotfix)

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/999-critical-security-fix

# 2. Fix the issue and commit
git add .
git commit -m "fix(security): patch critical authentication vulnerability"

# 3. Push and create PR to main
git push -u origin hotfix/999-critical-security-fix

# 4. After merging to main, create PR to develop
```

## 📝 Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples:
```bash
git commit -m "feat(inventory): add barcode scanning functionality"
git commit -m "fix(orders): resolve duplicate order creation issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(api): optimize database queries"
git commit -m "test(fleet): add unit tests for tracking service"
git commit -m "chore(deps): update Angular to version 18.2.1"
```

## 🔒 Branch Protection Rules

### Main Branch
- ✅ Requires pull request reviews
- ✅ Requires status checks to pass
- ✅ Requires branches to be up to date
- ✅ Requires linear history
- ✅ Administrators included in restrictions

### Develop Branch
- ✅ Requires pull request reviews
- ✅ Requires status checks to pass
- ✅ Requires branches to be up to date

## 🚀 Deployment Flow

```
Feature Branch → Develop → Staging → Main → Production
```

1. **Feature Development**: Work on feature branches
2. **Integration**: Merge features into `develop`
3. **Staging**: `develop` automatically deploys to staging
4. **Production**: Create release branch from `develop`, test, then merge to `main`

## 📋 Pull Request Checklist

Before creating a PR, ensure:

- [ ] Code follows project standards
- [ ] Tests are added and passing
- [ ] Documentation is updated
- [ ] Self-review completed
- [ ] No breaking changes (or properly documented)
- [ ] Security considerations addressed

## 🛠️ Useful Commands

### Branch Management
```bash
# List all branches
git branch -a

# Switch to a branch
git checkout branch-name

# Create and switch to new branch
git checkout -b feature/new-feature

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
git log --oneline --graph

# View file changes
git diff

# View staged changes
git diff --cached
```

### Syncing with Remote
```bash
# Fetch latest changes
git fetch origin

# Pull latest changes
git pull origin branch-name

# Push changes
git push origin branch-name

# Push new branch
git push -u origin branch-name
```

## 🚨 Emergency Procedures

### Rollback Production
```bash
# 1. Identify the problematic commit
git log --oneline main

# 2. Create hotfix branch from previous stable commit
git checkout main
git checkout -b hotfix/rollback-v1.1.0
git revert <commit-hash>

# 3. Push and create PR to main
git push -u origin hotfix/rollback-v1.1.0
```

### Force Push (Use with caution!)
```bash
# Only use in emergencies and coordinate with team
git push --force-with-lease origin branch-name
```

## 📞 Getting Help

- **Branch Strategy**: See [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md)
- **Pull Request Template**: See [.github/pull_request_template.md](../../.github/pull_request_template.md)
- **CI/CD Workflows**: See [.github/workflows/](../../.github/workflows/)
- **Team Lead**: Contact your team lead for urgent issues

## 🎯 Best Practices

### Do's ✅
- Always create feature branches from `develop`
- Keep branches small and focused
- Write clear commit messages
- Update documentation with code changes
- Test thoroughly before creating PRs
- Review your own PR before requesting reviews

### Don'ts ❌
- Never commit directly to `main` or `develop`
- Don't merge broken code
- Don't skip code reviews
- Don't create large, monolithic PRs
- Don't ignore failing tests
- Don't forget to update documentation

---

*This guide is a quick reference. For detailed information, see the [Branch Strategy](BRANCH_STRATEGY.md) document.*