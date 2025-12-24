# Landing Page Backend

A production-ready Node.js backend for handling contact forms, newsletter subscriptions, and Slack integrations.

## Features

- ✅ Contact form management with email notifications
- ✅ Newsletter subscription system
- ✅ Slack integration (webhooks and bot)
- ✅ MongoDB database with proper indexing
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ Comprehensive unit tests
- ✅ Error handling and logging
- ✅ Multiple email providers (Gmail, SendGrid, SMTP)

## Project Structure

\`\`\`
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── models/
│   │   ├── Contact.js            # Contact schema
│   │   └── Newsletter.js         # Newsletter schema
│   ├── services/
│   │   ├── emailService.js       # Email handling
│   │   └── slackService.js       # Slack integration
│   ├── routes/
│   │   ├── contacts.js           # Contact endpoints
│   │   ├── newsletter.js         # Newsletter endpoints
│   │   ├── slack.js              # Slack endpoints
│   │   └── health.js             # Health check
│   ├── middleware/
│   │   ├── validation.js         # Input validation
│   │   └── errorHandler.js       # Error handling
│   └── utils/
│       └── logger.js             # Logging utility
├── test/
│   ├── contacts.test.js          # Contact API tests
│   ├── newsletter.test.js        # Newsletter tests
│   └── slack.test.js             # Slack service tests
├── server.js                     # Entry point
├── package.json
└── .env.example
\`\`\`

## Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Setup

1. Clone and install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Edit `.env` with your settings

4. Start the server:
\`\`\`bash
npm run dev    # Development with auto-reload
npm start      # Production
\`\`\`

## Environment Variables

See `.env.example` for all available options.

### Required Variables
- `MONGODB_URI` - MongoDB connection string
- `SLACK_WEBHOOK_URL` - Slack webhook URL for notifications
- `EMAIL_PROVIDER` - Email service (gmail, sendgrid, smtp)
- `EMAIL_FROM` - Sender email address

### Optional Variables
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)

## API Endpoints

### Contact Management

**POST /api/contact** - Submit contact form
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "This is a detailed message with at least 10 characters"
}
\`\`\`

**GET /api/contact** - List all contacts (with pagination)
\`\`\`bash
GET /api/contact?status=new&page=1&limit=10
\`\`\`

**GET /api/contact/:id** - Get single contact

**PATCH /api/contact/:id/status** - Update contact status
\`\`\`json
{
  "status": "in-progress"
}
\`\`\`

**DELETE /api/contact/:id** - Delete contact

### Newsletter

**POST /api/newsletter** - Subscribe to newsletter
\`\`\`json
{
  "email": "user@example.com",
  "name": "John"
}
\`\`\`

**GET /api/newsletter** - List subscribers
\`\`\`bash
GET /api/newsletter?subscribed=true&page=1&limit=10
\`\`\`

**DELETE /api/newsletter/:email** - Unsubscribe

### Health Check

**GET /api/health** - Server health status

## Testing

Run comprehensive unit tests:
\`\`\`bash
npm test                # Run once with coverage
npm run test:watch     # Watch mode
\`\`\`

Tests cover:
- Contact form submission and validation
- Newsletter subscription management
- Slack message formatting
- API error handling
- Database operations

## Git Workflow

### Branch Naming Conventions

Follow these patterns for proper tracking:

- **Feature**: `feat/feature-name`
- **Bug fix**: `fix/bug-description`
- **Documentation**: `docs/description`
- **Refactoring**: `refactor/component-name`
- **Performance**: `perf/optimization-name`
- **Tests**: `test/test-description`

### Commit Message Format

Use descriptive commit messages:

\`\`\`
feat: add contact form email notifications
fix: resolve Slack webhook authentication error
docs: update API documentation
refactor: improve error handling in email service
test: add comprehensive contact API tests
\`\`\`

### Example Workflow

\`\`\`bash
# Create feature branch
git checkout -b feat/add-slack-notifications

# Make changes and commit
git commit -m "feat: add Slack notifications for new contacts"

# Push to remote
git push origin feat/add-slack-notifications

# Create pull request
\`\`\`

## Slack Integration Setup

### 1. Create Incoming Webhook

1. Go to your Slack workspace
2. Create an app at api.slack.com
3. Enable Incoming Webhooks
4. Create webhook URL
5. Copy webhook URL to `.env` as `SLACK_WEBHOOK_URL`

### 2. Setup Bot (Optional)

1. Create app at api.slack.com
2. Enable Bots feature
3. Generate bot token
4. Add to `.env`:
   - `SLACK_BOT_TOKEN`
   - `SLACK_SIGNING_SECRET`

## Email Configuration

### Gmail Setup (Easiest)

1. Enable 2-factor authentication on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
\`\`\`
EMAIL_PROVIDER=gmail
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
\`\`\`

### SendGrid Setup

1. Create SendGrid account
2. Generate API key
3. Add to `.env`:
\`\`\`
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-api-key
\`\`\`

### Custom SMTP

1. Add to `.env`:
\`\`\`
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email
SMTP_PASS=your-password
\`\`\`

## Security Considerations

✅ Input validation and sanitization
✅ Rate limiting on endpoints
✅ Helmet security headers
✅ CORS restrictions
✅ Error message sanitization
✅ HTTPS in production
✅ Environment variable isolation
✅ Database indexing for performance

## Deployment

### Deploy to Heroku

\`\`\`bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set SLACK_WEBHOOK_URL=your_slack_url

# Deploy
git push heroku main
\`\`\`

### Deploy to AWS EC2

\`\`\`bash
# SSH into instance
ssh -i key.pem ec2-user@your-instance

# Clone repo
git clone your-repo-url
cd landing-page-backend

# Install and setup
npm install
cp .env.example .env
# Edit .env with production values

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name "landing-backend"
pm2 startup
pm2 save
\`\`\`

## Monitoring

Logs are saved to the `logs/` directory:
- `info.log` - General information
- `error.log` - Error details
- `warn.log` - Warnings

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check if MongoDB service is running
- For Atlas: whitelist your IP address

### Email Not Sending
- Verify email configuration in `.env`
- Check credentials are correct
- Gmail: Use app password, not regular password
- Check spam folder

### Slack Notifications Not Working
- Verify `SLACK_WEBHOOK_URL` is correct
- Test webhook with curl
- Check Slack app permissions

### Rate Limit Issues
- Default limit: 100 requests per 15 minutes
- Contact form: 5 per hour per IP
- Adjust in `server.js` if needed

## Support

For issues and questions:
- Check error logs in `logs/` directory
- Review test files for usage examples
- Check README and inline code comments

## License

MIT
