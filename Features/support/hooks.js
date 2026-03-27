import playwright from 'playwright';
import {PageObjectFactory} from '../../PageObjects/PageObjectFactory.js';
import {Before,After,BeforeStep,AfterStep,Status} from '@cucumber/cucumber';

Before(async function(){

    this.browser= await playwright.chromium.launch({
    headless:false
});
const browserContext = await this.browser.newContext();
this.page = await browserContext.newPage();
this.pageObjectFactory = new PageObjectFactory(this.page);

})

Before({tags:'@foo'},function(){

    console.log('runs only for foo tag')
})

BeforeStep(async function()
{
  //execute before each step
})

AfterStep(async function()
{
    //execute after each step
})

After(async function({result}){
    console.log('Clearing test data')

    if(result.status===Status.FAILED)
    {
      await this.page.screenshot({path:'failedCucumber.png'})
    }
    if (this.browser) {
        await this.browser.close();
    }
})
