class ConfirmationPage
{
    constructor(page)
    {
       this.page=page; 
       this.thankYouLocator=page.locator('.hero-primary');
       this.orderIdsLocator = page.locator('label.ng-star-inserted');
    }

    getConfirmationLocator()
    {
        return this.thankYouLocator;
    }

    async getOrderIdNos()
    {
      await this.orderIdsLocator.first().waitFor();
      const orderIdCount = await this.orderIdsLocator.count();
      let orderNos=[];
      for(let i=0;i<orderIdCount;i++)
      {
       const orderIdContent=await this.orderIdsLocator.nth(i).textContent();
       const orderNo=orderIdContent.trim().split(" ")[1].trim();
       orderNos.push(orderNo);
      }
      return orderNos;
    }

    
}
module.exports={ConfirmationPage};