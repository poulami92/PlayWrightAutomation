const {test,expect,request} = require('@playwright/test')

const fakePayLoadOrders = { data: [], message: "No Orders" };

test('@api Verify order id on history page',async ({page})=>
{
   await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
      async (route)=>
      {
         //Get actual response from server
         const originalResponse = await route.fetch();

         // Convert js object to json string format
         let fakeBody = JSON.stringify(fakePayLoadOrders);
         await route.fulfill(
            {
               //status: 200,
               //contentType: 'application/json',
               originalResponse,
               body: fakeBody
            }
         );
      }
   )
   

   await page.goto("https://rahulshettyacademy.com/client");
   await page.getByPlaceholder('email@example.com').fill('Gpd@gmail.com');
   await page.getByPlaceholder('enter your passsword').fill("Kolkata@1");
   await page.getByRole('button',{name:'Login'}).click();
   await expect(page.getByText('Login Successfully')).toBeVisible();
   
   await page.getByRole('listitem').getByRole('button',{name:'ORDERS'}).click();
   
   console.log(await page.locator(".mt-4").textContent());
   
})