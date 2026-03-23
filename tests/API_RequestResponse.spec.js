const {test,expect,request} = require('@playwright/test')

const loginPayload={"userEmail": "Gpd@gmail.com", "userPassword": "Kolkata@1"};
const createOrderPayload=
{"orders":[
    {
        "country": "India", 
        "productOrderedId": "6960ea76c941646b7a8b3dd5"
    }] 
};

let token;
let apiContext;

test.beforeAll( async function()
{
   //Login End Point
   apiContext=await request.newContext();
   let loginResponse=await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
      {
         data:loginPayload
      }
   )
   expect(loginResponse.ok()).toBeTruthy();

   //get response body
   let loginResponseBody=await loginResponse.json();
   token=await loginResponseBody.token;
   console.log(token);

})

test('@api Verify order id on history page',async ({page})=>
{
   let createOrderResponse=await apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
         data:createOrderPayload,
          headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
      }
   )

   expect(createOrderResponse.ok()).toBeTruthy();
   let createOrderResponseBody = await createOrderResponse.json();
   let orderId=await createOrderResponseBody.orders[0];
   console.log(orderId);

   await page.goto("https://rahulshettyacademy.com/client");
   await page.getByPlaceholder('email@example.com').fill('Gpd@gmail.com');
   await page.getByPlaceholder('enter your passsword').fill("Kolkata@1");
   await page.getByRole('button',{name:'Login'}).click();
   await expect(page.getByText('Login Successfully')).toBeVisible();
   
   await page.getByRole('listitem').getByRole('button',{name:'ORDERS'}).click();
   await expect (page.getByText(orderId)).toBeVisible();
   
})