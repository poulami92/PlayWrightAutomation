const {LoginPage} =require('../PageObjects/LoginPage')
const {ProductCatalogPage} =require('../PageObjects/ProductCatalogPage')

class PageObjectFactory
{
    constructor(page)
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

module.exports={PageObjectFactory};