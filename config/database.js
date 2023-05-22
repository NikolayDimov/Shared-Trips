const mongoose = require('mongoose');
// We load all models (User and Trip) so that collections can be initialized in one place
require('../models/User');
require('../models/Trip');

// TODO change database according to assignments
const dbName = 'sharedtrip'
// scaffoldDb --> must be change to our database
const CONNECTION_STRING = `mongodb://127.0.0.1:27017/${dbName}`;


module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connection established')

        mongoose.connection.on('error', (err) => {
            console.error('Database connection error');
            console.error(err);
        });

    } catch (err) {
        console.error('Error connecting to database');
        process.exit(1);
    }
};