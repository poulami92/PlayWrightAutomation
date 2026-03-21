const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   const documentLink = page.locator("a[href*='document']");

   const [childPage]=await Promise.all(
      [
         page.waitForEvent('popup'),
         documentLink.click()
      ]
   );

   const redText=await childPage.locator('.red').textContent();
   console.log(redText);

   const domain=redText.split("@")[1].split(" ")[0];
   console.log(domain);

   const username= page.locator('#username');

   await username.fill(domain);

   await page.pause();

   
});