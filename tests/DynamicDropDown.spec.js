const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   await page.locator('#autocomplete').pressSequentially('ind');
   await page.locator('.ui-autocomplete').waitFor();
   const option = page.locator('.ui-autocomplete div');
   const count = await option.count();

   for(let i=0;i<count;i++)
   {
      let text=await option.nth(i).textContent();
      if(text.trim()==='India')
      {
        option.nth(i).click();
        break;
      }
   }

   await page.pause();
   
});