const Instrument = require("../models/instrument");
const Holding = require("../models/holding");
const mysql = require("mysql2");
const pinstruments = require("../sample_data/instruments.json");
const pbs = require("../sample_data/buyorsell.json");

const { updateFullHoldingPromise, checkUserHasHoldingInInstrumentPromise, createFullHoldingPromise } = require("./holding-service");
const insertPredefinedValues = require("../index").insertPredefinedValues;
const userService = require("../services/user-service");


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rootroot',
    multipleStatements: true,
  });



  
exports.getInstrumentByIdPromise = (id) => {

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM instruments WHERE instrument_id = ?', [id], (err, results) => {
            if(err || results[0] == undefined)
            {
                reject(new Error("Unable to find instrument with the given id"))
            }
            resolve(results[0]);
        })
    })
    
  
}


exports.getAllInstrumentsPromise = () => {

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM instruments', (err, results) => {
            if(err)
            {
                reject(new Error(err))
            }
            resolve(results)
        })
    })

}


exports.checkForInstrumentExistsWithNamePromise = (instrument_name) => 
{

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM instruments WHERE instrument_name=?', [instrument_name], (err, results) => {
            if(err || results[0] == undefined)
            {
                resolve();
            }
            reject(new Error("Instrument with the given Name already exists"))
          })
    })

}

exports.createInstrumentPromise = (instrument) => {


  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO instruments(instrument_name, ltp, type, ltpchange)
    VALUES (?, ?, ?, ?)`,
    [instrument.instrument_name, instrument.ltp, instrument.type, instrument.ltpchangechange],
    (err, results) => {
        if(err){
            reject(new Error("Unable to create a new instrument"))
        }
        return resolve({
            message: "Instrument CREATED with given details with instrument ID " + results.insertId
        });
    })
  })  
  
}



exports.updateInstrumentPromise = (reqInstrument, instrument) => {

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE instruments SET instrument_name=?, ltp=?, type=?, ltpchange=? WHERE instrument_id=?`,
        [instrument.instrument_name, instrument.ltp, instrument.type, instrument.ltp - reqInstrument.ltp, reqInstrument.instrument_id],
        (err, results) => {
            if(err){

                reject(new Error("Unable to update the instrument"))
            }
            resolve({
                message: "Instrument UPDATED" 
            })
        })
    })

}



exports.deleteInstrumentPromise = (instrument) => {

    return new Promise((resolve,reject) => {
        connection.query(`DELETE FROM instruments WHERE instrument_id=?`, [instrument.instrument_id],
        (err, results) => {
            if(err)
            {
                reject(new Error("Unable to delete the instrument with given instrument ID"))
            }
      
            resolve({
                message: "Instrument deleted"
            })
        })
    })

}

exports.buyInstrumentPromise = async (user, instrument, qty) => {
    try
    {
        let holding = await checkUserHasHoldingInInstrumentPromise(user.user_id, instrument.instrument_id);
        let updatedMsg = updateFullHoldingPromise(holding, qty)
        let toBeDeducted = instrument.ltp * qty
        let updateMargin = await userService.updateUserMarginPromise(toBeDeducted, user)
        return "Updated holding succesffully"
    }
    catch(error)
    {
        let newHolding = new Holding(user.user_id, instrument.instrument_id);
        let createdMsg = createFullHoldingPromise(newHolding, qty)
        let toBeDeducted = instrument.ltp * qty
        let updateMargin = await userService.updateUserMarginPromise(toBeDeducted, user)
        return "Bought succesffully"
    }
}

exports.sellInstrumentPromise = async (user, instrument, qty) => {

    qty = -1 * qty;

    try
    {
        let holding = await checkUserHasHoldingInInstrumentPromise(user.user_id, instrument.instrument_id) 
        if(holding.qty + qty < 0)
        {
            throw new Error ('qty')
        } 

        updateFullHoldingPromise(holding, qty)
        let toBeCredited = instrument.ltp * qty
        let updateMargin = await userService.updateUserMarginPromise(toBeCredited, user)

        return "Sell qty of " + (-qty) + " succesful"
    }
    catch (error)
    {
        if(error.message == 'qty') throw new Error('You cannot sell more qty than your holdings')
        else throw new Error ("You cannot sell a instrument that you don't hold")
    }

}



let insertPredefinedValsInstruments = () => {

    // TABLE CREATION
    connection.query(`CREATE TABLE IF NOT EXISTS instruments(
        instrument_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        instrument_name VARCHAR(30),
        ltp FLOAT(9,2),
        type VARCHAR(10),
        ltpchange FLOAT(10,2))`,
      (err, results) => {
      if(err)
      {
        console.error(err);
        return;
      }
      console.log('INSTRUMENTS table created')
  
    })
  
    // DATA CREATION 
    for(let i of pinstruments)
    {

        let instrument = new Instrument(i.instrument_name, i.ltp, i.type)
        // console.log(instrument)

        connection.query(`INSERT INTO instruments(instrument_name, ltp, type, ltpchange)
        VALUES (?, ?, ?, ?)`,
        [instrument.instrument_name, instrument.ltp, instrument.type, instrument.ltpchange],
        (err, results) =>{
            if(err){
            console.error('Unable to insert predefined instrument values - ' + err)
            return;
            } 
        })
        console.log("Inserted Predefined INSTRUMENT values")
  
    }

    for(let e of pbs)
    {
        setTimeout(async () => {

            try
            {
                let user = await userService.getUserByIdPromise(e.user_id)
                let instrument = await this.getInstrumentByIdPromise(e.instrument_id)
                if(e.action == "BUY")
                {
                    console.log(await this.buyInstrumentPromise(user, instrument, e.qty))
                }
                else if(e.action == "SELL")
                {
                    console.log(await this.sellInstrumentPromise(user, instrument, e.qty))
                }
            }
            catch(error)
            {
                console.log(error.message)
            }

        },500)
        
    }


}

connection.query('USE stocks;',(err, results) => {
    
        if(err){
            console.error('ERROR USING DB: ' + err.stack)
            return;
        } 

        // Inserting predefined values for instruments;
        if(insertPredefinedValues) insertPredefinedValsInstruments();
    }
)
