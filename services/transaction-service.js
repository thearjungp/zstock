
const mysql = require("mysql2");
const holdingService = require("./holding-service");
const insertPredefinedValues = require("../index").insertPredefinedValues;

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rootroot',
    multipleStatements: true,
  });


exports.getTransactionByIdPromise = (id) => {
    
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM transactions WHERE transaction_id=?`,
        [id],
        (err, results) => {
            if(err || results[0] == undefined)
            {
                reject(new Error("Unable to find the transaction with the given id"))
            }
            resolve(results[0])
        })
    })
}

exports.getAllTransactionsPromise = () => {

    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM transactions`,
        (err, results) => {
            if(err)
            {
                reject(new Error(err))
            }
            resolve(results);
        })
    })
}

exports.createTransactionPromise = (transaction) => {

    
    return new Promise((resolve, reject) => {


        holdingService.getHoldingByIdPromise(transaction.holding_id)
        .then((holding) => {
            if(holding.user_id == transaction.user_id)
            {

                connection.query(`INSERT INTO transactions(user_id, instrument_id, holding_id, date, qty, boughtAtPrice, underlyingValue)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [transaction.user_id, transaction.instrument_id, transaction.holding_id, transaction.date, transaction.qty, transaction.boughtAtPrice, transaction.underlyingValue],
                (err, results) => {
                    if(err){
                        // console.log(err)

                        reject(new Error("Unable to create a new transaction"))
                        return;
                    }
                    resolve({
                        message: "Transaction CREATED with given details"
                    });
                    return;
                })
            }
            else
            {
                reject(new Error("User does not own the holding with the given holding ID"))
                return;
            }
        })
        .catch((error) => {
            throw error;
        })

    })
        
}


exports.deleteTransactionPromise = (transaction) => {
   
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM transactions WHERE transaction_id=?`, [transaction.transaction_id],
        (err, results) => {
            if(err)
            {
                reject(new Error("Unable to delete the transaction with given transaction ID"))

            }
            resolve({
                message: "Transaction deleted"
            })
        })
    })    
}

exports.getTransactionsByHoldingIdPromise = (holding_id) => {


    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM transactions WHERE holding_id=?`,
        [holding_id],
        (err, results) => {
            if(err || results[0] == undefined)
            {
                reject(new Error("Unable to find the transactions with the given holding id"))
            }
            resolve(results)
        })
    })
}

let insertPredefinedValsTransactions = () => {


    // TABLE CREATION
    connection.query(`CREATE TABLE IF NOT EXISTS transactions(
        transaction_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        instrument_id INT,
        holding_id INT,
        date DATE,
        qty INT,
        boughtAtPrice FLOAT(10,2),
        underlyingValue FLOAT(10,2))`,
      (err, results) => {
      if(err)
      {
        console.error(err);
        return;
      }
      console.log('TRANSACTIONS table created')
  
    })

}

connection.query('USE stocks;',(err, results) => {
  if(err){
      console.error('ERROR USING DB: ' + err.stack)
      return;
  } 

  if(insertPredefinedValues) insertPredefinedValsTransactions();
})