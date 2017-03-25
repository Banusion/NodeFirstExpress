let express    = require('express')
let app        = express()
let bodyParser = require('body-parser')
let session    = require('express-session')
let morgan     = require('morgan')
let logger     = require('./models/logger')
let config     = require('config')
const mongoose      = require('mongoose'),
	    autoIncrement = require('mongoose-auto-increment')
let compression = require('compression')

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

app.use(require('./middlewares/flash'))

// Routes
require('./routes')(app);

app.listen(port)
logger.info('LivreOr : http://localhost:' + port)
logger.info('LOADED CONFIG ==> ',config.get('env'))