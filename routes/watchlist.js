

const express = require("express");
const { getWatchlistById, getAllWatchlists, getWatchlist, createWatchlist, updateWatchlist, deleteWatchlist, getWatchlistsByUserId, addInstrumentToWatchlist, removeInstrumentFromWatchlist } = require("../controllers/watchlist");
const router = express.Router();

//params
router.param("watchlistId", getWatchlistById);

//routes
router.get("/watchlists", getAllWatchlists);
router.get("/watchlist/:watchlistId", getWatchlist);
router.get("/watchlist", getWatchlistsByUserId); // query param -> user_id
router.post("/watchlist", createWatchlist); // query param -> user_id
router.put("/watchlist/:watchlistId", updateWatchlist); // query param -> user_id
router.delete("/watchlist/:watchlistId", deleteWatchlist); // query param -> user_id

router.post("/watchlist/addinstrument/:watchlistId", addInstrumentToWatchlist); // query param -> instrument_id, user_id
router.delete("/watchlist/removeinstrument/:watchlistId", removeInstrumentFromWatchlist); // query param -> instrument_id, user_id



module.exports = router;