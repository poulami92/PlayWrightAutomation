const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   const username= page.locator('#username');
   const password= page.locator('#password');

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   await username.fill('rahulshettyacademy');
   await password.fill('Learning@830$3mK2');

   const userRadio= page.locator("input[value='user']");
   await userRadio.click();
   const okBtn=page.locator('#okayBtn');
   await okBtn.click();

   expect(userRadio).toBeChecked();
   const flag=await userRadio.isChecked();
   console.log(flag);
   //await page.pause();

   
   
});