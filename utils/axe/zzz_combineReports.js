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
  const routeData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const { needsManualCheck, violations } = routeData[0]

  // Boy I bet we could pass this along from the Route information at the start instead
  const routeName = fileName.split('--')[1].replace('.json', '')
  const cleanRoute = prettyRoute(routeName)

  return {
    hasNoViolations: violations.length ? false : true,
    needsManualCheck,
    route: cleanRoute,
    violations,
  }
}

function getUniqueViolations(allRouteData) {

  const classPattern = /(?:(class=(?:["'])(?<=['"]))((?:[\w -])*[^ "']))/g
  const trackedClasses = []
  const uniqueViolations = {}

  for (let routeData of allRouteData) {
    
    if (!routeData.hasNoViolations) {
      
      for (let violation of routeData.violations) {

        for (let node of violation.nodes) {

          const classData = classPattern.exec(node.html)

          if (classData && classData.length >= 2 && classData[2]) {

            const classString = classData[2]

            // TODO: Add check for node_module in class to omit
            // errors found in packages as needed

            const isAlreadyTracked = trackedClasses.find((existing) => {
              return (existing === classString)
            })

            if (!isAlreadyTracked) {

              trackedClasses.push(classString)

              if (!uniqueViolations[violation.id]) {
                uniqueViolations[violation.id] = []
              }

              const data = {
                route: routeData.route,
                violation
              }

              uniqueViolations[violation.id].push(data)
            }
          } else {
            if (!uniqueViolations[violation.id]) {

              const data = {
                route: routeData.route,
                violation
              }

              uniqueViolations[violation.id] = []
              uniqueViolations[violation.id].push(data)
            }
          }
        }
      }
    }
  }

  return uniqueViolations
}


fs.readdir(auditDirectory, async(error, files) => {

  if (error) {
    console.log(`There was an error reading the files in ${auditDirectory}: ${error}`)
  }

  const reportTypes = ['combined', 'unique']

  for (let type of reportTypes) {
    const reportFile = `./server/reports/report-${testID}--${type}.json`

    await fs.access(reportFile, fs.constants.F_OK, (error) => {
      if (!error) {
        fs.unlink(reportFile, (error) => {
          console.log(`Report file already exists; deleting and creating fresh file...`)
        })
      }
    })

    const combinedViolations = files.map((fileName) => {
      return parseFile(fileName)
    })

    let reportContents

    switch (type) {
      case 'unique':
        reportContents = getUniqueViolations(combinedViolations)
        break
      case 'combined':
      default:
        reportContents = combinedViolations
    }

    fs.writeFile(
      reportFile,
      JSON.stringify(reportContents),
      'utf8',
      (error) => {
        if (error) {
          console.log(error)
        } else {
          console.log('Report created.')
        }
    })
  }
})

