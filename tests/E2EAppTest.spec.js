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

   const products =['ZARA','ADIDAS'];
   const productCard=page.locator('div.card-body');
   await productCard.first().waitFor();
   const productCatalogCount=await productCard.count();

   for(let j=0;j<products.length;j++)
   {
     let product=products[j];
     for(let i=0;i<productCatalogCount;i++)
     {
      let productTitle= await productCard.nth(i).locator('b').textContent();
      if(productTitle.includes(product))
      {
         await productCard.nth(i).locator("text=Add To Cart").click();
         await expect(cartSuccessText).toHaveText('Product Added To Cart');
         break;
      }
      
     }
   }

   const cart=page.locator("button[routerlink*='cart']");
   await cart.click();
  
   //await expect(page.locator(`.cartSection h3:has-text("${product}")`)).toBeVisible();

   for(let j=0;j<products.length;j++)
   {
     let product=products[j];
     await expect(page.locator(".cartSection h3:has-text('"+product+"')")).toBeVisible();
     const pdtVisible=await page.locator(`.cartSection h3:has-text("${product}")`).isVisible();
     expect(pdtVisible).toBeTruthy();
   }

   // await expect(page.locator(".cartSection h3:has-text('"+product+"')")).toBeVisible();

   // const pdtVisible=await page.locator(`.cartSection h3:has-text("${product}")`).isVisible();

   // expect(pdtVisible).toBeTruthy();

   const checkout = page.locator("text=Checkout");

   await checkout.click();

   //await page.pause();

   const countryTextBox= page.locator("input[placeholder='Select Country']");
   await countryTextBox.pressSequentially('ind');
   const countryDropDown = page.locator('section.ta-results');
   await countryDropDown.waitFor();

   const options = countryDropDown.locator('span');

   const optionsCount=await options.count();

   for(let i=0;i<optionsCount;i++)
   {
      let countryText=await options.nth(i).textContent();
      if(countryText.trim()==='India')
      {
         await options.nth(i).click();
         break;
      }
   }

   await page.locator("text=Place Order").click();
   await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ')

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

   // const orderIdContent=await page.locator('label.ng-star-inserted').textContent();
   // const orderNo=orderIdContent.trim().split(" ")[1].trim();
   // console.log(orderNo);

   await page.locator("button[routerlink*='myorders']").click();

   const orderIdRows= page.locator("tbody tr");
   await orderIdRows.first().waitFor();
   const orderCount=await orderIdRows.count();
   for(let j=0;j<orderNos.length;j++)
   {
     for(let i=0;i<orderCount;i++)
     {
       let orderNoOnOrderHistory= await orderIdRows.nth(i).locator('th').textContent();
       if(orderNoOnOrderHistory===orderNos[j])
       {
        expect(orderIdRows.nth(i).locator('th')).toHaveText(orderNos[j])
       }
      }
   }


   // for(let i=0;i<orderCount;i++)
   // {
   //    let orderNoOnOrderHistory= await orderIdRows.nth(i).locator('th').textContent();
   //    if(orderNoOnOrderHistory===orderNo)
   //    {
   //      orderIdRows.nth(i).locator('text=View').click();
   //      break;
   //    }
   // }

   // const orderIdOnView = page.locator('div.col-text');
   // await expect(orderIdOnView).toHaveText(orderNo);
   
});