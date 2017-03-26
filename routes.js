const MessageController = require('./controllers/message'),
      Message = require('./models/message')

module.exports = function(app, passport) {

	app.get('/message', function (request, response) {
			MessageController.all(function(messages) {
			response.render('message/messages', {messages: messages})
		})
	})

	app.get('/message/:id', (request, response) => {
		MessageController.find(request.params.id, function(message) {
			response.render('message/messagedetail', {message: message})
		})
	})

	app.post('/message', (request, response) => {
		if (request.body.message === undefined || request.body.message === '') {
			request.flash('error', "Vous n'avez pas posté de message")
			response.redirect('/message')
		} else {
			MessageController.create(request.body.message, function () {
			request.flash('success', "Merci !")
			response.redirect('/message')
			})
		}
	})
}
