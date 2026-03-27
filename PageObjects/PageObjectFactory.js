const {LoginPage} =require('./LoginPage')
const {ProductCatalogPage} =require('./ProductCatalogPage')
const {CartPage}=require('./CartPage');
const { CheckOutPage } = require('./CheckOutPage');
const { ConfirmationPage } = require('./ConfirmationPage');
const { OrdersPage } = require('./OrdersPage');


class PageObjectFactory
{
    constructor(page)
    {
        this.loginPage=new LoginPage(page);
        this.productCatalogPage = new ProductCatalogPage(page);
        this.cartPage = new CartPage(page);
        this.checkOutPage = new CheckOutPage(page);
        this.confirmationPage = new ConfirmationPage(page);
        this.ordersPage = new OrdersPage(page);
    }

    getLoginPage()
    {
        return this.loginPage;
    }

    getProductCatalogPage()
    {
        return this.productCatalogPage;
    }

    getCartPage()
    {
        return this.cartPage;
    }

    getCheckOutPage()
    {
        return this.checkOutPage;
    }

    getConfirmationPage()
    {
        return this.confirmationPage;
    }

    getOrdersPage()
    {
        return this.ordersPage;
    }

}

module.exports={PageObjectFactory};