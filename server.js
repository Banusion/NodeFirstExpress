let express      = require('express')
    app          = express(),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    morgan       = require('morgan'),
    logger       = require('./models/logger'),
    config       = require('config'),
    passport     = require('passport'),
    compression  = require('compression'),
    flash        = require('connect-flash'),
    cookieParser = require('cookie-parser')
const mongoose      = require('mongoose'),
      autoIncrement = require('mongoose-auto-increment')

// =======================
// configuration =========
// =======================
let port = process.env.PORT || 8069

//db connection
mongoose.Promise = global.Promise
autoIncrement.initialize(mongoose.connect(config.get('database')))

//compression middleware
app.use(compression())

// Moteur de template
app.set('view engine', 'ejs')

// Middleware

// log
// use morgan to log requests to the console
app.use(morgan('combined', {
    "stream": {
        write: function(str) {
            logger.info(str)
        }
    }
}))

//css semantic
app.use('/assets', express.static('public'))

// parse cookie
app.use(cookieParser())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(session({
  secret: config.get('secret'),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// Passport module for autentification
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

//Flash message
app.use(flash())

// Routes
require('./routes')(app, passport)

app.listen(port)
logger.info('LivreOr : http://localhost:' + port)
logger.info('LOADED CONFIG ==> ',config.get('env'))