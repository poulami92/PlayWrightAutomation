import { test as base } from '@playwright/test';

// Define fixture types interface
interface LoginDataFixture {
    userEmail: string;
    userPassword: string;
    products: string[];
}

export const customTest = base.extend<{loginData:LoginDataFixture}>({
    loginData: {
        userEmail: "Gpd@gmail.com",
        userPassword: "Kolkata@1",
        products: ["ZARA", "ADIDAS"]
    }
});



