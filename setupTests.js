const fs = require('fs');
const path = require('path');

function ensureDirSync(dirpath) {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
}

// 1. Jest Configuration
const jestConfig = `const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
}

module.exports = createJestConfig(customJestConfig)
`;
fs.writeFileSync('jest.config.js', jestConfig);

// 2. Jest Setup
const jestSetup = `import '@testing-library/jest-dom';
`;
fs.writeFileSync('jest.setup.js', jestSetup);

// 3. Playwright Configuration
const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
`;
fs.writeFileSync('playwright.config.ts', playwrightConfig);

// 4. Create __tests__ directories
ensureDirSync('__tests__/unit');
ensureDirSync('__tests__/components');
ensureDirSync('e2e');
ensureDirSync('.github/workflows');

// 5. Unit Test for Gamification
const gamificationTest = `import { calculateLevel, getXpForNextLevel, getLevelName } from '@/lib/gamification';

describe('Gamification Logic', () => {
  it('calculates the correct level based on XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(250)).toBe(3);
    expect(calculateLevel(500)).toBe(4);
    expect(calculateLevel(1000)).toBe(5);
  });

  it('returns the correct XP needed for next level', () => {
    expect(getXpForNextLevel(0)).toBe(100);
    expect(getXpForNextLevel(150)).toBe(300); // Because level 2 -> 3 is 300
    expect(getXpForNextLevel(5000)).toBeNull(); // Assuming max level
  });

  it('returns correct level names', () => {
    expect(getLevelName(1)).toBe('Newcomer');
    expect(getLevelName(5)).toBe('Master');
    expect(getLevelName(10)).toBe('Legend');
  });
});
`;
fs.writeFileSync('__tests__/unit/gamification.test.ts', gamificationTest);

// 6. Component Test for ForumCard
const forumCardTest = `import { render, screen } from '@testing-library/react';
import ForumCard from '@/components/forum/ForumCard';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('ForumCard', () => {
  const mockForum = {
    id: '1',
    title: 'Test Forum Title',
    description: 'This is a test description.',
    createdAt: new Date().toISOString(),
    isPrivate: false,
    tags: ['Tech', 'Coding'],
    user: { id: 'u1', name: 'Test User' },
    _count: { likes: 5, comments: 2 },
  };

  it('renders forum details correctly', () => {
    render(<ForumCard forum={mockForum} />);
    expect(screen.getByText('Test Forum Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test description.')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('#Tech')).toBeInTheDocument();
    expect(screen.getByText('#Coding')).toBeInTheDocument();
  });
});
`;
fs.writeFileSync('__tests__/components/ForumCard.test.tsx', forumCardTest);

// 7. E2E Test for Home and Navigation
const homeE2eTest = `import { test, expect } from '@playwright/test';

test('Homepage loads and displays branding', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text="letstalk"').first()).toBeVisible();
});

test('Navigation to explore works', async ({ page }) => {
  await page.goto('/');
  await page.click('text="Explore"');
  await expect(page).toHaveURL(/.*explore/);
});
`;
fs.writeFileSync('e2e/home.spec.ts', homeE2eTest);

// 8. GitHub Actions CI Config
const ciConfig = \`name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm ci
        
      - name: Run Unit Tests
        run: npm run test
        
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
        
      - name: Run E2E Tests
        run: npx playwright test
\`;
fs.writeFileSync('.github/workflows/test.yml', ciConfig);

// 9. Update package.json to include test scripts
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts['test'] = 'jest';
pkg.scripts['test:watch'] = 'jest --watch';
pkg.scripts['test:e2e'] = 'playwright test';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log('Testing infrastructure created successfully.');
