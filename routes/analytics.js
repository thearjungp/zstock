

const express = require("express");
const { topInvestors, topTradingInstruments } = require("../controllers/analytics");
const router = express.Router();

//routes
router.get("/topinvestors", topInvestors); // query param -> limit
router.get("/toptradinginstruments", topTradingInstruments); // query param -> limit

module.exports = router;