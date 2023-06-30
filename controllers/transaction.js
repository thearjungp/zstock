const Transaction = require("../models/transaction")
const { getTransactionByIdPromise, getAllTransactionsPromise, createTransactionPromise, deleteTransactionPromise, getTransactionsByHoldingIdPromise } = require("../services/transaction-service");

exports.getTransactionById = async(req, res, next, id) => {

    try
    {
        let transaction = await getTransactionByIdPromise(id)
        req.transaction = transaction
        next();
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}

exports.getTransaction = (req, res) => {

    return res.status(200).json(req.transaction)
}

exports.getAllTransactions = async (req, res) => {

    try
    {
        let transactions = await getAllTransactionsPromise();
        return res.status(200).json(transactions)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}

exports.createTransaction = async (req, res) => {


    let obj = req.body;
    let transaction = new Transaction(req.query.holding_id, req.query.user_id, req.query.instrument_id, obj.qty, obj.boughtAtPrice)

    try
    {
        let createdTranasctionMsg = await createTransactionPromise(transaction);
        return res.status(201).json(createdTranasctionMsg)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}

exports.deleteTransaction = async (req, res) => {

    let transaction = req.transaction;
    try
    {
        let deletedTransactionMsg = await deleteTransactionPromise(transaction)
        return res.status(200).json(deletedTransactionMsg)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }

}

exports.getTransactionsByHoldingId = async (req, res) => {

    try
    {
        let transactions = await getTransactionsByHoldingIdPromise(req.query.holding_id)
        return res.status(200).json(transactions)

    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
    
}