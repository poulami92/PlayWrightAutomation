const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   const userEmail= page.locator('#userEmail');
   const userPassword= page.locator('#userPassword');
   const login= page.locator('#login');
   const loginSuccessText=page.locator('#toast-container');
   const cartSuccessText=page.locator('#toast-container');


   await page.goto("https://rahulshettyacademy.com/client");

   await userEmail.fill("Gpd@gmail.com")
   await userPassword.fill("Kolkata@1");
   await login.click();
   
   await expect(loginSuccessText).toHaveText('Login Successfully');

   const product ='ZARA';
   const productCard=page.locator('div.card-body');

   const productCount=await productCard.count();
   console.log(productCount);

   for(let i=0;i<productCount;i++)
   {
      let productTitle= await productCard.nth(i).locator('b').textContent();
      if(productTitle.includes(product))
      {
         await productCard.nth(i).locator("text=Add To Cart").click();
         await expect(cartSuccessText).toHaveText('Product Added To Cart');
         break;
      }
      
   }
   
});