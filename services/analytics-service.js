const mysql = require("mysql2");
const { topInvestorsConsolidator, topTradingInstrumentsResultsCleaner } = require("../controllers/analytics-helpers");


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rootroot',
    multipleStatements: true,
});


exports.topInvestorsPromise = (limit) => {

    return new Promise ((resolve, reject) => {

        connection.query(`SELECT users.user_id,users.name,users.email,holdings.underlyingValue FROM users RIGHT JOIN holdings ON users.user_id=holdings.user_id ORDER BY users.user_id`,
        (err, results) => {
            if(err || results[0] == undefined)
            {
                reject(new Error("No Investors till now!"))

            }

            let consolidatedList = topInvestorsConsolidator(results, limit)
            resolve(consolidatedList)
        })
    })

    
}


exports.topTradingInstrumentsPromise = (limit) => {

    return new Promise ((resolve, reject) => {
        let sqlQuery = `SELECT transactions.instrument_id, COUNT(transactions.instrument_id),instruments.instrument_name FROM transactions LEFT JOIN instruments ON transactions.instrument_id=instruments.instrument_id GROUP BY transactions.instrument_id ORDER BY COUNT(transactions.instrument_id) DESC`
        if(limit) sqlQuery = sqlQuery + ' LIMIT ' + limit;
        connection.query(sqlQuery,
        [limit],
        (err, results) => {
            if(err || results[0] == undefined)
            {
                reject(new Error("No Instruments traded till now!"))
            }
            results = topTradingInstrumentsResultsCleaner(results)
            resolve(results)
        })
    })

}



connection.query('USE stocks;',(err, results) => {
    if(err){
        console.error('ERROR USING DB: ' + err.stack)
        return;
    } 
})

