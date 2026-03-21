const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

   await page.locator('#mousehover').hover();
   await page.locator('text=Reload').click();
   
})