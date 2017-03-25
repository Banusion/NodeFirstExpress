const MessageController = require('./controllers/message'),
      Message = require('./models/message')

module.exports = function(app) {

	app.get('/', function (request, response) {
			MessageController.all(function(messages) {
			response.render('pages/index', {messages: messages})
		})
	})

	app.get('/message/:id', (request, response) => {
		MessageController.find(request.params.id, function(message) {
			response.render('messages/show', {message: message})
		})
	})

	app.post('/', (request, response) => {
		if (request.body.message === undefined || request.body.message === '') {
			request.flash('error', "Vous n'avez pas posté de message")
			response.redirect('/')
		} else {
			MessageController.create(request.body.message, function () {
			request.flash('success', "Merci !")
			response.redirect('/')
			})
		}
	})
}
