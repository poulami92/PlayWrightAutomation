const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   const username= page.locator('#username');
   const password= page.locator('#password');
   const signInBtn= page.locator('#signInBtn');
   const errorText= page.locator("[style*='block']");

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   await username.fill('rahul');
   await password.fill('Learning@830$3mK2');
   await signInBtn.click();

   console.log(await errorText.textContent());
   await expect(errorText).toContainText('Incorrect');

   //await expect(errorText).toHaveText('Incorrect');
});