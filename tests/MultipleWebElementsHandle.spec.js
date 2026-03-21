const {test,expect} = require('@playwright/test')

test('Browser Context Palywright test', async function({browser})
{
   const context=await browser.newContext();
   const page =await context.newPage();
   
   const username= page.locator('#username');
   const password= page.locator('#password');
   const signInBtn= page.locator('#signInBtn');
   const errorText= page.locator("[style*='block']");

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
   
   await username.fill("");
   await password.fill("");

   await username.fill('rahulshettyacademy');
   await password.fill('Learning@830$3mK2');
   await signInBtn.click();

   console.log(await page.locator('h4 a').first().textContent());
   console.log(await page.locator('h4 a').last().textContent());
   console.log(await page.locator('h4 a').nth(1).textContent());
   
   //console.log(await page.locator('h4 a').allTextContents());


});