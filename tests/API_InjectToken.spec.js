const {test,expect,request} = require('@playwright/test')
const {ApiUtils} = require('../Utility/ApiUtils')

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
let apiUtils;

test.beforeAll( async function()
{
   //Login End Point
   apiContext=await request.newContext();
   apiUtils=new ApiUtils(apiContext,loginPayload);
   token=await apiUtils.getToken();
   console.log(token);

})

test.beforeEach(async ({page})=>{
   await page.addInitScript(
      (tokenValue)=>{
         window.localStorage.setItem('token',tokenValue);
      },token);
})

test('Add to Cart Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/client");

   const products =['ZARA','ADIDAS'];
   const productCard=page.locator('div.card-body');
   await productCard.first().waitFor();
   const productCatalogCount=await productCard.count();

   for(let j=0;j<products.length;j++)
   {
     let product=products[j];

     await productCard.filter({hasText:product})
     .getByRole('button',{name:'Add To Cart'}).click();

     await expect (page.getByText('Product Added To Cart')).toBeVisible();
   }

   await page.getByRole('listitem').getByRole('button',{name:'Cart'}).click();

   for(let j=0;j<products.length;j++)
   {
     let product=products[j];
     await expect(page.getByText(product)).toBeVisible();
   }
   
})

test('Verify order id on history page',async ({page})=>
{
   const orderId=await apiUtils.createOrder(createOrderPayload,token);

   await page.goto("https://rahulshettyacademy.com/client");
   await page.getByRole('listitem').getByRole('button',{name:'ORDERS'}).click();
   await expect (page.getByText(orderId)).toBeVisible();
   
})