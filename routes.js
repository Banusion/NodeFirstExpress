const MessageController = require('./controllers/message'),
      Message = require('./models/message')

module.exports = function(app, passport) {

	// =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', (req, res) => {
        res.render('index.ejs') // load the index.ejs file
    })

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', (req, res) => {
        // render the page and pass in any flash data if it exists
        res.render('login/login.ejs', { message: req.flash('loginMessage') })
    })

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login/signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('login/profile.ejs', {
            user : req.user // get the user out of session and pass to template
        })
    })

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout()
        res.redirect('/')
    })

    // =====================================
    // DISPLAY MESSAGES ====================
    // =====================================
	app.get('/message', isLoggedIn, (req, res) => {
		MessageController.all(function(messages) {
			res.render('message/messages', {messages: messages, alert: req.flash('alert')})
		})
	})
	
	// =====================================
    // DISPLAY ONE MESSAGE =================
    // =====================================
	app.get('/message/:id', isLoggedIn, (req, res) => {
		MessageController.find(req.params.id, function(message) {
			res.render('message/messagedetail', {message: message})
		})
	})

	// =====================================
    // POST MESSAGE ========================
    // =====================================

	app.post('/message', isLoggedIn, (req, res) => {
		if (req.body.message === undefined || req.body.message === '') {
			req.flash('alert', {class:"alert alert-danger", contenu:"Vous n'avez pas posté de message"})
			res.redirect('/message')
		} else {
			MessageController.create(req.body.message, function () {
			req.flash('alert', [{class:"alert alert-success", contenu:"Merci !"}])
			res.redirect('/message')
			})
		}
	})
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
