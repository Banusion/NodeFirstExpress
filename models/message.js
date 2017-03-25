"use strict";

const mongoose      = require('mongoose')
	  				  require('mongoose-moment')(mongoose)
const Schema        = mongoose.Schema,
 	  autoIncrement = require('mongoose-auto-increment'),
	  logger        = require('../models/logger'),
	  config        = require('config')

//================================
// Message Schema
//================================
const MessageSchema = new Schema({
    content: {
    	type: String
    },
    pre_mongified_id: {
        type: Number
    },
    created_at: {
        type: 'Moment',
        default: new Date()
    }
}, {
    timestamps: true
})

MessageSchema.plugin(autoIncrement.plugin, { model: 'Message', field: 'pre_mongified_id' })

module.exports = mongoose.model('Message', MessageSchema);