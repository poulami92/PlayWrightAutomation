const {test,expect} = require('@playwright/test')

test('DownLoad Palywright test', async function({page})
{
  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
  const downloadPath = 'C:/Users/MSUSERSL123/Downloads/download.xlsx';

  //wait for download event to occur and resolved when both download and button click resolved
  //store resolved download promise into variable
 
  const [download]=await Promise.all(
  [
    page.waitForEvent('download'),
    page.getByRole('button',{name:'Download'}).click()
  ])

  //wait for download object to save as .xlsx file
  await download.saveAs(downloadPath);
   
});

test('Uplaod Palywright test', async function({page})
{
  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
  const downloadPath = 'C:/Users/MSUSERSL123/Downloads/download.xlsx';
  
  await page.locator('#fileinput').setInputFiles(downloadPath)
  await expect(page.getByText('Updated Excel Data Successfully.')).toBeVisible();

  //await page.pause()
   
});