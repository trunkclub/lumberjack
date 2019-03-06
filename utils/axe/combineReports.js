const fs = require('fs')
const moment = require('moment')
const argv = require('yargs').argv

const testID = argv.testID

if (!testID) {
  console.log('No testID value found. Please provide one.')
  return
}

const auditDirectory = `./server/audits/${testID}`

const prettyRoute = (route) => {
  const splitRoute = route.split('/')

  if (splitRoute[0] === '') {
    const emptyEntry = splitRoute.shift()
  }

  return splitRoute.join('_')
}

function parseFile(fileName) {

  const filePath = auditDirectory + '/' + fileName
  const violations = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  // Boy I bet we could pass this along from the Route information at the start instead
  const routeName = fileName.split('--')[1].replace('.json', '')
  const cleanRoute = prettyRoute(routeName)

  return {
    hasNoViolations: violations.length ? false : true,
    route: cleanRoute,
    violations,
  }
}


fs.readdir(auditDirectory, async(error, files) => {

  if (error) {
    console.log(`There was an error reading the files in ${auditDirectory}: ${error}`)
  }

  const combinedViolations = files.map((fileName) => {
    return parseFile(fileName)
  })

  const uniqueViolations = combinedViolations.find((data) => {
    console.log(data)
  })

  const reportFile = `./server/reports/report-${testID}.json`

  await fs.access(snapshotFolder, fs.constants.F_OK, (error) => {
    if (!error) {
      fs.unlink(reportFile, (error) => {
        console.log(`Report file already exists; deleting and creating fresh file...`)
      })
    }
  })

  // Add check for file so that if it exists already, it gets overridden.
  // Currently, if file exists, nothing actually happens.
  fs.writeFile(
    reportFile,
    JSON.stringify(combinedViolations),
    'utf8',
    (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Report created.')
      }
  })
})

