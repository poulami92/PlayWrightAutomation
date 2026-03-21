const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

   const textBox = page.locator("#displayed-text");

   let visible;

   visible=await textBox.isVisible();

   console.log("before clicking "+visible);
   await expect(textBox).toBeVisible();
   expect(visible).toBeTruthy();

   await page.locator('#hide-textbox').click();

   visible=await textBox.isVisible();

   console.log("after clicking "+visible);
   await expect(textBox).not.toBeVisible();
   await expect(textBox).toBeHidden();
   expect(visible).toBeFalsy();

   
});