
import {expect} from '@playwright/test';
import {PageObjectFactory} from '../PageObjects_ts/PageObjectFactory';
import {customTest} from '../Utility_ts/CustomFixtures';

customTest('Page Palywright test', async function({page,loginData})
{
   const pageObjectFactory = new PageObjectFactory(page);
   const loginPage=pageObjectFactory.getLoginPage();
   const productCatalogPage=pageObjectFactory.getProductCatalogPage();
   
   const userEmail=loginData.userEmail;
   const password =loginData.userPassword;
   const products = loginData.products;
   
   await loginPage.gotoUrl();
   await loginPage.validLogin(userEmail,password);
   await expect(loginPage.getLoginSuccessLocator()).toHaveText('Login Successfully');

   await productCatalogPage.waitForFirstProduct();
   for(let j=0;j<products.length;j++)
   {
      await productCatalogPage.addProductToCart(products[j]);
      await expect(productCatalogPage.getProductAddedSuccessLocator()).toHaveText('Product Added To Cart');
   }
   await productCatalogPage.clickOnCart();

   for(let j=0;j<products.length;j++)
   {
     await expect(page.getByText(products[j])).toBeVisible();
   }
   
   

   
});