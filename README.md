# A11y Report

This is a first pass at automating a11y testing of a given app. Tons of this could stand to be automated or cleaned up.

Currently, 58 routes are available for testing for Customer App. This is every route that doesn't leverage a parameter in its URL. Given that, this creates an incomplete audit, but it's somewhere to start.

## What this reporting app does:

Currently, it:

- Runs a test per route and generates a route-specific json file and screenshot of that route
- Combines violation data found in route-specific json files into one report file
- Displays this in an incredibly basic React app that can be copy/pasted into a Paper doc

## Setup:
Running reports depends on the following:
* You've run `npm install` in the root directory and `yarn` in the `app` directory
* Customer App is currently running at `localhost:10081`
* Customer App's login page form fields have been updated with IDs for puppeteer to find:
  * `#login-email`
  * `#login-password`
  * `#login-submit`

- A folder cooresponding to the `testID` you want to use has been created in the `./server/audits` and `./server/screenshots` folders
- No file with the `testID` is currently present in the `./server/reports` folder; if one is present delete it before combining reports

## Commands
Once the above is set up, you can run the following:

_To test routes:_
```js
npm run check-routes --testID=[your test ID]
```

_To combine reports into one file:_
```js
npm run combine-reports --testID=[your test ID]
```

## View Reports:

Viewing reports requires updating the `./server/api/reports.js` file with info for your `testID`

Then, run 
```js
npm run develop
```