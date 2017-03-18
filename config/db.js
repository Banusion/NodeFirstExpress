
let mysql  = require('mysql')
let config = require('config')
let connection = mysql.createConnection({
  host     : config.get('dbhost'),
  user     : config.get('dbuser'),
  password : config.get('dbpass'),
  database : config.get('database')
});
 
connection.connect()

module.exports = connection