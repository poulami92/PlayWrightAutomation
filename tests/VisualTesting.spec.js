const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{
  await page.goto('https://www.google.com/');
  expect(await page.screenshot()).toMatchSnapshot('landing.png');
 
});