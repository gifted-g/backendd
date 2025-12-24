# Pull Request Workflow Guide

This guide walks you through creating pull requests with proper testing, commit conventions, and Slack notifications.

## Overview

Our PR workflow ensures code quality through:
1. Proper branch naming and git conventions
2. Comprehensive unit tests before submission
3. Descriptive commit messages for tracking
4. Slack notifications to the team
5. Code review process before merge

---

## Complete PR Workflow

### Phase 1: Preparation

#### 1.1 Create Your Feature Branch

\`\`\`bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch with proper naming
git checkout -b feat/your-feature-name
\`\`\`

**Branch Naming Patterns:**
- `feat/<feature-name>` - New features
- `fix/<bug-name>` - Bug fixes
- `docs/<description>` - Documentation
- `refactor/<component>` - Code refactoring
- `perf/<optimization>` - Performance improvements
- `test/<test-description>` - Tests

#### 1.2 Make Your Changes

\`\`\`bash
# Edit files
nano src/services/contactService.js

# Stage changes
git add src/services/contactService.js
git add src/routes/contacts.js

# Verify staged changes
git status
\`\`\`

---

### Phase 2: Testing & Validation

#### 2.1 Write Unit Tests

**Before committing**, write tests for your changes:

\`\`\`javascript
// test/services/contactService.test.js
const contactService = require('../../src/services/contactService');

describe('Contact Service - New Feature', () => {
  test('should create contact with validation', () => {
    const contact = contactService.create({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    });
    expect(contact).toBeDefined();
    expect(contact.email).toBe('john@example.com');
  });

  test('should reject invalid email', () => {
    expect(() => {
      contactService.create({
        name: 'John',
        email: 'invalid-email',
        message: 'Test'
      });
    }).toThrow('Invalid email format');
  });
});
\`\`\`

#### 2.2 Run All Tests

\`\`\`bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- test/services/contactService.test.js

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch
\`\`\`

**Expected Output:**
\`\`\`
 PASS  test/services/contactService.test.js
  Contact Service - New Feature
    ✓ should create contact with validation (5ms)
    ✓ should reject invalid email (3ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Coverage:    85% Statements, 80% Branches
\`\`\`

#### 2.3 Check Code Quality

\`\`\`bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Verify no console.log statements
grep -r "console.log" src/ || echo "✓ No console.log found"
\`\`\`

---

### Phase 3: Committing Changes

#### 3.1 Write Descriptive Commits

Follow the commit message format:

\`\`\`
<type>: <subject>

<body>

<footer>
\`\`\`

**Example 1: Feature Commit**
\`\`\`bash
git add src/services/slackService.js
git commit -m "feat: add Slack notification service

- Implement webhook integration for contact submissions
- Add retry logic with exponential backoff
- Validate SLACK_WEBHOOK_URL before sending
- Add error logging for debugging

Relates to: #45"
\`\`\`

**Example 2: Test Commit**
\`\`\`bash
git add test/services/slackService.test.js
git commit -m "test: add Slack service unit tests

- Add tests for successful webhook posting
- Add tests for error handling and retries
- Add tests for invalid webhook URL validation
- Achieve 90% code coverage for Slack service"
\`\`\`

**Example 3: Bug Fix Commit**
\`\`\`bash
git add src/routes/contacts.js
git commit -m "fix: resolve contact validation error

- Check for required fields before processing
- Add proper error response format
- Add logging for debugging
- Add tests for validation scenarios

Fixes: #78"
\`\`\`

#### 3.2 Review Your Changes Before Commit

\`\`\`bash
# See what changed
git diff

# See staged changes
git diff --staged

# Review individual file changes
git diff src/services/slackService.js
\`\`\`

---

### Phase 4: Push & Create PR

#### 4.1 Push Your Branch

\`\`\`bash
# Push your branch
git push origin feat/your-feature-name

# If branch exists and needs update
git push origin feat/your-feature-name --force-with-lease
\`\`\`

#### 4.2 Create Pull Request on GitHub/GitLab

**PR Title Format:**
\`\`\`
feat: add Slack notification service
\`\`\`

**PR Description Template:**

\`\`\`markdown
## Description
Brief description of what this PR does.

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- Unit tests added/updated: 15 tests added
- Test coverage: 90%
- Manual testing done: Tested with production webhook URL

## Related Issues
Closes #45
Relates to #12

## Screenshots (if applicable)
[Add screenshots of new UI/features]

## Slack Integration
This PR integrates with Slack:
- [ ] Slack webhook configured in environment
- [ ] Test notification sent successfully
- [ ] Error handling tested for webhook failures

## Checklist
- [x] Tests pass locally (`npm test`)
- [x] Code follows linting rules (`npm run lint`)
- [x] Commits follow conventions
- [x] Documentation updated
- [x] No console.log() left in code
- [x] Environment variables documented
\`\`\`

**Example PR Description:**

\`\`\`markdown
## Description
Implements Slack notifications for new contact form submissions. 
When a contact fills the form, the admin team is notified in Slack immediately.

## Changes Made
- Created `src/services/slackService.js` with webhook integration
- Updated `src/routes/contacts.js` to trigger Slack notifications
- Added retry logic with exponential backoff for failed requests
- Added comprehensive error handling and logging

## Testing
- 8 new unit tests added
- All existing tests pass
- Manual testing completed with actual Slack workspace
- Tested error scenarios: invalid webhook, network timeout

## Related Issues
Closes #45 - "Send Slack notification on contact submission"

## Slack Integration
- Webhook URL: `https://hooks.slack.com/services/...`
- Message format: Contact name, email, and message
- Error handling: Logs failures, doesn't block contact submission
- Retry: 3 attempts with exponential backoff

