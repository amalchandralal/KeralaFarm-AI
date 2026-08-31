### AgroVision AI — QA Automation Suite
End-to-end test suite for AgroVision AI using Playwright.

### What's Tested
- Authentication (Login, Signup, Validation)
- Crop Diagnostics (Valid/Invalid Image Uploads)
- Market Pricing (Tracker data loading)
- GIS Finder (Search functionality and rendering)
- Voice Assistant (UI widget rendering)
- Dashboard features
- API Validation (Crop Disease endpoint)
- Database Validation (User Signup Persistence)

### Tool Choice
Chose Playwright for built-in API testing, auto-wait selectors, and native multi-browser support (Chromium, Firefox, Mobile) without additional plugins.

### Project Structure
```
e2e/
├── tests/
│   ├── ui/
│   ├── api/
│   └── db/
├── README.md
├── TEST_CASES.md
└── BUG_REPORTS.md
```

### Prerequisites
- Node.js 20+
- Access to AgroVision backend API
- MongoDB connection string (for DB validation tests)

### Setup & Run
```bash
cd e2e
npm ci
npx playwright install --with-deps

# Run all tests
npx playwright test

# Run UI tests only
npx playwright test --grep @ui

# Run API/DB tests only  
npx playwright test --grep @api

# Run in headed mode (see browser)
npx playwright test --headed

# View HTML report
npx playwright show-report
```

### Environment Variables

| Variable | Description | Default Value |
|---|---|---|
| `BASE_URL` | Frontend URL | `http://localhost:5173` |
| `API_URL` | Backend API URL | `http://localhost:3000/api` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/agrovision` |
| `TEST_USER_EMAIL` | Email for test user | `test@example.com` |
| `TEST_USER_PASSWORD` | Password for test user | `TestPass123!` |

### CI/CD Pipeline
The suite runs automatically via GitHub Actions on push/PR to main. Reports are uploaded as artifacts. Link to `.github/workflows/playwright.yml`.

### Test Cases
Link to [TEST_CASES.md](./TEST_CASES.md).

### Bugs Found
Link to [BUG_REPORTS.md](./BUG_REPORTS.md). 3 genuine bugs discovered during manual testing of the live application.

### Security
All credentials are stored in `.env` locally and GitHub Secrets for CI. No secrets are hardcoded in test files. See `.env.example` for the required variables.

### Cross-Browser Coverage

| Browser | Device Type | Viewport / Settings |
|---|---|---|
| Chromium | Desktop | 1280x720 |
| Firefox | Desktop | 1280x720 |
| Mobile Chrome | Mobile | Pixel 5 emulation |
