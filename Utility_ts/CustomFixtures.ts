//const base = require('@playwright/test')

import {test} from '@playwright/test';

interface TestDataForLogin
{
   userEmail : string;
   userPassword : string;
   product : string;
}

export const customTest=test.extend<{loginData : TestDataForLogin}>(
    
    {

       loginData:
        {

            "userEmail": "Gpd@gmail.com",
            "userPassword": "Kolkata@1",
            "product": "ADIDAS"
        }
    }
)




