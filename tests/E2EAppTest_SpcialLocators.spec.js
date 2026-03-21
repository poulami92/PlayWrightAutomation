const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{
   const cartSuccessText=page.locator('#toast-container');


   await page.goto("https://rahulshettyacademy.com/client");
   
   await page.getByPlaceholder('email@example.com').fill('Gpd@gmail.com');
   await page.getByPlaceholder('enter your passsword').fill("Kolkata@1");
   await page.getByRole('button',{name:'Login'}).click();

   await expect(page.getByText('Login Successfully')).toBeVisible();

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

   await page.getByRole('button',{name:'Checkout'}).click();

   await page.getByPlaceholder('Select Country').pressSequentially('ind');
   await page.getByText('India',{exact:true}).click();

   await page.getByText('Place Order').click();
   await expect (page.getByText('Thankyou for the order1.')).toBeVisible();

   await page.pause();

   const orderIdsLocator= page.locator('label.ng-star-inserted');
   await orderIdsLocator.first().waitFor();
   const orderIdCount = await orderIdsLocator.count();
   let orderNos=[];
   for(let i=0;i<orderIdCount;i++)
   {
      const orderIdContent=await orderIdsLocator.nth(i).textContent();
      const orderNo=orderIdContent.trim().split(" ")[1].trim();
      orderNos.push(orderNo);
   }

   console.log(orderNos);

   await page.getByRole('listitem').getByRole('button',{name:'ORDERS'}).click();
   for(let j=0;j<orderNos.length;j++)
   {
     await expect (page.getByText(orderNos[j])).toBeVisible();
   }

   
});