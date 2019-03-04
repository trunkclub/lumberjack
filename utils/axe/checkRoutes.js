const { AxePuppeteer } = require('axe-puppeteer')
const puppeteer = require('puppeteer')
const fs = require('fs')

const argv = require('yargs').argv

const appData = require('../constants')

const prettyRoute = (route) => {
  const splitRoute = route.split('/')

  if (splitRoute[0] === '') {
    const emptyEntry = splitRoute.shift()
  }

  return splitRoute.join('_')
}

const writeReport = (testID, cleanRoute, violations) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      `./server/audits/${testID}/axe-audit--${cleanRoute}.json`,
      JSON.stringify(violations),
      'utf8',
      (error, result) => {
        if (error) {
          console.log('There was an issue writing the report.')
          return reject(error)
        } else {
          console.log('Report created.')
          return resolve()
        }
      }
    )
  })
}

;(async () => {

  const testID = argv.testID
  let completedAudits = []

  console.log('\nRunning audit on ' + appData.routes.length + ' routes...')

  for (let route of appData.routes) {

    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()

    await page.setBypassCSP(true)

    await page.goto('http://localhost:10081/login')

    await page.click('#login-email')
    await page.keyboard.type('gonzoTgreat@testing.com')

    await page.click('#login-password')
    await page.keyboard.type('Test1234')

    await page.click('#login-submit')

    await page.waitForNavigation({waitUntil: 'load'})

    const cleanRoute = prettyRoute(route)

    console.log('\nAuditing ' + route + '...')

    await page.goto(
      `http://localhost:10081${route}`,
      { timeout: 6000 }
    ).catch(error => { console.log('Error with route loading.') })

    // this is too delicate.
    await page.waitFor(2000, { timeout: 2000 }).catch(error => {
      console.log('Error with waiting.')
    })

    await page.screenshot({
      path: `./server/screenshots/${testID}/${cleanRoute}.png`,
      fullPage:true,
    }).catch(error => { console.log('Error with screenshot.') })

    await page.waitFor('html').then(async() => {
      await new AxePuppeteer(page).analyze().then(async(results) => {
        if (results.violations && results.violations.length) {
  
          const numberOfViolations = results.violations.length
          
          console.log(`${numberOfViolations} violations found. Writing report...`)
  
          await writeReport(testID, cleanRoute, results.violations)
  
        } else {
          console.log('No violations found!')
        }
      }).catch(error => {
        console.log('No results returned- there may be an issue with this audit.')
        console.log(error)
      })
    }).catch(error => { console.log('Error with waiting.') })

    completedAudits.push(route)
    await page.close()
    await browser.close()
  }

  console.log(`Completed ${completedAudits.length} of ${appData.routes.length} audits.`)

})()