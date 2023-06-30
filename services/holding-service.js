
const Holding = require("../models/holding");
const mysql = require("mysql2");
const insertPredefinedValues = require("../index").insertPredefinedValues;
const Transaction = require("../models/transaction");
const transactionService = require("./transaction-service");
const instrumentService = require("./instrument-service");

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rootroot',
    multipleStatements: true,
});

exports.getHoldingByIdPromise = (id) => {

    return new Promise ((resolve, reject) => {

        connection.query(`SELECT * FROM holdings WHERE holding_id=?`,
        [id],
        (err, results) => {
            if(err || results[0] == undefined)
            {
                reject(new Error("Unable to find the holding with the given id"))

            }
            resolve(results[0])
        })
    })

}

exports.getAllHoldingsPromise = () => {

    return new Promise ((resolve, reject) => {
        
        connection.query(`SELECT * FROM holdings`,
        (err, results) => {
            if(err)
            {
                reject(new Error(err))
               
            }
            resolve(results);
        })
    })
}

exports.createHoldingPromise = (holding) => {

  return new Promise((resolve, reject) => {

    connection.query(`INSERT INTO holdings(user_id, instrument_id) VALUES (?, ?)`,
    [holding.user_id, holding.instrument_id],
    (err, results) => {
        if(err){
            reject(new Error("Unable to create a new holding"))
            return;
        }
        // console.log(results)
        resolve(results.insertId);
    })
  })

}

exports.updateHoldingPromise = (holding_id, holding) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE holdings SET qty=?, avg_price=?, underlyingValue=? WHERE holding_id=?`,
        [holding.qty, holding.avg_price, holding.underlyingValue, holding_id],
        (err, results) => {
            if(err){
                reject(new Error("Unable to update the Holding"))
                return;
            }
            resolve({
                message: "holding UPDATED" 
            })
        })
    })

}

exports.deleteHoldingPromise = (holding) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM holdings WHERE holding_id=?`, [holding.holding_id],
        (err, results) => {
            if(err)
            {
                reject(new Error("Unable to delete the holding with given Holding ID"))
                return;
            }
            resolve({
                message: "Holding deleted"
            })
        })
    })    
}


exports.checkUserHasHoldingInInstrumentPromise = (user_id, instrument_id) => {

  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM holdings WHERE user_id=? AND instrument_id=?`,
    [user_id, instrument_id],
    (err, results) => {
      if(err || results[0] == undefined)
      {
        reject(new Error(false))
      } 
      resolve(results[0])
    })
  })

}


exports.createFullHoldingPromise = async (holding, qty) => {

    try
    {
        let createdHoldingId = await this.createHoldingPromise(holding)
        let instrument = await instrumentService.getInstrumentByIdPromise(holding.instrument_id)
        let newTransaction = new Transaction(createdHoldingId, holding.user_id, holding.instrument_id, qty, instrument.ltp)
        let createdTransactionMsg = await transactionService.createTransactionPromise(newTransaction)
        holding.updateHolding(newTransaction.qty, newTransaction.boughtAtPrice)
        let updatedHoldingMsg = await this.updateHoldingPromise(createdHoldingId, holding)
        return updatedHoldingMsg;
    }
    catch(error)
    {
        throw error;
    }
    
}

exports.updateFullHoldingPromise = async (holding, qty) => {

    let existingHolding = new Holding(holding.user_id, holding.instrument_id)
    existingHolding.holding_id = holding.holding_id;
    existingHolding.qty = holding.qty;
    existingHolding.avg_price = holding.avg_price;
    existingHolding.underlyingValue = holding.underlyingValue

    try
    {
        let instrument = await instrumentService.getInstrumentByIdPromise(existingHolding.instrument_id)
        let newTransaction = new Transaction(existingHolding.holding_id, existingHolding.user_id, existingHolding.instrument_id, qty, instrument.ltp)
        let createdTransactionMsg = await transactionService.createTransactionPromise(newTransaction)
        existingHolding.updateHolding(newTransaction.qty, newTransaction.boughtAtPrice)
        let updatedHoldingMsg = await this.updateHoldingPromise(existingHolding.holding_id, existingHolding)
        return updatedHoldingMsg;
    }
    catch (error)
    {
        throw error;
    }

}



let insertPredefinedValsHoldings = () => {

    // TABLE CREATION
    connection.query(`CREATE TABLE IF NOT EXISTS holdings(
        holding_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        instrument_id INT,
        qty INT,
        avg_price FLOAT(10,2),
        underlyingValue FLOAT(10,2))`,
      (err, results) => {
      if(err)
      {
        console.error(err);
        return;
      }
      console.log('HOLDINGS table created')
  
    })
  
}

connection.query('USE stocks;',(err, results) => {
  if(err){
      console.error('ERROR USING DB: ' + err.stack)
      return;
  } 

  // Inserting predefined values for instruments;
  if(insertPredefinedValues)
  {
    insertPredefinedValsHoldings();
  }
})


