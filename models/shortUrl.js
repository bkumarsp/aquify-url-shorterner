const mongoose = require('mongoose')
const shortid = require('shortid'); // library to generate a unique id for url


//Utility method to create random url string
/** 
function newShortUrl(){
    var s_url = Math.random().toString(36).slice(2)
    return s_url
}
*/

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
        default: "example@unkown.com"
    }

})


module.exports = mongoose.model('shortUrl', shortUrlSchema);