# Lumberjack

Lumberjack is designed to help identify and remediate accessibility issues in your applications, and motivate your team by showing progress over time. It uses [Deque Labs' Axe Puppeteer package](https://www.npmjs.com/package/@axe-core/puppeteer) to audit sets of routes and create reports, and [GatsbyJS](https://www.gatsbyjs.org/) to display this information for review.

## What it does:

Lumberjack's auditing utilities:

- Visit every route provided in your config files and runs the Axe tool, creating a report per route with any accessibility violations found.
- Consolidate violation data into a set of unique violation reports that can be used for additional auditing or reporting.

Lumberjack's client:
- Presents this violation data in a set of dashboards.
- Provides content and context for remediation tickets.
- Helps show the "accessibility health" of your app over time.

## Setup:

1.  Run `yarn setup` in the root directory.
1.  Copy or rename the `./config_example` folder so you have a `./config` folder.Then edit the `app.json` and `routes.json` files to suit your application's needs. We recommend starting small with just a few routes to test your setup.
1.  Run `yarn lumberjack` in the root directory. This will present some options. To begin, select `Generate a11y reports for routes`. At this point, Axe will crawl your routes and generate reports. Please note this can take some time for larger sites, but the terminal will keep you updated about progress as it runs.

1.  Once that is complete, run `yarn lumberjack` again, and select `Combine and tally report data`. You'll be prompted with report IDs based on the date the report was run. Select the one you just ran, and summary reports will be generated.

1.  Once those two tasks have been completed successfully, you can run the client to display the results by running `cd client && yarn start` from root. A browser window should open showing you your results. Happy testing!

## FAQs / Gotchas / Common Issues

### I don't think my routes are loading like I expect

It's always worth checking things by running Lumberjack in non-headless mode. This will launch an automated browser and you can review things as they are checked in real time. You can also enable screenshots to see what the auditing tool "sees" as it is running.

### I get an error for every route when I try to run my audit

An error like the following:

```
Error: failed to find element matching selector [your mainElement value]
```
can appear if your application or website requires some kind of authorization to view with headless tools like Lumberjack. You may need to be connected to your organization's VPN to run tests in headless mode.

Work will be done to make this cause-and-effect more clear in the future.
