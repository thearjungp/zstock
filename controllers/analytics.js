const { topInvestorsPromise, topTradingInstrumentsPromise } = require("../services/analytics-service");


// List of users with more investment
exports.topInvestors = async (req, res) => {

    try
    {
        let topInvestors = await topInvestorsPromise(req.query.limit);
        return res.status(200).json(topInvestors)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}


// List of instruments with more transactions
exports.topTradingInstruments = async (req, res) => {

    try
    {
        let topTradingInstruments = await topTradingInstrumentsPromise(req.query.limit);
        return res.status(200).json(topTradingInstruments)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
    
}


