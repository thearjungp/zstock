

const express = require("express");
const { getHoldingById, getAllHoldings, getHolding, createHolding, updateHolding, deleteHolding } = require("../controllers/holding");
const router = express.Router();

//params
router.param("holdingId", getHoldingById);

//routes
router.get("/holdings", getAllHoldings);
router.get("/holding/:holdingId", getHolding);
router.post("/holding", createHolding); // query param -> user_id, instrument_id
router.put("/holding/:holdingId", updateHolding); // query param -> user_id
router.delete("/holding/:holdingId", deleteHolding); // query param -> user_id

module.exports = router;