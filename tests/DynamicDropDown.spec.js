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
        await option.nth(i).click();
        break;
      }
   }

   await expect(page.locator('#autocomplete')).toHaveValue('India');

   const inputText=await page.locator('#autocomplete').inputValue();
   expect(inputText).toEqual('India');
   
});