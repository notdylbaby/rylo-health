import { chromium } from '/Users/dylantran/Library/Caches/ms-playwright-go/1.50.1/package/index.mjs';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const dir = './temporary screenshots';

if (!existsSync(dir)) mkdirSync(dir);

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
const filename = path.join(dir, `screenshot-${next}${label}.png`);

process.env.PLAYWRIGHT_BROWSERS_PATH = '/Users/dylantran/Library/Caches/ms-playwright-go/1.50.1';

const browser = await chromium.launch({
  executablePath: '/Users/dylantran/Library/Caches/ms-playwright-go/1.50.1/chromium_headless_shell-1155/chrome-mac/headless_shell'
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: filename, fullPage: false });
await browser.close();

console.log(`Saved: ${filename}`);
