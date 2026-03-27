const {test,expect} = require('@playwright/test')
const {PageObjectFactory} =require('../PageObjects/PageObjectFactory')
const testData = require('../Utility/Parameterization_TestData.json')

testData.forEach((data) =>
{
  test(`Page Palywright test ${data.product}`, async function ({ page }) {
    const pageObjectFactory = new PageObjectFactory(page);
    const loginPage = pageObjectFactory.getLoginPage();
    const productCatalogPage = pageObjectFactory.getProductCatalogPage();

    const userEmail = data.userEmail;
    const password = data.userPassword;
    const product = data.product;


    await loginPage.gotoUrl();
    await loginPage.validLogin(userEmail, password);
    await expect(loginPage.getLoginSuccessLocator()).toHaveText('Login Successfully');

    await productCatalogPage.waitForFirstProduct();
    await productCatalogPage.addProductToCart(product);
    await expect(productCatalogPage.getProductAddedSuccessLocator()).toHaveText('Product Added To Cart');
    
    await productCatalogPage.clickOnCart();
    await expect(page.getByText(product)).toBeVisible();
    

  })
})

