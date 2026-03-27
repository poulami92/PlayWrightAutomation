import {Page} from '@playwright/test';
import {LoginPage} from './LoginPage';
import {ProductCatalogPage} from './ProductCatalogPage';

export class PageObjectFactory
{
    loginPage:LoginPage;
    productCatalogPage:ProductCatalogPage;

    constructor(page:Page)
    {
        this.loginPage=new LoginPage(page);
        this.productCatalogPage = new ProductCatalogPage(page);
    }

    getLoginPage()
    {
        return this.loginPage;
    }

    getProductCatalogPage()
    {
        return this.productCatalogPage;
    }

}

//module.exports={PageObjectFactory};