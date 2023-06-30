
const express = require("express");
const { getTransactionById, getAllTransactions, getTransaction, createTransaction, deleteTransaction } = require("../controllers/transaction");
const router = express.Router();

//params
router.param("transactionId", getTransactionById);

//routes
router.get("/transactions", getAllTransactions);
router.get("/transaction/:transactionId", getTransaction);
router.post("/transaction", createTransaction); // query param -> user_id, holding_id, instrument_id
router.delete("/transaction/:transactionId", deleteTransaction);

module.exports = router;