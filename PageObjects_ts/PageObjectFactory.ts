import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { ProductCatalogPage } from './ProductCatalogPage';
import { CartPage } from './CartPage';
import { CheckOutPage } from './CheckOutPage';
import { ConfirmationPage } from './ConfirmationPage';
import { OrdersPage } from './OrdersPage';

export class PageObjectFactory
{
    loginPage: LoginPage;
    productCatalogPage: ProductCatalogPage;
    cartPage: CartPage;
    checkOutPage: CheckOutPage;
    confirmationPage: ConfirmationPage;
    ordersPage: OrdersPage;

    constructor(page: Page)
    {
        this.loginPage = new LoginPage(page);
        this.productCatalogPage = new ProductCatalogPage(page);
        this.cartPage = new CartPage(page);
        this.checkOutPage = new CheckOutPage(page);
        this.confirmationPage = new ConfirmationPage(page);
        this.ordersPage = new OrdersPage(page);
    }

    getLoginPage(): LoginPage
    {
        return this.loginPage;
    }

    getProductCatalogPage(): ProductCatalogPage
    {
        return this.productCatalogPage;
    }

    getCartPage(): CartPage
    {
        return this.cartPage;
    }

    getCheckOutPage(): CheckOutPage
    {
        return this.checkOutPage;
    }

    getConfirmationPage(): ConfirmationPage
    {
        return this.confirmationPage;
    }

    getOrdersPage(): OrdersPage
    {
        return this.ordersPage;
    }
}