const {test,expect,request} = require('@playwright/test')
const loginPayload={userEmail: "Gpd@gmail.com", userPassword: "Kolkata@1"};
const createOrderPayload=
{"orders":[
    {
        "country": "India", 
        "productOrderedId": "6960ea76c941646b7a8b3dd5"
    }] 
};

let token;
let apiContext;
let webContext;

// test.describe.configure({mode:'serial'})
// test.describe.configure({mode:'parallel'})
test.beforeAll( async function({browser})
{
   const context = await browser.newContext();
   const page = await context.newPage();

   await page.goto("https://rahulshettyacademy.com/client");
   await page.getByPlaceholder('email@example.com').fill('Gpd@gmail.com');
   await page.getByPlaceholder('enter your passsword').fill("Kolkata@1");
   await page.getByRole('button',{name:'Login'}).click();
   await expect(page.getByText('Login Successfully')).toBeVisible();

   await context.storageState({path: 'state.json'});
   webContext=await browser.newContext({storageState: 'state.json'});

})

test('@api Add to Cart Palywright test', async function()
{
   const page=await webContext.newPage();
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

test('@api Verify order id on history page',async ()=>
{
   const page=await webContext.newPage();

   await page.goto("https://rahulshettyacademy.com/client");
   await page.getByRole('listitem').getByRole('button',{name:'ORDERS'}).click();

   
})