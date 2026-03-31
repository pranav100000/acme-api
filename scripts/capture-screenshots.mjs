import { createRequire } from "module";
const require = createRequire("/opt/node_modules/");
const { chromium } = require("playwright");
import { mkdirSync } from "fs";

const outputDir = process.argv[2] || "demos/before";
mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

// 1. Login page
await page.goto("http://localhost:5173");
await page.waitForSelector('input[type="email"]');
await page.waitForTimeout(500);
await page.screenshot({ path: `${outputDir}/01-login.png`, fullPage: true });
console.log("Captured: login page");

// 2. Log in as alice
await page.fill('input[type="email"]', "alice@acme.com");
await page.click('button[type="submit"]');
await page.waitForSelector("nav");
await page.waitForTimeout(1500);

// 3. Dashboard
await page.screenshot({ path: `${outputDir}/02-dashboard.png`, fullPage: true });
console.log("Captured: dashboard");

// 4. Users page
await page.click('a[href="/users"]');
await page.waitForSelector("table");
await page.waitForTimeout(500);
await page.screenshot({ path: `${outputDir}/03-users.png`, fullPage: true });
console.log("Captured: users page");

// 5. Create User modal
await page.click("text=+ Add User");
await page.waitForSelector('[role="dialog"]');
await page.waitForTimeout(300);
await page.screenshot({ path: `${outputDir}/04-create-user-modal.png`, fullPage: true });
console.log("Captured: create user modal");

// Close modal by pressing Escape
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

// 6. Teams page
await page.click('a[href="/teams"]');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outputDir}/05-teams.png`, fullPage: true });
console.log("Captured: teams page");

await browser.close();
console.log(`\nAll screenshots saved to ${outputDir}/`);
