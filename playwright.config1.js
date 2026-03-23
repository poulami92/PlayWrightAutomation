// @ts-check
import { chromium, defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  timeout:30000,

  expect: {
    timeout:5000,
  },
 
  reporter: 'html',

  retries : 1,

  workers : 3,

  projects :[
    {
      name: 'safari', 
      use:  {
  
              browserName: 'webkit',
              headless: false,
              screenshot: 'only-on-failure' ,
              trace: 'retain-on-failure',
              ...devices['iPhone 11 Pro Max']
           }
    },

    {
      name: 'chrome', 
      use:  {
  
              browserName: 'chromium',
              headless: false,
              screenshot: 'only-on-failure' ,
              trace: 'retain-on-failure',
              viewport :{width:720,height:702},
              video: 'retain-on-failure'
           }
    },
  ]


 
});

