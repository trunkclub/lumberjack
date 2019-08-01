# A11y Report

This is a first pass at automating a11y testing of a given app. Tons of this could stand to be automated or cleaned up.

Currently, this application is very Customer App centric, but is being developed with the intent that any application could use it with its own configuration files in place.

### Customer App Coverage

58 routes are available for testing for Customer App. This is every route that doesn't leverage a parameter in its URL. Given that, this creates an incomplete audit, but it's somewhere to start.

## What this app does:

Currently, it:

- Runs a test per route and generates a route-specific json file and screenshot of that route
- Combines violation data found in route-specific json files into one report file

TODOs:
- Display this in an incredibly basic app allows results to be copy/pasted into a Paper doc or Jira ticket

## Setup:
Running reports depends on the following:
* You've run `yarn install` in the root directory
* You've added application and route info to the files found in the `./config` folder

## Commands
Once the above is set up, you can run the following:

_To test routes:_
```js
yarn check-routes
```
To see additional options, like how to run on a single feature or to take screenshots, append with ` --help`


_To combine reports into one file:_
```js
yarn combine-reports
```
