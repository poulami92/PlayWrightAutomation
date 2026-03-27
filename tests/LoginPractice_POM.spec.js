const {test, expect} = require('@playwright/test');
const {LoginPracticePage} = require('../PageObjects/LoginPracticePage');

test('Login Practice Page - Complete Login Flow', async function({page})
{
    const loginPracticePage = new LoginPracticePage(page);
    
    const username = 'rahulshettyacademy';
    const password = 'Learning@830$3mK2';
    const role = 'Teacher';
    
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

test('Login Practice Page - Using Combined Login Method', async function({page})
{
    const loginPracticePage = new LoginPracticePage(page);
    
    const username = 'rahulshettyacademy';
    const password = 'Learning@830$3mK2';
    const role = 'Teacher';
    
    // Navigate to login page
    await loginPracticePage.gotoUrl();
    
    // Perform login using combined method
    await loginPracticePage.login(username, password, role);
    
    // Verify successful login
    await expect(page).toHaveURL('https://rahulshettyacademy.com/angularpractice/shop');
});
