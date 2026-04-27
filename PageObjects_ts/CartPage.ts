import { Page, Locator } from '@playwright/test';

export class CartPage
{
    page: Page;
    checkOut: Locator;

    constructor(page: Page)
    {
       this.page = page; 
       this.checkOut = page.getByRole('button', {name: 'Checkout'})
    }

    getProductLocator(product: string): Locator
    {
        return this.page.getByText(product)
    }

    async clickOnCheckOut(): Promise<void>
    {
        await this.checkOut.click();
    }
}