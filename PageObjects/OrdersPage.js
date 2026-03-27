class OrdersPage
{
    constructor(page)
    {
       this.page=page; 
       this.orders=page.getByRole('listitem').getByRole('button',{name:'ORDERS'});
    }

    async clickOnOrders()
    {
        await this.orders.click();
    }

    getOrderNo(orderNo)
    {
        return this.page.getByText(orderNo);
    }

    
}
module.exports={OrdersPage};