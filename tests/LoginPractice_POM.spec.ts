import { test, expect, Page } from '@playwright/test';
import { LoginPracticePage } from '../PageObjects/LoginPracticePage';

test('Login Practice Page - Complete Login Flow', async function({ page }: { page: Page })
{
    const loginPracticePage = new LoginPracticePage(page);
    
    const username: string = 'rahulshettyacademy';
    const password: string = 'Learning@830$3mK2';
    const role: string = 'Teacher';
    
    // Step 1: Navigate to login page
    await loginPracticePage.gotoUrl();
    
    // Step 2: Enter username and password
    await loginPracticePage.enterUsername(username);
    await loginPracticePage.enterPassword(password);
    
    // Step 3: Select role from dropdown
    await loginPracticePage.selectRole(role);
    
    // Step 4: Check the terms and conditions checkbox
    await loginPracticePage.agreeToTerms();
    
    // Step 5: Click Sign In button
    await loginPracticePage.clickSignIn();
    
    // Verify successful login by checking page URL
    await expect(page).toHaveURL('https://rahulshettyacademy.com/angularpractice/shop');
});

test('Login Practice Page - Using Combined Login Method', async function({ page }: { page: Page })
{
    const loginPracticePage = new LoginPracticePage(page);
    
    const username: string = 'rahulshettyacademy';
    const password: string = 'Learning@830$3mK2';
    const role: string = 'Teacher';
    
    // Navigate to login page
    await loginPracticePage.gotoUrl();
    
    // Perform login using combined method
    await loginPracticePage.login(username, password, role);
    
    // Verify successful login
    await expect(page).toHaveURL('https://rahulshettyacademy.com/angularpractice/shop');
});
