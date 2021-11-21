const mongoose = require('mongoose')
const shortid = require('shortid'); // library to generate a unique id for url
const { default: isEmail } = require('validator/lib/isemail');


//Schema of our database
const shortUrlSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: shortid.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: String,
        default: Date.now
    },
    userMail:{
        type: String,
        default: "example@ex.com"
    }

})


module.exports = mongoose.model('shortUrl', shortUrlSchema);