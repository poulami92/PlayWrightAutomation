const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

   await page.goto('https://rahulshettyacademy.com/documents-request');

   await page.goBack();
   await page.goForward();
});