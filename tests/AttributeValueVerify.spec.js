const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   const document = page.locator("a[href*='document']");
   await expect(document).toHaveAttribute("class","blinkingText");
   
});