var mysql = require("mysql")
var connection = mysql.createConnection({
  port: "3306",
  host: "localhost",
  user: "root",
  password: "111111",
  database: "stock",
})
connection.connect()

module.exports = connection
