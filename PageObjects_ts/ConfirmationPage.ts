import { Page, Locator } from '@playwright/test';

export class ConfirmationPage
{
    page: Page;
    thankYouLocator: Locator;
    orderIdsLocator: Locator;

    constructor(page: Page)
    {
       this.page = page; 
       this.thankYouLocator = page.locator('.hero-primary');
       this.orderIdsLocator = page.locator('label.ng-star-inserted');
    }

    getConfirmationLocator(): Locator
    {
        return this.thankYouLocator;
    }

    async getOrderIdNos(): Promise<string[]>
    {
      await this.orderIdsLocator.first().waitFor();
      const orderIdCount = await this.orderIdsLocator.count();
      const orderNos: string[] = [];
      for(let i = 0; i < orderIdCount; i++)
      {
       const orderIdContent = await this.orderIdsLocator.nth(i).textContent();
       const orderNo = orderIdContent?.trim().split(" ")[1].trim();
       if(orderNo)
       {
           orderNos.push(orderNo);
       }
      }
      return orderNos;
    }
}