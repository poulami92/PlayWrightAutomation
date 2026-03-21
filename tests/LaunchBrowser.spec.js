const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{
   await page.goto("https://www.google.com/");
});

test('Browser Palywright test', async function({browser})
{
   const context=await browser.newContext();
   const page =await context.newPage();
   await page.goto("https://www.google.com/");
});