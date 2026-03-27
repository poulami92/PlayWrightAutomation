class CheckOutPage
{
    constructor(page)
    {
       this.page=page; 
       this.coutryDropDownTextBox=page.getByPlaceholder('Select Country');
       this.placeOrder=page.getByText('Place Order');
    }

    async selectCountryInDropDown(country)
    {
        await this.coutryDropDownTextBox.pressSequentially(country)
        await this.page.getByText(country,{exact:true}).click();
    }

    async clickOnPlaceOrder()
    {
        this.placeOrder.click();
    }
    
}
module.exports={CheckOutPage};