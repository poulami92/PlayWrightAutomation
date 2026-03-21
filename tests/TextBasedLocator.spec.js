const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

   //const appiumText=await page.locator("text=Mobile Automation").textContent();
   const appiumText=await page.locator("table[name='courses'] td:has-text('Mobile Automation')").textContent();
 
   console.log(appiumText);
   
});