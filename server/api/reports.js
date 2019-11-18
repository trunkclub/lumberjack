const express = require('express')
const router = express.Router()

const auditFiles = {
  unique: require('../../audits/customer-app/uniqueViolations.json'),
  tally: require('../../audits/customer-app/violationTally.json'),
}

/* GET report listing. */
router.get('/unique', (request, response, next) => {
  const uniqueData = auditFiles.unique[0]
  response.status(200).json(uniqueData)
})

router.get('/tally', (request, response, next) => {
  const tallyData = auditFiles.tally
  response.status(200).json(tallyData)
})

module.exports = router