## Checklist
- [x] npm test (8 new tests, all passing)
- [x] npm run lint (0 issues)
- [x] Documentation in README
- [x] Environment variables in .env.example
- [x] No debug console.log statements
- [x] Slack webhook tested with team channel
\`\`\`

---

### Phase 5: Code Review & Approval

#### 5.1 Respond to Review Comments

\`\`\`bash
# Make requested changes
nano src/services/slackService.js

# Test changes again
npm test

# Commit fix
git add src/services/slackService.js
git commit -m "refactor: improve Slack error handling based on review feedback"

# Push update
git push origin feat/your-feature-name
\`\`\`

#### 5.2 Request Re-review

After making changes, reply to the reviewer:
\`\`\`
Ready for re-review. Made the following changes:
- Improved error messages as suggested
- Added additional test case for timeout scenario
- Updated documentation
\`\`\`

---

### Phase 6: Merge to Develop

#### 6.1 Merge via GitHub/GitLab Interface

Preferred method:
1. Click "Merge pull request" button
2. Choose "Squash and merge" (keeps history clean)
3. Confirm merge

#### 6.2 Merge via Command Line

\`\`\`bash
# Update develop
git checkout develop
git pull origin develop

# Merge feature branch
git merge feat/your-feature-name

# Push to develop
git push origin develop

# Delete feature branch
git branch -d feat/your-feature-name
git push origin --delete feat/your-feature-name
\`\`\`

---

### Phase 7: Slack Notification

#### 7.1 Notify Team on Slack

Post to #dev-updates channel:

\`\`\`
:checkmark: PR Merged: feat/add-slack-notification-service

Changes:
- Implemented Slack webhook integration
- Added 8 unit tests (all passing)
- Handles errors gracefully

Reviewer: @john-reviewer
Merged to: develop

Ready for testing in staging!
\`\`\`

---

## Quick Reference Checklist

### Before Creating PR
- [ ] Branch name follows convention (feat/fix/docs/etc)
- [ ] All new code has unit tests
- [ ] `npm test` passes (all tests green)
- [ ] `npm run lint` passes (0 issues)
- [ ] No `console.log()` statements left
- [ ] Commits have descriptive messages
- [ ] Code is pushed to remote

### PR Submission
- [ ] PR title follows format: `feat: description`
- [ ] Description includes what changed and why
- [ ] Related issues are linked
- [ ] Slack integration steps documented
- [ ] Testing approach documented
- [ ] Screenshots added (if applicable)

### After Review Approval
- [ ] Address all reviewer comments
- [ ] Re-run tests and lint
- [ ] Request re-review if needed
- [ ] Merge to develop
- [ ] Delete feature branch
- [ ] Notify team on Slack

---

## Common Scenarios

### Scenario 1: Feature with Slack Integration

\`\`\`bash
# Create branch
git checkout -b feat/slack-notifications

# Create service
nano src/services/slackService.js

# Write tests
nano test/services/slackService.test.js

# Test
npm test

# Commit
git add src/services/slackService.js test/services/slackService.test.js
git commit -m "feat: implement Slack notification service

- Add webhook integration with retry logic
- Include error handling and logging
- Add 8 comprehensive unit tests"

# Push
git push origin feat/slack-notifications

# Create PR on GitHub
# Set title: feat: implement Slack notification service
# Include Slack webhook URL and testing details

# After approval
git checkout develop
git pull origin develop
git merge feat/slack-notifications
git push origin develop
\`\`\`

### Scenario 2: Bug Fix with Tests

\`\`\`bash
# Create branch
git checkout -b fix/email-validation-bug

# Fix the bug
nano src/services/emailService.js

# Add tests for the fix
nano test/services/emailService.test.js

# Run tests
npm test

# Commit
git add src/services/emailService.js test/services/emailService.test.js
git commit -m "fix: resolve email validation bug

- Check for special characters in email domain
- Add validation for international domains
- Add 4 test cases for edge cases

Fixes: #89"

# Push and create PR
git push origin fix/email-validation-bug
\`\`\`

### Scenario 3: Documentation Update

\`\`\`bash
# Create branch
git checkout -b docs/api-documentation

# Update docs
nano README.md
nano API_DOCS.md

# Commit
git add README.md API_DOCS.md
git commit -m "docs: update API documentation

- Add example requests for contact endpoints
- Add error response documentation
- Add Slack integration setup guide"

# Push and create PR
git push origin docs/api-documentation
\`\`\`

---

## Troubleshooting

### Issue: "Your branch is behind origin/develop"

\`\`\`bash
# Update branch with latest develop
git fetch origin
git rebase origin/develop

# Force push (safe)
git push origin feat/your-feature --force-with-lease
\`\`\`

### Issue: "Tests fail locally but pass in CI"

\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Run tests again
npm test

# Check Node.js version matches CI
node --version  # Should be 18+
\`\`\`

### Issue: "Merge conflict"

\`\`\`bash
# Rebase on develop to handle conflicts
git fetch origin
git rebase origin/develop

# Fix conflicts in editor (marked with <<<<<<<)
nano src/services/contactService.js

# After fixing
git add src/services/contactService.js
git rebase --continue

# Push with force
git push origin feat/your-feature --force-with-lease
\`\`\`

### Issue: "Need to add more commits to this PR"

\`\`\`bash
# Make changes
nano src/routes/contacts.js

# Test
npm test

# Commit
git commit -m "feat: add contact pagination

- Implement limit and offset parameters
- Add tests for pagination

Relates to: #45"

# Push to same branch (auto-updates PR)
git push origin feat/your-feature-name
\`\`\`

---

## Resources

- [Commit Message Guidelines](./GIT_CONVENTIONS.md)
- [Testing Guide](./TEST_GUIDE.md)
- [Slack Integration Docs](./SLACK_INTEGRATION.md)
- [API Documentation](./API_DOCS.md)

---

## Questions?

Ask in #dev-help Slack channel or email dev@agentoja.com
