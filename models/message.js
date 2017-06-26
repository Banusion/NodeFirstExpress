"use strict";

const mongoose      = require('mongoose'),
	  Schema        = mongoose.Schema,
 	  autoIncrement = require('mongoose-auto-increment'),
	  logger        = require('../models/logger'),
	  config        = require('config')

require('mongoose-moment')(mongoose)
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
    },
    username: {
        type: String
    }
}, {
    timestamps: false
})

MessageSchema.plugin(autoIncrement.plugin, { model: 'Message', field: 'pre_mongified_id' })

module.exports = mongoose.model('Message', MessageSchema);