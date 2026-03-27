class LoginPracticePage
{
    constructor(page)
    {
        this.page = page;
        this.usernameField = page.getByRole('textbox', { name: 'Username:' });
        this.passwordField = page.getByRole('textbox', { name: 'Password:' });
        this.adminRadio = page.getByRole('radio', { name: 'Admin' });
        this.userRadio = page.getByRole('radio', { name: 'User' });
        this.roleDropdown = page.getByRole('combobox');
        this.termsCheckbox = page.getByRole('checkbox', { name: 'I Agree to the terms and' });
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
    }

    async gotoUrl()
    {
        await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    }

    async enterUsername(username)
    {
        await this.usernameField.fill(username);
    }

    async enterPassword(password)
    {
        await this.passwordField.fill(password);
    }

    async selectUserType(userType)
    {
        if (userType.toLowerCase() === 'admin')
        {
            await this.adminRadio.click();
        }
        else if (userType.toLowerCase() === 'user')
        {
            await this.userRadio.click();
        }
    }

    async selectRole(role)
    {
        await this.roleDropdown.selectOption(role);
    }

    async agreeToTerms()
    {
        await this.termsCheckbox.check();
    }

    async clickSignIn()
    {
        await this.signInButton.click();
    }

    async login(username, password, role)
    {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.selectRole(role);
        await this.agreeToTerms();
        await this.clickSignIn();
    }

    getUsernameField()
    {
        return this.usernameField;
    }

    getPasswordField()
    {
        return this.passwordField;
    }

    getTermsCheckbox()
    {
        return this.termsCheckbox;
    }

}

module.exports = { LoginPracticePage };
