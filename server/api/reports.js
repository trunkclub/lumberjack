const express = require('express');
const router = express.Router();

const reports = {
  R02282019: require('../reports/report-02282019.json'),
}

/* GET report listing. */
router.get('/:id', function(request, response, next) {
  response.status(200).json(reports[`R${request.params.id}`]);
});

module.exports = router;