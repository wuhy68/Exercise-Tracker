const mongoose = require('mongoose');

const user = new mongoose.Schema({
    userName: String,
    userId: String
});

module.exports = mongoose.model('User', user);