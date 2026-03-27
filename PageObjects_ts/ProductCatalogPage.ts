import {Locator, Page} from '@playwright/test';

export class ProductCatalogPage{

   productCard : Locator;
   cartSuccess : Locator;
   cart : Locator;

   constructor(page : Page)
   {
     this.productCard=page.locator('div.card-body');
     this.cartSuccess=page.locator('#toast-container');
     this.cart=page.getByRole('listitem').getByRole('button',{name:'Cart'});
   }

   async waitForFirstProduct()
   {
    await this.productCard.first().waitFor();
   }

   async addProductToCart(product : string)
   {
     await this.serachProduct(product)
     .getByRole('button',{name:'Add To Cart'}).click();
   }

    serachProduct(product : string)
   {
     return this.productCard.filter({hasText:product})
   }

   getProductAddedSuccessLocator()
   {
    return this.cartSuccess;
   }

   async clickOnCart()
   {
    await this.cart.click();
   }

}

//module.exports={ProductCatalogPage};