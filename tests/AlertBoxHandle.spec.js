const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

   page.on('dialog',async (dialog)=>{
      
      console.log(dialog.message());
      await dialog.accept();
      
   });
   await page.locator('#alertbtn').click();

   // page.on('dialog',async (dialog)=>{

   //    console.log(dialog.message());
   //    await dialog.dismiss();
      
   // });
   // await page.locator('#confirmbtn').click();
   
})