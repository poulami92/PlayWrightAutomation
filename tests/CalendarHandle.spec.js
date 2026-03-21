const {test,expect} = require('@playwright/test')

test('Page Palywright test', async function({page})
{

   await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

   let date ='07-05-2028'
   let dateArr=date.split("-");		
	let day = dateArr[0];
	let month = dateArr[1];
	let year = dateArr[2];

   await page.locator('.react-date-picker__inputGroup__year').click();
   await page.locator('.react-calendar__navigation__label__labelText').click();
   await page.locator('.react-calendar__navigation__label__labelText').click();

   await page.getByText(year).click();
   await page.locator('.react-calendar__year-view__months__month').nth(Number(month)-1).click();
   await page.locator('.react-calendar__month-view__days__day abbr').nth(Number(day)-1).click();
   
   const dateValue=await page.locator(".react-date-picker__inputGroup input[type='date']").inputValue();
		//2028-05-05
   let dateValueArr=dateValue.split("-");
	let actualDay = dateValueArr[2];
	let actualMonth = dateValueArr[1];
	let actualYear = dateValueArr[0];

   console.log(actualDay);
   console.log(actualMonth);
   console.log(actualYear);

   // expect(actualDay===day).toBeTruthy();
   // expect(actualMonth===month).toBeTruthy();
   // expect(actualYear===year).toBeTruthy();

   expect(actualDay).toEqual(day);
   expect(actualMonth).toEqual(month);
   expect(actualYear).toEqual(year);
   

   
   
});