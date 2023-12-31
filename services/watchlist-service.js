
const mysql = require("mysql2");
const insertPredefinedValues = require("../index").insertPredefinedValues;
const pwatchlists = require("../sample_data/watchlists.json")

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rootroot',
    multipleStatements: true,
});

exports.getWatchlistByIdPromise = (id) => {

    return new Promise ((resolve, reject) => {

        connection.query(`SELECT * FROM watchlists WHERE watchlist_id=?`,
        [id],
        (err, results) => {
            if(err || results[0] == undefined)
            {
                reject(new Error("Unable to find the watchlist with the given id"))
            }
            resolve(results[0])
        })
    })

}

exports.getWatchlistsByUserIdPromise = (user_id) => {
    
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM watchlists WHERE user_id=?`,
        [user_id],
        (err, results) => {
            if(err)
            {
                reject(new Error("Unable to find the watchlists with the given user id"))
            }
            resolve(results)
        })
    })
}

exports.getAllWatchlistsPromise = () => {

    return new Promise ((resolve, reject) => {
        
        connection.query(`SELECT * FROM watchlists`,
        (err, results) => {
            if(err)
            {
                reject(new Error(err))

            }
            resolve(results);
        })
    })
}

exports.createWatchlistPromise = (watchlist) => {

  return new Promise((resolve, reject) => {

    connection.query(`INSERT INTO watchlists(watchlist_name, user_id) VALUES (?, ?)`,
    [watchlist.watchlist_name, watchlist.user_id],
    (err, results) => {
        if(err){
            reject(new Error("Unable to create a new watchlist"))
        }
        return resolve({
            message: "Watchlist CREATED with given details with Watchlist ID " + results.insertId
        });
    })
  })

}

exports.updateWatchlistPromise = (watchlist_id, watchlist) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE watchlists SET watchlist_name=?, user_id=? WHERE watchlist_id=?`,
        [watchlist.watchlist_name, watchlist.user_id, watchlist_id],
        (err, results) => {
            if(err){

                reject(new Error("Unable to update the watchlist"))
            }
            resolve({
                message: "watchlist UPDATED" 
            })
        })
    })

}

exports.deleteWatchlistPromise = (watchlist) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM watchlists WHERE watchlist_id=?`, [watchlist.watchlist_id],
        (err, results) => {
            if(err)
            {
                reject(new Error("Unable to delete the watchlist with given watchlist ID"))
            }
            resolve({
                message: "watchlist deleted"
            })
        })
    })    
}

exports.addInstrumentToWatchlistPromise = (watchlist_id, instrument_id) => {

    return new Promise((resolve, reject) => {

        connection.query(`INSERT INTO watchlist_instruments(watchlist_id, instrument_id) VALUES (?, ?)`,
        [watchlist_id, instrument_id],
        (err, results) => {
            if(err){
                reject(new Error("Instrument already exists in your watchlist"))
                // reject(new Error(err))

            }
            return resolve({
                message: "Instrument added to the Watchlist"
            });
        })
    })

}

exports.removeInstrumentFromWatchlistPromise = (watchlist_id, instrument_id) => {

    return new Promise((resolve, reject) => {

        connection.query(`DELETE FROM watchlist_instruments WHERE watchlist_id=? AND instrument_id=?`,
        [watchlist_id, instrument_id],
        (err, results) => {
            if(err || results.affectedRows == 0){
                reject(new Error("Instrument does not exists in this Watchlist"))
            }
            return resolve({
                message: "Instrument removed from Watchlist"
            });
        })
    })

}



let insertPredefinedValsWatchlists = () => {


    // TABLE CREATION
    connection.query(`CREATE TABLE IF NOT EXISTS watchlists(
        watchlist_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        watchlist_name VARCHAR(20),
        user_id INT)`,
      (err, results) => {
      if(err)
      {
        console.error(err);
        return;
      }
      console.log('WATCHLISTS table created')
  
    })

    connection.query(`CREATE TABLE IF NOT EXISTS watchlist_instruments(
        watchlist_id INT NOT NULL,
        instrument_id INT NOT NULL,
        PRIMARY KEY (watchlist_id, instrument_id))`,
      (err, results) => {
      if(err)
      {
        console.error(err);
        return;
      }
      console.log('WATCHLISTS_INSTRUMENTS table created')
  
    })
  
    // DATA CREATION 
    for(let w of pwatchlists)
    {
        
        connection.query(`INSERT INTO watchlists(watchlist_name, user_id) VALUES (?, ?)`,
        [w.watchlist_name, w.user_id],
        (err, results) =>{
            if(err){
            console.error('Unable to insert predefined watchlist values - ' + err)
            return;
            } 
        })
        console.log("Inserted Predefined WATCHLIST values")
  
    }
}

connection.query('USE stocks;',(err, results) => {
  if(err){
      console.error('ERROR USING DB: ' + err.stack)
      return;
  } 

  // Inserting predefined values for instruments;
  if(insertPredefinedValues) insertPredefinedValsWatchlists();
})


