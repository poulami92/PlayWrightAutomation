const {test,expect} = require('@playwright/test')
const {PageObjectFactory} =require('../PageObjects/PageObjectFactory')
const {customTest} = require('../Utility/CustomFixtures')

customTest('Page Palywright test', async function({page,loginData})
{
   const pageObjectFactory = new PageObjectFactory(page);
   const loginPage=pageObjectFactory.getLoginPage();
   const productCatalogPage=pageObjectFactory.getProductCatalogPage();
   
   const userEmail=loginData.userEmail;
   const password =loginData.userPassword;
   const product = loginData.product;
   
   await loginPage.gotoUrl();
   await loginPage.validLogin(userEmail,password);
   await expect(loginPage.getLoginSuccessLocator()).toHaveText('Login Successfully');

   await productCatalogPage.waitForFirstProduct();
   await productCatalogPage.addProductToCart(product);
   await expect(productCatalogPage.getProductAddedSuccessLocator()).toHaveText('Product Added To Cart');
    
   await productCatalogPage.clickOnCart();
   await expect(page.getByText(product)).toBeVisible();
   

   
});