const express = require('express');
const router = express.Router();

const auditFiles = {
  main: require('../../audits/customer-app/mock.json')
}

/* GET report listing. */
router.get('/', function(request, response, next) {
  response.status(200).json(auditFiles.main);
});

module.exports = router;