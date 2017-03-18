let express    = require('express')
let app        = express()
let bodyParser = require('body-parser')
let session    = require('express-session')
let morgan     = require('morgan')
let logger     = require('./models/logger')
let config     = require('config')

// =======================
// configuration =========
// =======================
let port = process.env.PORT || 8069

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

app.get('/', (request, response) => {

	let Message = require('./models/message')

	Message.all(function (messages) {

		response.render('pages/index', {messages: messages})

	})
})

app.get('/message/:id', (request, response) => {
	let Message = require('./models/message')
	Message.find(request.params.id, function(message) {
		response.render('messages/show', {message: message})
	})
})

app.post('/', (request, response) => {
	if (request.body.message === undefined || request.body.message === '') {

		request.flash('error', "Vous n'avez pas posté de message")

		response.redirect('/')

	} else {
		
		let Message = require('./models/message')

		Message.create(request.body.message, function () {
		
		request.flash('success', "Merci !")

		response.redirect('/')
		
		})
	}

})

app.listen(port)
logger.info('LivreOr : http://localhost:' + port)
logger.info('LOADED CONFIG ==> ',config.get('env'))