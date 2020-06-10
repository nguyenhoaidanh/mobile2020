const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || process.env.URL_DB_MONGO, connectionOptions, () => {
  console.log('Mongo connected.');
});
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../model/user'),
    Class:require('../model/class'),
    Room:require('../model/room'),
    Session:require('../model/session'),
    Token:require('../model/token'),
};
