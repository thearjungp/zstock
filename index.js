
const express = require("express")
const mysql = require("mysql2");
const app = express();
const port = 4444
const bodyParser = require("body-parser")


exports.insertPredefinedValues = false;
// exports.insertPredefinedValues = true;


// MySQL connection
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rootroot',
  multipleStatements: true
});

// MySQL Connection
connection.connect((err) => {
  if(err){
    console.error("CONNECTION ERROR : " + err.stack)
    return;
  }
  connection.query('CREATE DATABASE IF NOT EXISTS stocks; USE stocks;', (err, results) => {
    if(err){
      console.error('UNABLE TO CREATE DB : ' + err.stack)
      return;
    } 
    console.log("DB CONNECTED - stocks");
  });
})


// ROUTES
const userRoutes = require("./routes/user");
const instrumentRoutes = require("./routes/instrument");
const watchlistRoutes = require("./routes/watchlist")
const transactionRoutes = require("./routes/transaction")
const holdingRoutes = require("./routes/holding");



app.use(bodyParser.json());
app.use("/api", userRoutes)
app.use("/api", instrumentRoutes)
app.use("/api", watchlistRoutes)
app.use("/api", transactionRoutes)
app.use("/api", holdingRoutes)



// Server
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`)
})
