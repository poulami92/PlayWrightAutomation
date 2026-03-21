const {test,expect,request} = require('@playwright/test')



test('Verify order id on history page',async ({page})=>
{
   page.on('request', (request)=>{
      console.log(request.url());
   })

   page.on('response', (response)=>{
      console.log(response.url()+' '+response.status());
   })

   await page.goto('https://rahulshettyacademy.com/angularAppdemo/');
   await page.getByRole('button',{name:'Browse Products'}).click();
   await page.getByRole('link',{name:'Selenium'}).click();
   await page.locator('.add-to-cart').click();
   await page.locator('.add-to-cart').click();

   
})