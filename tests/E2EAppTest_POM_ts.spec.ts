import { test, expect } from '@playwright/test';
import { PageObjectFactory } from '../PageObjects_ts/PageObjectFactory';
import { customTest } from '../Utility_ts/CustomFixtures';

interface LoginData {
    userEmail: string;
    userPassword: string;
    products: string[];
}

customTest('E2E App Test with POM', async ({ page, loginData }: { page: any; loginData: LoginData }) => {
   const pageObjectFactory = new PageObjectFactory(page);
   const loginPage = pageObjectFactory.getLoginPage();
   const productCatalogPage = pageObjectFactory.getProductCatalogPage();
   const cartPage = pageObjectFactory.getCartPage();
   const checkOutPage = pageObjectFactory.getCheckOutPage();
   const confirmationPage = pageObjectFactory.getConfirmationPage();
   const ordersPage = pageObjectFactory.getOrdersPage();

   const userEmail: string = loginData.userEmail;
   const password: string = loginData.userPassword;
   const products: string[] = loginData.products;

   // Login
   await loginPage.gotoUrl();
   await loginPage.validLogin(userEmail, password);
   await expect(loginPage.getLoginSuccessLocator()).toHaveText('Login Successfully');

   // Add products to cart
   await productCatalogPage.waitForFirstProduct();
   for(let j = 0; j < products.length; j++)
   {
     const product = products[j];
     await productCatalogPage.addProductToCart(product);
     await expect(productCatalogPage.getProductAddedSuccessLocator()).toHaveText('Product Added To Cart');
   }
   await productCatalogPage.clickOnCart();

   // Verify products in cart
   for(let j = 0; j < products.length; j++)
   {
     const product = products[j];
     await expect(cartPage.getProductLocator(product)).toBeVisible();
   }

   // Checkout
   await cartPage.clickOnCheckOut();
   await checkOutPage.selectCountryInDropDown('India');
   await checkOutPage.clickOnPlaceOrder();

   // Verify confirmation
   await expect(confirmationPage.getConfirmationLocator()).toHaveText(' Thankyou for the order. ');
   const orderNos: string[] = await confirmationPage.getOrderIdNos();
   console.log(orderNos);

   // Verify order in history
   await ordersPage.clickOnOrders();
   for(let j = 0; j < orderNos.length; j++)
   {
     await expect(ordersPage.getOrderNo(orderNos[j])).toBeVisible();
   }
});