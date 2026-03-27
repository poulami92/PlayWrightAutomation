class CartPage
{
    constructor(page)
    {
       this.page=page; 
       this.checkOut=page.getByRole('button',{name:'Checkout'})
    }

    getProductLocator(product)
    {
        return this.page.getByText(product)
        
    }

    async clickOnCheckOut()
    {
        await this.checkOut.click();
    }

    
}
module.exports={CartPage};