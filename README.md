# DevDox.AI API

A clean, modular, and well-tested Express.js API for the DevDox.AI platform with integrated authentication, database access, and comprehensive security features.

## Features

- Robust Express.js API with clean architecture
- Secure authentication using Clerk
- Database integration with Supabase
- Comprehensive error handling
- Test-driven development with Jest
- Input validation and sanitization
- Security best practices (rate limiting, secure headers, etc.)
- SonarQube-compliant code structure

## Project Structure

```
devdox-ai-api/
├── src/
│   ├── config/               # Configuration management
│   ├── middleware/           # Custom middleware (auth, error handlers)
│   ├── routes/               # API route definitions
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   ├── models/               # Data models
│   ├── utils/                # Helper functions
│   └── app.js                # Express app setup
│
├── tests/
│   ├── unit/                 # Unit tests
│   ├── integration/          # API integration tests
│   └── fixtures/             # Test fixtures
│
├── .env.example              # Environment variables template
├── .eslintrc.js              # Linting rules
├── jest.config.js            # Jest test configuration 
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account and project
- Clerk account

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/devdox-ai-api.git
cd devdox-ai-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. Start the development server
```bash
npm run dev
```

### Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## API Endpoints

### Base URL
`/api`

### Version
- `GET /api/version` - Get current API version
- `GET /api/version/details` - Get detailed version information (authenticated)

## Security

This API implements several security best practices:

- Input validation and sanitization
- Parameterized queries for all database operations
- Rate limiting to prevent abuse
- Secure HTTP headers with Helmet
- JWT verification with appropriate algorithms
- Proper error handling that doesn't leak sensitive information

## Testing

Tests are written using Jest. The project includes both unit and integration tests.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## Linting

ESLint is configured with Airbnb's style guide.

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

## License

[MIT](LICENSE)