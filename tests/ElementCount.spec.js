const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

   const radioCount=await page.locator("input[type='radio']").count();

   console.log(radioCount);
   
});