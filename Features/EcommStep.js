import {Given,When,Then} from '@cucumber/cucumber';
import {expect} from '@playwright/test';


Given('login with {string} and {string}', {timeout:20000},async function (userEmail, password) {

 this.loginPage=this.pageObjectFactory.getLoginPage();
 await this.loginPage.gotoUrl();
 await this.loginPage.validLogin(userEmail,password);
});

Then('verify login success message is displayed',async function () {

 await expect(this.loginPage.getLoginSuccessLocator()).toHaveText('Login Successfully');

});

Then('verify error message is displayed',async function () {
    
    await expect(this.loginPage.getLoginFailLocator()).toContainText('Incorrect email');
});


When('add product {string} to cart', async function (product) {

    this.productCatalogPage=this.pageObjectFactory.getProductCatalogPage();
    await this.productCatalogPage.waitForFirstProduct();
    await this.productCatalogPage.addProductToCart(product);
    await expect(this.productCatalogPage.getProductAddedSuccessLocator()).toHaveText('Product Added To Cart');
   
});

Then('Verify product {string} is displayed in cart', async function (product) {

    this.cartPage=this.pageObjectFactory.getCartPage();
    await this.productCatalogPage.clickOnCart();
    await expect(this.cartPage.getProductLocator(product)).toBeVisible();
});

When('enter valid details and place the Order', async function () {


   const checkOutPage = this.pageObjectFactory.getCheckOutPage();
   const confirmationPage = this.pageObjectFactory.getConfirmationPage();
   await this.cartPage.clickOnCheckOut();
   await checkOutPage.selectCountryInDropDown('India');
   await checkOutPage.clickOnPlaceOrder();
   this.orderNos = await confirmationPage.getOrderIdNos();

});

Then('verify order is present in order history page', async function () {
  
    const ordersPage = this.pageObjectFactory.getOrdersPage();
    await ordersPage.clickOnOrders();
    await expect (ordersPage.getOrderNo(this.orderNos)).toBeVisible();
});



          