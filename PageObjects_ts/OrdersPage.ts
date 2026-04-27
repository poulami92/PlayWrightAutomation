import { Page, Locator } from '@playwright/test';

export class OrdersPage
{
    page: Page;
    orders: Locator;

    constructor(page: Page)
    {
       this.page = page; 
       this.orders = page.getByRole('listitem').getByRole('button', {name: 'ORDERS'});
    }

    async clickOnOrders(): Promise<void>
    {
        await this.orders.click();
    }

    getOrderNo(orderNo: string): Locator
    {
        return this.page.getByText(orderNo);
    }
}