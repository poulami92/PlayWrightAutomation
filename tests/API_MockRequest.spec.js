const {test,expect,request} = require('@playwright/test')



test('Verify order id on history page',async ({page})=>
{
   await page.route('https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty',
      async (route)=>
      {
         await route.continue({url:'https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=Poulami'});
      }
   );

   await page.goto('https://rahulshettyacademy.com/angularAppdemo/');
   await page.getByRole('button',{name:'Virtual Library'}).click();
   await expect (page.locator('p')).toHaveText('Oops only 1 Book available');

   
})