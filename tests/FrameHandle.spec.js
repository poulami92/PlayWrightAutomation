const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

   // creates framelocator to work with frame elements
   const frameLocator=page.frameLocator('#courses-iframe');

   await frameLocator.getByRole('link',{name:'Courses',exact:true}).click();

   await page.locator("input[value='radio1']").click();
   
})