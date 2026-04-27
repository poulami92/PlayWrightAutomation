const {test,expect} = require('@playwright/test')
const {PageObjectFactory} =require('../PageObjects/PageObjectFactory')
const TestData = require('../Utility/TestData.json')

test('Page Palywright test', async function({page})
{
   const pageObjectFactory = new PageObjectFactory(page);
   const loginPage=pageObjectFactory.getLoginPage();
   const productCatalogPage=pageObjectFactory.getProductCatalogPage();
   
   const userEmail=TestData.userEmail;
   const password =TestData.userPassword;
   const products= TestData.products;

   
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

});