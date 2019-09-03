const mongoose = require('mongoose');

const exercise = new mongoose.Schema({
    username: String,
    userId: String,
    description: String,
    duration: String,
    date: Date
});

module.exports = mongoose.model('Exercise', exercise);