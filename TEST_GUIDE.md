# Unit Testing Guide

Complete guide for writing and running tests for the backend.

## Quick Start

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- test/services/contactService.test.js
\`\`\`

## Test Structure

\`\`\`
project/
├── test/
│   ├── setup.js                    # Test configuration
│   ├── services/
│   │   ├── contactService.test.js
│   │   ├── emailService.test.js
│   │   ├── slackService.test.js
│   │   └── validationService.test.js
│   ├── routes/
│   │   ├── contacts.test.js
│   │   ├── newsletter.test.js
│   │   └── slack.test.js
│   └── utils/
│       └── helpers.test.js
└── jest.config.js
\`\`\`

## Writing Tests

### Test Template

\`\`\`javascript
// test/services/contactService.test.js
const contactService = require('../../src/services/contactService');

describe('Contact Service', () => {
  describe('createContact', () => {
    test('should create a contact with valid data', () => {
      const contact = contactService.createContact({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      });

      expect(contact).toBeDefined();
      expect(contact.name).toBe('John Doe');
      expect(contact.email).toBe('john@example.com');
    });

    test('should reject invalid email', () => {
      expect(() => {
        contactService.createContact({
          name: 'John',
          email: 'invalid-email',
          message: 'Test'
        });
      }).toThrow('Invalid email format');
    });

    test('should reject missing required fields', () => {
      expect(() => {
        contactService.createContact({
          name: 'John'
          // missing email and message
        });
      }).toThrow('Missing required fields');
    });
  });

  describe('validateContact', () => {
    test('should validate correct contact data', () => {
      const result = contactService.validateContact({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test'
      });
      expect(result.valid).toBe(true);
    });

    test('should detect invalid email', () => {
      const result = contactService.validateContact({
        name: 'John',
        email: 'bad-email',
        message: 'Test'
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid email');
    });
  });
});
\`\`\`

### Testing Services

\`\`\`javascript
// test/services/slackService.test.js
const slackService = require('../../src/services/slackService');
const axios = require('axios');

jest.mock('axios');  // Mock HTTP calls

describe('Slack Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendNotification', () => {
    test('should send notification to Slack webhook', async () => {
      axios.post.mockResolvedValue({ status: 200 });

      const result = await slackService.sendNotification({
        text: 'New contact submission',
        contact: { name: 'John', email: 'john@example.com' }
      });

      expect(axios.post).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    test('should retry on failure', async () => {
      axios.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ status: 200 });

      const result = await slackService.sendNotification({
        text: 'Test message'
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(true);
    });

    test('should throw error after max retries', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));

      await expect(
        slackService.sendNotification({ text: 'Test' })
      ).rejects.toThrow('Max retries exceeded');
    });
  });
});
\`\`\`

### Testing API Routes

\`\`\`javascript
// test/routes/contacts.test.js
const request = require('supertest');
const app = require('../../server');

describe('Contact API Routes', () => {
  describe('POST /api/contact', () => {
    test('should create contact with valid data', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
    });

    test('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John',
          email: 'invalid-email',
          message: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: 'Invalid email format'
        })
      );
    });

    test('should return 500 on server error', async () => {
      jest.spyOn(console, 'error').mockImplementation();

      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John',
          email: 'john@example.com',
          message: 'Test'
        });

      // Mock database error
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('GET /api/contacts', () => {
    test('should retrieve all contacts', async () => {
      const response = await request(app)
        .get('/api/contacts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/contacts')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });
  });
});
\`\`\`

## Running Tests

### All Tests
\`\`\`bash
npm test
\`\`\`

Output:
\`\`\`
PASS  test/services/contactService.test.js
  Contact Service
    createContact
      ✓ should create a contact with valid data (5ms)
      ✓ should reject invalid email (3ms)
      ✓ should reject missing required fields (2ms)
    validateContact
      ✓ should validate correct contact data (1ms)
      ✓ should detect invalid email (2ms)

PASS  test/services/slackService.test.js
  ...

Test Suites: 5 passed, 5 total
Tests:       45 passed, 45 total
Coverage:    87% Statements, 82% Branches, 85% Functions, 86% Lines
\`\`\`

### With Coverage Report
\`\`\`bash
npm run test:coverage
\`\`\`

Generates HTML report in `coverage/lcov-report/index.html`

### Watch Mode
\`\`\`bash
npm run test:watch
\`\`\`

Re-runs tests on file changes.

### Single Test File
\`\`\`bash
npm test -- test/services/contactService.test.js
\`\`\`

### With Verbose Output
\`\`\`bash
npm test -- --verbose
\`\`\`

## Test Categories

### Unit Tests
Test individual functions in isolation:

\`\`\`javascript
test('should validate email format', () => {
  const validator = require('../../src/utils/validation');
  const result = validator.isValidEmail('test@example.com');
  expect(result).toBe(true);
});
\`\`\`

### Integration Tests
Test multiple components working together:

\`\`\`javascript
test('should create contact and send notification', async () => {
  const contact = await contactService.create({...});
  const slackResult = await slackService.notify(contact);
  expect(slackResult.success).toBe(true);
});
\`\`\`

### API Tests
Test HTTP endpoints:

\`\`\`javascript
test('should handle contact submission end-to-end', async () => {
  const response = await request(app)
    .post('/api/contact')
    .send({...});
  expect(response.status).toBe(201);
});
\`\`\`

## Mocking

### Mock External Services
\`\`\`javascript
jest.mock('axios');

test('should handle API error', async () => {
  axios.post.mockRejectedValue(new Error('API Error'));
  await expect(service.call()).rejects.toThrow('API Error');
});
\`\`\`

### Mock Database
\`\`\`javascript
const mockDb = {
  contacts: {
    find: jest.fn().mockResolvedValue([{id: 1, name: 'John'}]),
    create: jest.fn().mockResolvedValue({id: 1})
  }
};
\`\`\`

## Best Practices

1. **Test Behavior, Not Implementation**
   - Good: `expect(result.email).toBe('john@example.com')`
   - Bad: `expect(result.emailField).toBeDefined()`

2. **Use Descriptive Names**
   - Good: `should reject email with consecutive dots`
   - Bad: `should reject email`

3. **One Assertion Per Test (Usually)**
   - Each test should verify one thing
   - Exception: related assertions in same test

4. **Setup and Teardown**
   \`\`\`javascript
   beforeEach(() => {
     // Setup before each test
   });

   afterEach(() => {
     // Cleanup after each test
   });
   \`\`\`

5. **Test Edge Cases**
   - Empty strings, null, undefined
   - Very long inputs
   - Special characters
   - Boundary values

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Check coverage:
\`\`\`bash
npm run test:coverage
\`\`\`

---

## Commit Testing Changes

When adding tests, use proper commit message:

\`\`\`bash
git add test/services/contactService.test.js
git commit -m "test: add contact validation unit tests

- Add tests for valid contact creation
- Add tests for invalid email rejection
- Add tests for missing field validation
- Achieve 92% coverage for contact service"
\`\`\`

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)
