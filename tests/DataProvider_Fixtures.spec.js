const {expect} = require('@playwright/test')
const {PageObjectFactory} =require('../PageObjects/PageObjectFactory')
const {customTest} = require('../Utility/CustomFixtures')

customTest('Page Palywright test', async function({page,loginData})
{
   const pageObjectFactory = new PageObjectFactory(page);
   const loginPage=pageObjectFactory.getLoginPage();
   const productCatalogPage=pageObjectFactory.getProductCatalogPage();
   const cartPage=pageObjectFactory.getCartPage();
   
   const userEmail=loginData.userEmail;
   const password =loginData.userPassword;
   const products = loginData.products;
    
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
     await expect(cartPage.getProductLocator(product)).toBeVisible();
   }
   

   
});