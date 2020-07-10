# Lumberjack

Lumberjack is a project concerned with helping efforts to report and remediate accessibility issues in your applications, and to motivate your team by showing progress over time. It uses [Deque Labs' Axe Puppeteer package](https://github.com/dequelabs/axe-puppeteer) to audit sets of routes and create reports, and [GatsbyJS]{https://www.gatsbyjs.org/} to display this information for review.

## What it does:

Currently, Lumberjack allows you to:

1.  Visits every route provided and runs the Axe tool, creating a report per route with any accessibility violations found.
1.  Consolidates violation data into a set of unique violation reports that can be used for additional auditing or reporting.
2.  Loads this violation data in a simple web client that provides content for remediation tickets and shows progress over time.

## Setup:

1.  Run `yarn install` in the root directory, followed by `cd client && yarn install`
1.  Add application and route info to the files found in the `./config` folder. We recommend starting small with just a few routes to test your setup.
1.  Run `yarn lumberjack` in the root directory. This will present some options. At minimum to get things to work properly, you'll need to run (in this order):

- Generate a11y reports for routes
- Combine and tally report data

At this point, Axe will crawl your routes and generate reports. Please note this can take some time for larger sites, but the terminal will keep you updated about progress as it runs.

Once those two tasks have been completed successfully, you can run the client to display the results by running `cd client && yarn start` from root. A browser window should open showing you your results. Happy testing!
