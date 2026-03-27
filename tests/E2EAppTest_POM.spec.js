const {test,expect} = require('@playwright/test')
const {PageObjectFactory} =require('../PageObjects/PageObjectFactory')
const testData = require('../Utility/TestData.json')

test('Page Palywright test', async function({page})
{
   const pageObjectFactory = new PageObjectFactory(page);
   const loginPage=pageObjectFactory.getLoginPage();
   const productCatalogPage=pageObjectFactory.getProductCatalogPage();
   const cartPage=pageObjectFactory.getCartPage();
   const checkOutPage = pageObjectFactory.getCheckOutPage();
   const confirmationPage = pageObjectFactory.getConfirmationPage();
   const ordersPage = pageObjectFactory.getOrdersPage();

   const products =testData.products;
   const userEmail=testData.userEmail;
   const password =testData.userPassword;

   
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

   await cartPage.clickOnCheckOut();

   await checkOutPage.selectCountryInDropDown('India');
   await checkOutPage.clickOnPlaceOrder();

   await expect (confirmationPage.getConfirmationLocator()).toHaveText(' Thankyou for the order. ');
   const orderNos = await confirmationPage.getOrderIdNos();
   console.log(orderNos);

   await ordersPage.clickOnOrders();
   for(let j=0;j<orderNos.length;j++)
   {
     await expect (ordersPage.getOrderNo(orderNos[j])).toBeVisible();
   }

   
});