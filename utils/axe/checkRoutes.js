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
        console.log('There was an issue making the audit directory: ' + error)
      })
    }
  })

  const screenshotFolder = `./server/screenshots/${testID}`

  await fs.access(screenshotFolder, fs.constants.F_OK, (error) => {
    if (error) {
      console.log(`Creating screenshot folder for ${testID}...`)
      fs.mkdir(screenshotFolder, (error) => {
        console.log('There was an issue making the screenshot directory: ' + error)
      })
    }
  })

  let completedAudits = []

  console.log('\nRunning audit on ' + appData.routes.length + ' routes...')

  for (let route of appData.routes) {

    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()

    await page.setBypassCSP(true)

    await page.goto('http://localhost:10081/login')

    await page.click('input[type="email"]')
    await page.keyboard.type('gonzoTgreat@testing.com')

    await page.click('input[type="password"]')
    await page.keyboard.type('Test1234')

    await page.click('button[type="submit"]')

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