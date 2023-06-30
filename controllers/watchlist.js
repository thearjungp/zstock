
const Watchlist = require("../models/watchlist");
const { getWatchlistByIdPromise, getAllWatchlistsPromise, createWatchlistPromise, updateWatchlistPromise, deleteWatchlistPromise } = require("../services/watchlist-service");

exports.getWatchlistById = async (req, res, next, id) => {

    try
    {
        let watchlist = await getWatchlistByIdPromise(id)
        req.watchlist = watchlist
        next();
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }

}

exports.getWatchlist = (req, res) => {
    return res.status(200).json(req.watchlist)
}



exports.getAllWatchlists = async (req, res) => {

    try
    {
        let watchlists = await getAllWatchlistsPromise()
        return res.status(200).json(watchlists)
    }  
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
    
}


exports.createWatchlist = async (req, res) => {

    

    if(req.query.user_id)
    {
        let watchlist = new Watchlist(req.body.watchlist_name, req.query.user_id)

        try
        {
            let createdHoldingMsg = await createWatchlistPromise(watchlist)
            return res.status(201).json(createdHoldingMsg)
        }
        catch(errorObj)
        {
            return res.status(400).json({
                error: errorObj.message
            })
        }
    }
    else
    {
        return res.status(400).json({
            error: "user_id not valid"
        })
    }

 
}


exports.updateWatchlist = async (req, res) => {



    let obj = req.body;
    let watchlist = new Watchlist(obj.watchlist_name, req.query.user_id)

    if(req.query.user_id == req.watchlist.user_id)
    {

        try
        {
            let updatedWatchlistMsg = await updateWatchlistPromise(req.watchlist.watchlist_id, watchlist)
            return res.status(201).json(updatedWatchlistMsg)
        }
        catch(errorObj)
        {
            return res.status(400).json({
                error: errorObj.message
            })
        }
    }
    else
    {
        return res.status(400).json({
            error: "You cannot edit other's watchlist"
        })
    }

}


exports.deleteWatchlist = async (req, res) => {



    let watchlist = req.watchlist

    if(watchlist.user_id == req.query.user_id)
    {
        try
        {
            let deletedWatchlistMsg = await deleteWatchlistPromise(watchlist)
            return res.status(200).json(deletedWatchlistMsg)
        }
        catch(errorObj)
        {
            return res.status(400).json({
                error: errorObj.message
            })
        }
    }
    else
    {
        return res.status(400).json({
            error: "You cannot delete other's watchlist"
        })
    }  
}
