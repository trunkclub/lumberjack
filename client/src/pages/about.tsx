import React from 'react'

import Layout from '../components/Layout'
import { Heading, Text } from '../pattern-library'

const AboutPage = () => (
  <Layout>
    <h1>About Lumberjack and Automated Accessibility Testing</h1>
    <Text variant="body" as="p">Lumberjack can help efforts to report and remediate accessibility issues in your applications, and to motivate your team by showing progress over time. Under the hood it uses Puppeteer and <a href="https://www.deque.com/axe/">Deque System's Axe engine</a> to create accessibility reports, and GatsbyJS to display this information for review. Please visit <a href="https://github.com/trunkclub/lumberjack">the project on GitHub</a> to learn more and see how you can contribute!</Text>
    <h2>Limitations of Automated Accessibility Testing</h2>
    <Text variant="body" as="p">It's important to have realistic expectations about what automated accessibility testing can detect. Most tooling can catch somewhere in the range of 20-30% of issues. The Axe engine used by Lumberjack <a href="https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/">has reported a higher rate</a>, but is still below 60%.Because of this, data found here should not be seen as a complete picture of accessibility in your app.</Text>
    <Text variant="body" as="p">Given all this, manual testing is critical to making sure your app works well for all your users. <a href="https://blog.usablenet.com/quick-guide-to-manual-accessibility-testing-and-why-its-important">Here is a guide</a> to help get you started with manual testing, and why doing so is important. Lumberjack can help your team remediate existing issues and be alerted to sudden shifts in violation numbers, but the hope is it also buys your team more time to spend on manual testing.</Text>

    <h2>Impact Levels and Violation Data</h2>
    <Text variant="body" as="p">The data available on this site was created with Deque System's <a href="https://www.deque.com/axe/">Axe engine</a>, which provides an <b>impact level</b> for every issue it finds. These take into account how a user is impacted by the issue, and are ranked in the following way:</Text>
      <ol>
        <li><b>Critical</b></li>
        <li><b>Serious</b></li>
        <li><b>Moderate</b></li>
        <li><b>Minor</b></li>
      </ol>
      <h3>What are these levels based on?</h3>
      <Text variant="body" as="p">Axe checks several <a href="https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md">violation guideleines and best practices</a> to arrive at these impact levels, and can highlight issues that may be missed by just checking WCAG alone.</Text>
  </Layout>
)

export default AboutPage
