# Git Workflow & Conventions

This document outlines the git branching strategy and commit conventions for this project.

## Branch Naming Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch for features

### Feature Branches
Pattern: `feat/<feature-name>`

Examples:
- `feat/slack-notifications`
- `feat/add-contact-form`
- `feat/email-verification`

### Bug Fix Branches
Pattern: `fix/<bug-description>`

Examples:
- `fix/email-sending-timeout`
- `fix/slack-webhook-auth`
- `fix/contact-validation`

### Documentation Branches
Pattern: `docs/<description>`

Examples:
- `docs/api-documentation`
- `docs/setup-guide`
- `docs/deployment-instructions`

### Refactoring Branches
Pattern: `refactor/<component-name>`

Examples:
- `refactor/error-handler`
- `refactor/database-service`
- `refactor/email-service`

### Performance Branches
Pattern: `perf/<optimization-name>`

Examples:
- `perf/database-queries`
- `perf/api-response-time`

### Test Branches
Pattern: `test/<test-description>`

Examples:
- `test/contact-api-tests`
- `test/slack-service-tests`

## Commit Message Format

### Structure
\`\`\`
<type>: <subject>

<body>

<footer>
\`\`\`

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Test additions or modifications
- **chore**: Build process, dependencies, tools
- **ci**: CI/CD configuration changes

### Subject Line Rules
- Use imperative mood ("add" not "adds" or "added")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters
- Be specific and clear

### Examples

✅ Good:
\`\`\`
feat: add Slack notifications for new contacts
fix: resolve email sending timeout issue
docs: update API documentation with examples
test: add comprehensive contact API tests
refactor: improve error handling in email service
perf: optimize database queries for contact retrieval
\`\`\`

❌ Bad:
\`\`\`
Added Slack notifications
Fixed bugs
Updated docs
tests added
Refactored
Optimized
\`\`\`

## Workflow Example

### Step 1: Create Feature Branch
\`\`\`bash
git checkout develop
git pull origin develop
git checkout -b feat/add-slack-notifications
\`\`\`

### Step 2: Make Changes
\`\`\`bash
# Edit files
git status
git add src/routes/slack.js src/services/slackService.js
git commit -m "feat: add Slack webhook integration"

# Make more changes
git add test/slack.test.js
git commit -m "test: add Slack service tests"
\`\`\`

### Step 3: Push to Remote
\`\`\`bash
git push origin feat/add-slack-notifications
\`\`\`

### Step 4: Create Pull Request
- Title: `feat: add Slack notifications for new contacts`
- Description: Explain what and why
- Link issues if applicable
- Request reviewers

### Step 5: Merge to Develop
After approval:
\`\`\`bash
git checkout develop
git pull origin develop
git merge feat/add-slack-notifications
git push origin develop
\`\`\`

### Step 6: Deploy to Production
\`\`\`bash
git checkout main
git pull origin main
git merge develop
git push origin main
# Tag release
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
\`\`\`

## Best Practices

### Commit Frequently
- Make small, focused commits
- Each commit should be a logical unit
- Easier to review and debug

### Write Meaningful Messages
- Use commit messages as documentation
- Explain WHY, not just WHAT
- Help future developers understand changes

### Keep Branches Updated
\`\`\`bash
# Before creating a PR
git fetch origin
git rebase origin/develop
git push origin feat/your-feature --force-with-lease
\`\`\`

### Squash Before Merge (Optional)
\`\`\`bash
# If you have many small commits
git rebase -i HEAD~3  # Squash last 3 commits
git push --force-with-lease
\`\`\`

### Delete Branches After Merge
\`\`\`bash
git branch -d feat/your-feature
git push origin --delete feat/your-feature
\`\`\`

## Commit Message Examples

### Adding a Feature
\`\`\`
feat: add rate limiting to contact form

- Implement express-rate-limit middleware
- Limit contact submissions to 5 per hour per IP
- Add configuration in environment variables
- Update API documentation

Closes #123
\`\`\`

### Fixing a Bug
\`\`\`
fix: resolve Slack webhook authentication error

- Verify SLACK_WEBHOOK_URL is set before sending messages
- Add proper error handling and logging
- Add unit tests for error scenarios

Fixes #456
\`\`\`

### Documentation
\`\`\`
docs: add deployment guide

- Add Heroku deployment instructions
- Add AWS EC2 setup steps
- Include environment variable configuration
\`\`\`

### Tests
\`\`\`
test: add comprehensive contact API tests

- Add tests for contact creation
- Add validation error tests
- Add pagination tests
- Achieve 85% code coverage
\`\`\`

### Refactoring
\`\`\`
refactor: improve error handling in email service

- Extract error messages to constants
- Add detailed logging for debugging
- Improve error response formatting
- Update related tests

No functional changes
\`\`\`

## Review Checklist

Before submitting a PR:
- [ ] Branch follows naming convention
- [ ] Commits have descriptive messages
- [ ] Code passes linting: `npm run lint`
- [ ] All tests pass: `npm test`
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] No console.log() statements left
- [ ] Environment variables documented

## Release Notes Template

\`\`\`markdown
# Version 1.1.0

## New Features
- feat: add Slack notifications for new contacts
- feat: implement email verification for newsletter

## Bug Fixes
- fix: resolve email sending timeout issue
- fix: improve contact form validation

## Documentation
- docs: add API documentation
- docs: add deployment guide

## Performance
- perf: optimize database queries

## Technical
- refactor: improve error handling
- test: add comprehensive test suite
