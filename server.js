const express = require('express')
const mongoose = require('mongoose')
const shortid = require('shortid')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

var sessionStore = new session.MemoryStore;

const shortURL = require("./models/shortUrl")
const User = require("./models/user") 

const config = require('./config/default.json'); 
const users = require('./routes/api/users')


const db = config.mongouri // Fetching MongoDB URL from config.json
const app = express()

//utitlity methods
const getDomain = (url) => {
    var result
    var match
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result + '/' + shortid.generate()
}


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(passport.initialize())


app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash())

require('./config/passport')(passport)

app.use(users) //app.use("/api/users", users);



mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>
console.log('Connected to database'))
.catch(err=> console.log(err))


var currentUser = 'Guest'
//Routes:
app.get('/register', (req,res)=>{
    res.render('register')
})
app.get('/login', (req,res)=>{
    res.render('login')
})

app.get('/logout', (req, res)=>{
    currentUser = 'Guest'
    res.render('homepage', {currentUser: 'Guest'})
})

app.get('/', (req,res)=>{
    res.render('homepage', {currentUser: currentUser})
})


app.get('/aquaurl/:user', async(req, res) => {
    currentUser = req.params.user
    console.log("Server.js, ", currentUser)

    const short_urls = await shortURL.find({userMail: currentUser})
    var USER = null
    const userData = await User.findOne({email: currentUser})
    console.log('user await', userData)
    if(userData)
        USER = {name: userData.name, email: userData.email}
    else
        console.log('No data found')
    
    if(USER === null)   USER = {name: 'Guest', email:'guest@unkown.in'}
    res.render('index', { shortUrls: short_urls, aquaUser: USER })
})

app.get("/:newUrl", async(req, res) => {

    const newUrl = await shortURL.findOne({ shortUrl: req.params.newUrl })
    if (newUrl == null) {
        return res.sendStatus(404)
    }

    newUrl.clicks++;
    newUrl.save();

    res.redirect(newUrl.fullUrl);
})

app.get("/delete/:id", async(req, res)=>{
    
    let usermail = 'test@test.com'
    shortURL.findByIdAndDelete({_id: req.params.id}, (err, delData)=>{
        usermail = delData.userMail;
        if(err) throw err;
        res.redirect(`/aquaurl/${usermail}`)
    })
})

app.post('/shorterUrls/:email', async(req, res) => {
    const url = req.body.fullUrlString

    // let urlExist = shortURL.findOne({fullUrl: url})
    // let urlShort = null
    // if(urlExist){
    //     urlShort = url.shortUrl
    //     console.log(urlShort)
    // }else{  

    //     await shortURL.create({ fullUrl: url, userMail: currentUser })
    //     urlShort = shortURL.findOne({fullUrl:url})
    // }
    await shortURL.create({ fullUrl: url, userMail: currentUser })
    // req.flash('short_url', urlShort)
    res.redirect(`/aquaurl/${req.params.email}`)
})

app.listen(process.env.PORT || 5555);