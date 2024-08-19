// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   projects: [
//     // {
//     //   name: 'firefox',
//     //   use: { ...devices['Desktop Firefox'] },
//     // },
//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'] },
//     // },
//     {
//       name: 'Google Chrome',
//       use: { ...devices['Desktop Chrome'], channel: 'chrome' },
//     },
//   ],
// });


export default defineConfig({
  projects: [
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: false, // Run in headed mode
        // extraHTTPHeaders: {
        //   'Authorization': 'Bearer YOUR_TOKEN',
        //   'Custom-Header': 'value'
        // },
      },
    },
  ],
});

