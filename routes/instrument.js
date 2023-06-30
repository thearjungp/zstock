
const express = require("express");
const { getInstrumentById, getAllInstruments, getInstrument, createInstrument, updateInstrument, deleteInstrument, checkForInstrumentExistsWithName, inssumma, buyInstrument, sellInstrument } = require("../controllers/instrument");
const { getUserByIdFromQuery } = require("../controllers/user");
const router = express.Router()
const { isAdmin, isMarginSufficientForUser } = require("../controllers/helpers");

// router.param("userId", getUserById)
router.param("instrumentId", getInstrumentById);

//routes
router.get("/instruments", getAllInstruments);
router.get("/instrument/:instrumentId", getInstrument);
router.post("/instrument", isAdmin, checkForInstrumentExistsWithName, createInstrument); // query param -> role
router.put("/instrument/:instrumentId", isAdmin, updateInstrument); // query param -> role
router.delete("/instrument/:instrumentId", isAdmin, deleteInstrument); // query param -> role
router.post("/instrument/:instrumentId/buy", getUserByIdFromQuery, isMarginSufficientForUser, buyInstrument); // query param -> user_id
router.post("/instrument/:instrumentId/sell", getUserByIdFromQuery, sellInstrument); // query param -> user_id

module.exports = router;