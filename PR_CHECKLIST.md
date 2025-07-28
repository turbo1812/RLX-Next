# Pull Request Checklist

## Overview
This checklist ensures that all PRs meet our quality standards and maintain documentation-code alignment.

## Pre-Submission Checklist

### ✅ Code Quality
- [ ] Code follows project conventions and style guide
- [ ] No TypeScript errors or warnings
- [ ] No linting errors
- [ ] Code is properly formatted
- [ ] No console.log statements in production code
- [ ] No hardcoded values that should be configurable

### ✅ Functionality
- [ ] Feature works as expected
- [ ] All user stories/requirements are met
- [ ] Edge cases are handled
- [ ] Error scenarios are tested
- [ ] No breaking changes (or breaking changes are documented)

### ✅ Testing
- [ ] Unit tests added for new functionality
- [ ] Existing tests still pass
- [ ] Test coverage meets minimum threshold (80%)
- [ ] E2E tests added for critical user flows (if applicable)
- [ ] Manual testing completed

### ✅ Documentation
- [ ] README.md updated if needed
- [ ] FEATURE_MATRIX.md updated
- [ ] Code comments added for complex logic
- [ ] API documentation updated (if applicable)
- [ ] Component documentation updated (if applicable)

### ✅ Technical Debt
- [ ] No new technical debt introduced
- [ ] Existing technical debt items logged in TECHNICAL_DEBT.md
- [ ] Quick fixes documented as debt items
- [ ] Architecture decisions recorded (if applicable)

### ✅ Security
- [ ] No security vulnerabilities introduced
- [ ] Input validation implemented
- [ ] Authentication/authorization considered
- [ ] Sensitive data not exposed

### ✅ Performance
- [ ] No performance regressions
- [ ] Bundle size impact assessed
- [ ] Lazy loading implemented where appropriate
- [ ] Images optimized

### ✅ Accessibility
- [ ] ARIA labels added where needed
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility tested
- [ ] Color contrast meets WCAG standards

### ✅ Responsive Design
- [ ] Works on mobile devices
- [ ] Works on tablets
- [ ] Works on desktop
- [ ] No horizontal scrolling on mobile

## Review Process

### For Reviewers
- [ ] Code review completed
- [ ] Documentation review completed
- [ ] Feature matrix review completed
- [ ] Technical debt assessment completed
- [ ] Security review completed (if applicable)
- [ ] Performance review completed (if applicable)

### For Authors
- [ ] All reviewer feedback addressed
- [ ] All checklist items completed
- [ ] PR description is clear and complete
- [ ] Related issues linked
- [ ] Breaking changes documented

## Definition of Done

A PR is considered "Done" when:

1. **All checklist items are completed**
2. **At least one reviewer has approved**
3. **All CI/CD checks pass**
4. **Documentation is updated**
5. **Technical debt is logged**
6. **Feature matrix is updated**

## Special Cases

### Bug Fixes
- [ ] Root cause identified
- [ ] Fix addresses the root cause, not just symptoms
- [ ] Regression test added
- [ ] Similar issues checked for

### Refactoring
- [ ] No functional changes
- [ ] All tests still pass
- [ ] Performance impact assessed
- [ ] Code complexity reduced

### New Features
- [ ] User stories clearly defined
- [ ] Acceptance criteria met
- [ ] Feature flags implemented (if needed)
- [ ] Rollback plan documented

### Infrastructure Changes
- [ ] Environment variables documented
- [ ] Deployment instructions updated
- [ ] Rollback procedures documented
- [ ] Monitoring/alerting updated

## Templates

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Related Issues
Closes #123
Related to #456

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] E2E tests added (if applicable)

## Documentation
- [ ] README updated
- [ ] Feature matrix updated
- [ ] Technical debt logged

## Checklist
- [ ] All checklist items completed
- [ ] No new technical debt introduced
- [ ] Code follows project conventions
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Comment Template
```markdown
## Review Summary
Overall assessment of the PR

## Strengths
- Point 1
- Point 2

## Areas for Improvement
- [ ] Issue 1
- [ ] Issue 2

## Technical Debt
- [ ] New debt item identified: [description]
- [ ] Existing debt item addressed: [ID]

## Documentation
- [ ] README needs update: [section]
- [ ] Feature matrix needs update: [feature]
- [ ] Technical debt needs logging: [item]

## Security
- [ ] Security concern: [description]
- [ ] Input validation needed: [field]

## Performance
- [ ] Performance concern: [description]
- [ ] Bundle size impact: [details]
```

## Quality Gates

### Automatic Checks
- [ ] Build passes
- [ ] Tests pass
- [ ] Linting passes
- [ ] TypeScript compilation succeeds
- [ ] Bundle size within limits

### Manual Checks
- [ ] Code review completed
- [ ] Documentation review completed
- [ ] Security review completed (if applicable)
- [ ] Performance review completed (if applicable)

## Escalation

If a PR cannot meet all checklist items:

1. **Document the reason** in the PR description
2. **Create technical debt items** for missing requirements
3. **Get approval** from team lead or architect
4. **Plan follow-up** to address missing items

---

**Last Updated**: Today
**Next Review**: Next sprint
**Owner**: Development Team 