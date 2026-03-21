const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   const username= page.locator('#username');
   const password= page.locator('#password');

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   await username.fill('rahulshettyacademy');
   await password.fill('Learning@830$3mK2');

   const dropdown = page.locator('select.form-control');
   await dropdown.selectOption('Consultant');
   await page.pause();

   
   
});