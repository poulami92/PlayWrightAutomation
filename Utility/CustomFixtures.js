const base = require('@playwright/test')

exports.customTest=base.test.extend(
    {
        loginData:
        {

            "userEmail": "Gpd@gmail.com",
            "userPassword": "Kolkata@1",
            "product": "ADIDAS"

        }
    }
)
