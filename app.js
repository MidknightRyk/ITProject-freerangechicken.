//Set up express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/index.html'));
  //__dirname : It will resolve to your project folder.
});

// Database setup
require('./models/db.js');

app.use('/', router);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){ console.log(`Express listening on port ${PORT}`);
});
