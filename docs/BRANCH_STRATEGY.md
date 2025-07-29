# Branch Strategy & Git Workflow

## Overview

This document outlines our branching strategy and Git workflow for the RLX-Next WMS project. We follow a modified GitFlow approach optimized for modern development practices.

## Branch Structure

### Main Branches

#### `main` (Production)
- **Purpose**: Production-ready code
- **Protection**: ✅ Protected branch
- **Merge Policy**: Only via Pull Requests from `develop` or hotfix branches
- **Deployment**: Automatic deployment to production environment
- **Naming**: `main` (formerly `master`)

#### `develop` (Integration)
- **Purpose**: Integration branch for features and bug fixes
- **Protection**: ✅ Protected branch
- **Merge Policy**: Only via Pull Requests from feature branches
- **Deployment**: Automatic deployment to staging environment
- **Naming**: `develop`

### Supporting Branches

#### Feature Branches
- **Purpose**: Development of new features
- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming Convention**: `feature/ISSUE-NUMBER-short-description`
- **Examples**:
  - `feature/123-inventory-management`
  - `feature/456-fleet-tracking`
  - `feature/789-order-processing`

#### Release Branches
- **Purpose**: Prepare for production releases
- **Branch from**: `develop`
- **Merge to**: `main` and `develop`
- **Naming Convention**: `release/vX.Y.Z`
- **Examples**:
  - `release/v1.0.0`
  - `release/v1.1.0`
  - `release/v2.0.0`

#### Hotfix Branches
- **Purpose**: Critical production fixes
- **Branch from**: `main`
- **Merge to**: `main` and `develop`
- **Naming Convention**: `hotfix/ISSUE-NUMBER-short-description`
- **Examples**:
  - `hotfix/999-critical-security-fix`
  - `hotfix/888-database-connection-issue`

#### Bugfix Branches
- **Purpose**: Non-critical bug fixes
- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming Convention**: `bugfix/ISSUE-NUMBER-short-description`
- **Examples**:
  - `bugfix/777-ui-layout-issue`
  - `bugfix/666-api-response-error`

## Workflow Rules

### 1. Branch Protection Rules

#### Main Branch Protection
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Restrict pushes that create files larger than 100MB
- ✅ Require linear history
- ✅ Include administrators in restrictions

#### Develop Branch Protection
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Restrict pushes that create files larger than 100MB

### 2. Commit Message Standards

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples
```
feat(inventory): add barcode scanning functionality
fix(orders): resolve duplicate order creation issue
docs(readme): update installation instructions
refactor(api): optimize database queries
test(fleet): add unit tests for tracking service
```

### 3. Pull Request Guidelines

#### Required Elements
- ✅ Descriptive title following commit message format
- ✅ Detailed description of changes
- ✅ Link to related issue(s)
- ✅ Screenshots for UI changes
- ✅ Test coverage information
- ✅ Breaking changes documentation (if applicable)

#### Review Process
1. **Self-Review**: Author reviews their own PR first
2. **Code Review**: At least one team member approval required
3. **Automated Checks**: All CI/CD checks must pass
4. **Manual Testing**: Feature testing on staging environment
5. **Final Approval**: Lead developer or tech lead approval for main branch

### 4. Release Process

#### Standard Release (from develop)
1. Create release branch: `release/vX.Y.Z`
2. Update version numbers and changelog
3. Fix any release-specific issues
4. Create PR to merge into `main`
5. After merge to `main`, create PR to merge back to `develop`
6. Tag the release in `main`

#### Hotfix Release (from main)
1. Create hotfix branch: `hotfix/ISSUE-NUMBER-description`
2. Fix the critical issue
3. Update version number (patch increment)
4. Create PR to merge into `main`
5. After merge to `main`, create PR to merge back to `develop`
6. Tag the release in `main`

## Environment Strategy

### Development Environment
- **Branch**: `develop`
- **URL**: `https://dev.rlx-wms.com`
- **Database**: Development database
- **Features**: All features, including experimental

### Staging Environment
- **Branch**: `develop` (or release branches)
- **URL**: `https://staging.rlx-wms.com`
- **Database**: Staging database (production-like data)
- **Features**: Pre-production testing

### Production Environment
- **Branch**: `main`
- **URL**: `https://rlx-wms.com`
- **Database**: Production database
- **Features**: Stable, tested features only

## Version Management

### Semantic Versioning (SemVer)
Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Version Files
- `package.json` (frontend)
- `WMS.Backend.csproj` (backend)
- `CHANGELOG.md` (project-wide)

## Automation & CI/CD

### GitHub Actions Workflows
1. **Pull Request Checks**
   - Linting and formatting
   - Unit tests
   - Integration tests
   - Security scans
   - Build verification

2. **Deployment Workflows**
   - Development deployment (on develop branch)
   - Staging deployment (on develop branch)
   - Production deployment (on main branch)

### Quality Gates
- ✅ Code coverage > 80%
- ✅ No critical security vulnerabilities
- ✅ All tests passing
- ✅ No linting errors
- ✅ Performance benchmarks met

## Emergency Procedures

### Critical Production Issues
1. Create hotfix branch from `main`
2. Implement fix with minimal changes
3. Test thoroughly on staging
4. Create PR to `main` with expedited review
5. Deploy immediately after merge
6. Create follow-up PR to `develop`

### Rollback Procedure
1. Identify the problematic commit
2. Create hotfix branch from previous stable commit
3. Revert changes or implement fix
4. Follow hotfix process
5. Document incident and lessons learned

## Best Practices

### Do's
- ✅ Always create feature branches from `develop`
- ✅ Keep branches small and focused
- ✅ Write clear commit messages
- ✅ Update documentation with code changes
- ✅ Test thoroughly before creating PRs
- ✅ Review your own PR before requesting reviews
- ✅ Keep `develop` branch stable

### Don'ts
- ❌ Never commit directly to `main` or `develop`
- ❌ Don't merge broken code
- ❌ Don't skip code reviews
- ❌ Don't create large, monolithic PRs
- ❌ Don't ignore failing tests
- ❌ Don't forget to update documentation

## Tools & Integrations

### Required Tools
- **Git**: Version control
- **GitHub**: Repository hosting and PR management
- **GitHub Actions**: CI/CD automation
- **SonarQube**: Code quality analysis
- **Dependabot**: Dependency updates

### Recommended Tools
- **GitKraken/Sourcetree**: Git GUI clients
- **Conventional Changelog**: Automated changelog generation
- **Semantic Release**: Automated versioning

## Training & Onboarding

### New Team Members
1. Read this document thoroughly
2. Complete Git workflow training
3. Practice with sample repository
4. Shadow experienced team members
5. Start with small, low-risk changes

### Regular Reviews
- Monthly workflow effectiveness review
- Quarterly process improvements
- Annual strategy updates

---

*This document should be reviewed and updated regularly to ensure it remains current with team practices and industry standards.*