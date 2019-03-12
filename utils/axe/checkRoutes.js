const { AxePuppeteer } = require('axe-puppeteer')
const puppeteer = require('puppeteer')
const fs = require('fs')

const argv = require('yargs').argv

const appRoutes = require('../routes')

// TODO: Move this to env file?
const APP_URL = 'http://localhost:10081'
const USER_EMAIL = 'gonzoTgreat@testing.com'
const PASSWORD = 'Test1234'

const prettyRoute = (route) => {
  const splitRoute = route.split('/')

  if (splitRoute[0] === '') {
    const emptyEntry = splitRoute.shift()
  }

  return splitRoute.join('_')
}

const writeReport = (testID, cleanRoute, violations, needsManualCheck = false) => {
  return new Promise((resolve, reject) => {

    const data = {
      needsManualCheck,
      violations,
    }

    fs.writeFile(
      `./server/audits/${testID}/axe-audit--${cleanRoute}.json`,
      JSON.stringify([data]),
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

  if (!argv.testID) {
    console.log('No testID value found. Please provide one.')
    return
  }

  const testID = argv.testID

  // TODO: Pull these folder checkers into a function

  const auditFolder = `./server/audits/${testID}`

  await fs.access(auditFolder, fs.constants.F_OK, (error) => {
    if (error) {
      console.log(`Creating audit folder for ${testID}...`)
      fs.mkdir(auditFolder, (error) => {
        if (error) {
          console.log('There was an issue making the audit directory: ' + error)
        }
      })
    }
  })

  const screenshotFolder = `./server/screenshots/${testID}`

  await fs.access(screenshotFolder, fs.constants.F_OK, (error) => {
    if (error) {
      console.log(`Creating screenshot folder for ${testID}...`)
      fs.mkdir(screenshotFolder, (error) => {
        if (error) {
          console.log('There was an issue making the screenshot directory: ' + error)
        }
      })
    }
  })

  let completedAudits = []

  console.log('\nRunning audit on ' + appRoutes.routes.length + ' routes...')

  for (let route of appRoutes.routes) {

    const browser = await puppeteer.launch({headless: true})
    const cleanRoute = prettyRoute(route)
    const page = await browser.newPage()

    await page.setBypassCSP(true)

    // === START AUDIT ROUTE === //

    console.log('\nAuditing ' + route + '...')

    await page.goto(
      APP_URL + route,
      { timeout: 3000 }
    ).catch(error => { console.log('Error with initial route loading.') })


    const url = await page.evaluate('location.href').catch(error => { console.log('There was an issue evaluating the route location.') })
    const needsLogin = url.indexOf('/login?url=%2F') >= 0

    if (needsLogin) {

      console.log('Redirected to login screen. Logging in...')

      await page.click('input[type="email"]').catch((error) => {
        console.log('Issue with email field. \n\n' + error)
      })

      await page.keyboard.type(USER_EMAIL)

      await page.click('input[type="password"]').catch((error) => {
        console.log('Issue with password field. \n\n' + error)
      })

      await page.keyboard.type(PASSWORD)

      await page.click('button[type="submit"]').catch((error) => {
        console.log('Issue with submit button. \n\n' + error)
      })

      await page.waitForNavigation({waitUntil: 'load'}).catch((error) => {
        console.log('Issue with navigation. \n\n' + error)
      })

      await page.goto(
        APP_URL + route,
        { timeout: 6000 }
      ).catch(error => { console.log('Error with route loading.') })
    }

    // TODO: See if switching to 
    await page.waitFor(2000, { timeout: 2000 }).catch(error => {
      console.log('Error with waiting.')
    })

    await page.screenshot({
      path: `./server/screenshots/${testID}/${cleanRoute}.png`,
      fullPage:true,
    }).catch(error => { console.log('Error with screenshot.') })

    await page.waitFor('html').then(async() => {

      let violations = []

      await new AxePuppeteer(page).analyze().then(async(results) => {
        if (results.violations && results.violations.length) {
  
          const numberOfViolations = results.violations.length
          
          console.log(`${numberOfViolations} violations found. Writing report...`)
          violations = results.violations
        } else {
          console.log('No violations found!')
        }

        await writeReport(testID, cleanRoute, violations)
      }).catch(async(error) => {
        await writeReport(testID, cleanRoute, violations, true)
        console.log('No results returned- there may be an issue with this audit.')
        console.log(error)
      })
    }).catch(error => { console.log('Error with waiting.') })

    completedAudits.push(route)
    await page.close()
    await browser.close()
  }

  console.log(`Completed ${completedAudits.length} of ${appRoutes.routes.length} audits.`)

})()