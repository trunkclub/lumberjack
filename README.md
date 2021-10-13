# Lumberjack

Lumberjack is designed to help identify and remediate accessibility issues in your applications, and motivate your team by showing progress over time. It uses [Deque Labs' Axe Puppeteer package](https://www.npmjs.com/package/@axe-core/puppeteer) to audit sets of routes and create reports, and [GatsbyJS](https://www.gatsbyjs.org/) to display this information for review.

## What it does:

Lumberjack's auditing utilities:

- Visit every route provided in your config file and runs the Axe tool, creating a report per route with any accessibility violations found.
- Consolidate violation data into a set of unique violation reports that can be used for additional auditing or reporting.

Lumberjack's client:
- Presents this violation data in a set of dashboards.
- Provides content and context for remediation tickets.
- Helps show the "accessibility health" of your app over time.

## Setup:

1.  Run `yarn setup` in the root directory.

1.  Copy or rename the `./example.lsconfig.js` file so you have a `./.ljconfig.js` file. Then edit it to suit your application's needs. We recommend starting small with just a few routes to test your setup.

1. Run `yarn lumberjack` and select `Run full audit`. This will check every route on every feature, and combine any violations found into a unique violation report. Please note this can take some time for larger sites, but the terminal will keep you updated about progress as it runs.

1. Once that completes successfully, you can start up the client locally to view the results by running `cd client && yarn start` from root. A browser window will open showing your dashboard. Happy testing!

## Additional CLI Options

### Running Individual Tasks

There are two main tasks that need to run to provide the client with enough data to display:

1. auditing all the routes and generating per-route reports, and
1. generating unique violation data based on those reports

You may find situations where running one or both individually are needed, so they can be run independently with the following:

**If you need to generate unique violation data for a particular report ID:**
1. Run `yarn lumberjack`.
1. Select `Run individual tasks`.
1. Select `Generate unique violation data`. You'll be prompted with report IDs based on the date the report was run.

**If you need to run an audit on a specific feature or all features:**
1. Run `yarn lumberjack`.
1. Select `Run individual tasks`.
1. select `Generate per-route feature reports`. 

PLEASE NOTE: If you select this option you'll ALSO need to run `Generate unique violation data` after for that data to be available to the client.

### Viewing an Audit Summary

You can also quickly view the audit summary of any available report ID by running `yarn lumberjack` and selecting `Get audit summary for a report ID`.

## Automated runs

If you would like to set up Lumberjack to run via some kind of automated means (e.g. in a CI/CD pipeline), you can leverage `yarn automated-audit` to do so. You can also pass in if you would like to capture screenshots with this script by adjusting the `auditSettings` config settings in your `.ljconfig.js` file.

## Upgrading to v 2.0.0+

Version 2+ of Lumberjack include changes that adjust the structure of the data to both more closely mirror Axe's and to adjust the naming of `byElement` unique data. While none of these changes will impact any legacy report data you currently have saved, they do impact your most recent unique violation data.

You can update you project's report data by following these steps for each report ID:

- Run `yarn lumberjack`
- Select `Run individual tasks`
- Select `Generate unique violation data`
- Select report ID

## Versioning

Lumberjack uses [semantic versioning](https://semver.org/). To help keep this dependable, the project uses [commitizen](https://github.com/commitizen/cz-cli) and [semantic-release](https://github.com/semantic-release/semantic-release) to automate versioning updates, and [GitHub Releases](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/about-releases) to document changes. 

## FAQs / Gotchas / Common Issues

### How can I check what's loading on my routes?

Lumberjack runs in headless mode by default, which means no browser is launched and everything runs behind the scenes. This also means everything is hidden from you.

If you'd like to see everything that is loaded as Lumberjack runs, turn off headless running via the CLI. This will launch an automated browser and you can review things as they are checked in real time. You can also enable screenshots via the CLI to see what the auditing tool "sees" as it is running.

### I get an error for every route when I try to run my audit

An error like the following:

```bash
Error: failed to find element matching selector [your mainElement value]
```
can appear if your application or website requires some kind of authorization to view with headless tools like Lumberjack. You may need to be connected to your organization's VPN to run tests in headless mode.

Work will be done to make this cause-and-effect more clear in the future.
