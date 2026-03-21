class LoginPage
{
    constructor(page)
    {
       this.page=page; 
       this.username=page.getByPlaceholder('email@example.com');
       this.password=page.getByPlaceholder('enter your passsword');
       this.login=page.getByRole('button',{name:'Login'});
       this.loginSuccess=page.locator('#toast-container');
    }

    async gotoUrl()
    {
        await this.page.goto('https://rahulshettyacademy.com/client')
    }

    async validLogin(userEmail,password)
    {
       await this.username.fill(userEmail);
       await this.password.fill(password);
       await this.login.click();
    }

    getLoginSuccessLocator()
    {
        return this.loginSuccess;
    }

}

module.exports={LoginPage};