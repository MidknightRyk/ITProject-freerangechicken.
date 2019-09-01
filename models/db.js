const mongoose = require('mongoose');

// copy from CONNECT (MongoDB Atlas)
const dbURI =
'mongodb+srv://freerangechickenfeed:VUg9yKSDNbo4y6Xt@family-archive-oq23u.mongodb.net/test?retryWrites=true&w=majority';

const options = {
	useNewUrlParser: true,
	dbName: 'Database'
};

mongoose.connect(dbURI, options).then(
 () => {
	console.log('Database connection established!');
},
 err => {
	console.log('Error connecting Database instance due to: ', err);
});

require('./user.js');
require('./artifact.js');
