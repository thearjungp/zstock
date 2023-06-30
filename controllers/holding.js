
const Holding = require("../models/holding");
const { getHoldingByIdPromise, getAllHoldingsPromise, createHoldingPromise, deleteHoldingPromise, updateHoldingPromise, createFullHoldingPromise, updateFullHoldingPromise } = require("../services/holding-service");


exports.getHoldingById = async (req, res, next, id) => {

  try
  {
    let holding = await getHoldingByIdPromise(id)
    req.holding = holding
    next();
  }
  catch (errorObj)
  {
    return res.status(400).json({
      error: errorObj.message
    })
  }

}

exports.getHolding = (req, res) => {
  return res.status(200).json(req.holding)
}


exports.getAllHoldings = async (req, res) => {

  try
  {
    let holdings = await getAllHoldingsPromise()
    return res.status(200).json(holdings)
  }
  catch (errorObj)
  {
    return res.status(400).json({
      error: errorObj.message
    })
  }

}


exports.createHolding = async (req, res) => {

  if(req.query.user_id)
  {
    let holding = new Holding(req.query.user_id, req.query.instrument_id)

    try
    {
      let result = await createFullHoldingPromise(holding, req.body.qty)
      return res.status(200).json({
        message: "Holding and transaction created succesfully"
      })
    }
    catch (errorObj)
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

exports.updateHolding = async (req, res) => {

  if(req.query.user_id)
  {
    if(req.query.user_id != req.holding.user_id)
    {
      return res.status(400).json({
        error : "You cannot edit other's holdings"
      })
    }

    try
    {
      let updates = await updateFullHoldingPromise(req.holding, req.body.qty)
      return res.status(200).json({
        message: "Updated Holding and transaction succefully"
      })
    }
    catch (errorObj)
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



exports.deleteHolding = async (req, res) => {

  if(req.query.user_id != req.holding.user_id)
  {
    return res.status(400).json({
      error : "You cannot edit other's holdings"
    })
  }

  try
  {
    let holding = req.holding;
    let deletedHoldingMsg = await deleteHoldingPromise(holding)
    return res.status(200).json(deletedHoldingMsg)
  }
  catch (errorObj)
  {
    return res.status(400).json({
      error: errorObj.message
    })
  }
}



