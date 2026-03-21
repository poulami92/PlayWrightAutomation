const {test,expect} = require('@playwright/test')

test('Browser Context Palywright test', async function({page})
{
  
   const userEmail= page.locator('#userEmail');
   const userPassword= page.locator('#userPassword');
   const login= page.locator('#login');

   await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
   console.log(await page.title());

   await userEmail.fill('Gpd@gmail.com');
   await userPassword.fill('Kolkata@1');
   await login.click();

   await page.locator('.card-body b').first().waitFor();

   const pdtTitles=await page.locator('.card-body b').allTextContents();
   console.log(pdtTitles);


});

