

const express = require("express");
const { getWatchlistById, getAllWatchlists, getWatchlist, createWatchlist, updateWatchlist, deleteWatchlist } = require("../controllers/watchlist");
const router = express.Router();

//params
router.param("watchlistId", getWatchlistById);

//routes
router.get("/watchlists", getAllWatchlists);
router.get("/watchlist/:watchlistId", getWatchlist);
router.post("/watchlist", createWatchlist); // query param -> user_id
router.put("/watchlist/:watchlistId", updateWatchlist); // query param -> user_id
router.delete("/watchlist/:watchlistId", deleteWatchlist); // query param -> user_id

module.exports = router;