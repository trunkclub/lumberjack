var express = require('express')
 
const reports = require('./api/reports');

const app = express();
const port = process.env.PORT || 5411;

app.use('/api/reports', reports);

// Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/client/dist'));

app.listen(port, () => console.log(`Listening on port ${port}`));
