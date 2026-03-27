import {test,expect} from '@playwright/test';
import {PageObjectFactory} from '../PageObjects_ts/PageObjectFactory'

test('Page Palywright test', async function({page})
{
   const pageObjectFactory = new PageObjectFactory(page);
   const loginPage=pageObjectFactory.getLoginPage();
   const productCatalogPage=pageObjectFactory.getProductCatalogPage();
   const products =['ZARA','ADIDAS'];
   const userEmail='Gpd@gmail.com';
   const password ='Kolkata@1';

   
   await loginPage.gotoUrl();
   await loginPage.validLogin(userEmail,password);
   await expect(loginPage.getLoginSuccessLocator()).toHaveText('Login Successfully');

   await productCatalogPage.waitForFirstProduct();
   for(let j=0;j<products.length;j++)
   {
     let product=products[j];
     await productCatalogPage.addProductToCart(product);
     await expect(productCatalogPage.getProductAddedSuccessLocator()).toHaveText('Product Added To Cart');
   }
   await productCatalogPage.clickOnCart();

   for(let j=0;j<products.length;j++)
   {
     let product=products[j];
     await expect(page.getByText(product)).toBeVisible();
   }

   await page.getByRole('button',{name:'Checkout'}).click();

   await page.getByPlaceholder('Select Country').pressSequentially('ind');
   await page.getByText('India',{exact:true}).click();

   await page.getByText('Place Order').click();
   await expect (page.getByText('Thankyou for the order.')).toBeVisible();

   const orderIdsLocator= page.locator('label.ng-star-inserted');
   await orderIdsLocator.first().waitFor();
   const orderIdCount = await orderIdsLocator.count();
   let orderNos=[];
   for(let i=0;i<orderIdCount;i++)
   {
      const orderIdContent:any=await orderIdsLocator.nth(i).textContent();
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