const fs = require('fs');
const path = require('path');

function ensureDirSync(dirpath) {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
}

ensureDirSync('__tests__/unit');
ensureDirSync('__tests__/components');
ensureDirSync('e2e');
ensureDirSync('.github/workflows');

// 1. Jest Configuration
const jestConfig = `const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['<rootDir>/e2e/']
}
module.exports = createJestConfig(customJestConfig)
`;
fs.writeFileSync('jest.config.js', jestConfig);

// 2. Jest Setup
fs.writeFileSync('jest.setup.js', `import '@testing-library/jest-dom';\n`);

// 3. Playwright Configuration
const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
});
`;
fs.writeFileSync('playwright.config.ts', playwrightConfig);

// 4. Unit Test
const gamificationTest = `import { calculateLevel, getXpForNextLevel, getLevelName } from '@/lib/gamification';
describe('Gamification Logic', () => {
  it('calculates the correct level based on XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
  });
});
`;
fs.writeFileSync('__tests__/unit/gamification.test.ts', gamificationTest);

// 5. Component Test
const forumCardTest = `import { render, screen } from '@testing-library/react';
import ForumCard from '@/components/forum/ForumCard';
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
describe('ForumCard', () => {
  it('renders forum details correctly', () => {
    const mockForum = { id: '1', title: 'Test Title', description: 'Desc', createdAt: new Date().toISOString(), tags: ['Tech'], user: { id: 'u1', name: 'Test User' } };
    render(<ForumCard forum={mockForum as any} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
`;
fs.writeFileSync('__tests__/components/ForumCard.test.tsx', forumCardTest);

// 6. E2E Test
const homeE2eTest = `import { test, expect } from '@playwright/test';
test('Homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text="letstalk"').first()).toBeVisible();
});
`;
fs.writeFileSync('e2e/home.spec.ts', homeE2eTest);

// 7. GitHub Action
const ciConfig = `name: CI\non:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Setup Node.js\n        uses: actions/setup-node@v3\n        with:\n          node-version: '18'\n      - name: Install Dependencies\n        run: npm ci\n      - name: Run Unit Tests\n        run: npm run test\n      - name: Install Playwright Browsers\n        run: npx playwright install --with-deps\n      - name: Run E2E Tests\n        run: npx playwright test\n`;
fs.writeFileSync('.github/workflows/test.yml', ciConfig);

// 8. Update package.json
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts['test'] = 'jest';
pkg.scripts['test:e2e'] = 'playwright test';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
