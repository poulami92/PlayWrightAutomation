import { Page, Locator } from '@playwright/test';

export class CheckOutPage
{
    page: Page;
    coutryDropDownTextBox: Locator;
    placeOrder: Locator;

    constructor(page: Page)
    {
       this.page = page; 
       this.coutryDropDownTextBox = page.getByPlaceholder('Select Country');
       this.placeOrder = page.getByText('Place Order');
    }

    async selectCountryInDropDown(country: string): Promise<void>
    {
        await this.coutryDropDownTextBox.pressSequentially(country);
        await this.page.getByText(country, {exact: true}).click();
    }

    async clickOnPlaceOrder(): Promise<void>
    {
        await this.placeOrder.click();
    }
}