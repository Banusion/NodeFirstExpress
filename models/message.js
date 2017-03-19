let logger = require('../models/logger')
let moment = require('../config/moment')
let MongoClient = require("mongodb").MongoClient
let autoIncrement = require("mongodb-autoincrement");
let config     = require('config')

class Message {

	constructor (row) {
		this.row = row
	}

	get id () {
		return this.row.pre_mongified_id
	}

	get content () {
		return this.row.content
	}

	get created_at () {
		return moment(this.row.created_at)
	}

	static create (content, cb ) {
		MongoClient.connect(config.get('mongodb') + config.get('database'), function(error, db) {
			if (error) return logger.info(error)
			autoIncrement.getNextSequence(db, config.get('collection'), function (err, autoIndex) {
				if (err) return logger.info(err)
				let query = {"content": content, "created_at": new Date(),"pre_mongified_id": autoIndex}
				db.collection(config.get('collection')).insert(query, function(err, row) {
					if (err) return logger.info(err)
					cb(row)
				})
			})
		})
	}

	static all (cb) {
		MongoClient.connect(config.get('mongodb') + config.get('database'), function(error, db) {
			if (error) return logger.info(error)
			db.collection(config.get('collection')).find().toArray(function(err, rows) {
				if (err) return logger.info(err)
	        	cb(rows.map((row) => new Message(row)))	
	        })
	    })
	}

	static find (id ,cb) {
		MongoClient.connect(config.get('mongodb') + config.get('database'), function(error, db) {
			if (error) return logger.info(error)	
			let query = {"pre_mongified_id": Number(id)}
			db.collection(config.get('collection')).findOne(query, function(err, rows) {
				if (err) return logger.info(err)
				if (rows != null) {
        			cb(new Message(rows))
        		} else {
        			logger.info('no record')
        			cb()
        		}
        	})	
	    })
	}
}

module.exports = Message