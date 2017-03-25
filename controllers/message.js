"use strict"
const Message = require('../models/message')

//========================================
// GET All Message Route
//========================================
exports.all = function(res) {
    Message.find({
    }, function(err, messages) {
        if (err) {
            return next(err);
        }
        if (messages) {
            return res(messages)
        } else {
        	return res()
        }
    })
}

//========================================
// GET One Message Route
//========================================
exports.find = function(req, res, next) {
    Message.findOne({
        pre_mongified_id: req
    }, function(err, message) {
        if (err) {
            return next(err)
        }
        if (message) {
            return res(message)
        } else {
            return res()
        }
    })
}

//========================================
// Post One Message Route
//========================================
exports.create = function(req, res, next) {
    let newMessage = new Message({
    	content: req,
    })
    newMessage.save(function(err) {
  		if (err) {
			return res()
		} else {
			return res()
		}	
	})
}