const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   const username= page.locator('#username');
   const password= page.locator('#password');

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   await username.fill('rahulshettyacademy');
   await password.fill('Learning@830$3mK2');

   let flag;

   const termCheck = page.locator('#terms');
   await termCheck.click();
   flag= await termCheck.isChecked();
   console.log('after checking '+flag);
   await expect(termCheck).toBeChecked();
   expect(flag).toBeTruthy();

   //To uncheck
   await termCheck.uncheck();
   flag= await termCheck.isChecked();
   console.log('after unchecking '+flag);
   expect(flag).toBeFalsy();

   //To Verify

   
   
});