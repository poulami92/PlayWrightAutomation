import { Page, Locator } from '@playwright/test';

class LoginPracticePage
{
    private page: Page;
    private usernameField: Locator;
    private passwordField: Locator;
    private adminRadio: Locator;
    private userRadio: Locator;
    private roleDropdown: Locator;
    private termsCheckbox: Locator;
    private signInButton: Locator;

    constructor(page: Page)
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

    async gotoUrl(): Promise<void>
    {
        await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    }

    async enterUsername(username: string): Promise<void>
    {
        await this.usernameField.fill(username);
    }

    async enterPassword(password: string): Promise<void>
    {
        await this.passwordField.fill(password);
    }

    async selectUserType(userType: string): Promise<void>
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

    async selectRole(role: string): Promise<void>
    {
        await this.roleDropdown.selectOption(role);
    }

    async agreeToTerms(): Promise<void>
    {
        await this.termsCheckbox.check();
    }

    async clickSignIn(): Promise<void>
    {
        await this.signInButton.click();
    }

    async login(username: string, password: string, role: string): Promise<void>
    {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.selectRole(role);
        await this.agreeToTerms();
        await this.clickSignIn();
    }

    getUsernameField(): Locator
    {
        return this.usernameField;
    }

    getPasswordField(): Locator
    {
        return this.passwordField;
    }

    getTermsCheckbox(): Locator
    {
        return this.termsCheckbox;
    }

}

export { LoginPracticePage };
