const {test,expect,request} = require('@playwright/test')



test('@api Verify order id on history page',async ({page})=>
{
   await page.route('**/*.{jpg,css}',
      async (route)=>
      {
         await route.abort();
      }
   );

   await page.goto('https://rahulshettyacademy.com/angularAppdemo/');
   await page.getByRole('button',{name:'Browse Products'}).click();
   await page.getByRole('link',{name:'Selenium'}).click();
   await page.locator('.add-to-cart').click();
   await page.locator('.add-to-cart').click();

   
})