const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   const username= page.locator('#username');

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   await username.fill('rahul');

   console.log(await username.inputValue());
   
});