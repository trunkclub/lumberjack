# Lumberjack

Lumberjack is a project concerned with helping efforts to report and remediate accessibility issues in our applications. It uses [Deque Labs' Axe Puppeteer package](https://github.com/dequelabs/axe-puppeteer) to audit sets of routes and create reports.

## What this app does:

Currently, it:

1.  Consolidates violations into a set of unique instances that can be tallied for additional reporting
2.  Loads unique violations in a simple web client that provides content for remediation tickets

This application has very Customer App-centric configuration in place, but is being developed with the intent that any application could use it with its own configuration files.

## Setup:

Running reports depends on the following:

-   You've run `yarn install` in the root directory
-   You've added application and route info to the files found in the `./config` folder

Viewing results in the client app requires:

-   The above report steps are done
-   You've run `yarn install` inside the `./app` folder
-   The `yarn check-routes`, `yarn combine-violations:unique` and `yarn combine-violations:tally` commands have been run in root

### Running the Client App

Once all Setup steps have completed, run `yarn develop`, which will start up the project's server and React app in the same terminal window.

## Commands

Once the above is set up, you can run any and all of the following:

`yarn check-routes`
Checks all the routes in the routes config folder. Append with `--help` to see additional settings.

`yarn combine-violations:unique`
_Depends on the reports from `yarn check-routes` being available._
Combines all of the violation data for all routes into one JSON file.

`yarn combine-violations:tally`
_Depends on the reports from `yarn check-routes` being available._
Goes over the data in violation reports and tallies violations found by severity and violation category. This data is then saved to a JSON file.

`yarn get-report-ids`
Logs all available IDs for test data currently available to the console.

`yarn get-tally`
_Depends on the tally data file from `yarn combine-violations:tally` being available._
Logs tally of current unique violations to the console by severity and by violation category.

`yarn full-crawl`
Runs `yarn check-routes` and `yarn combine-violations:unique` in one step.

`yarn develop`
Launches the client to view unique issues found once reports have been run.
