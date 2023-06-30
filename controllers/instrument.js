const Instrument = require("../models/instrument");
const { getInstrumentByIdPromise, getAllInstrumentsPromise, checkForInstrumentExistsWithNamePromise, createInstrumentPromise, updateInstrumentPromise, deleteInstrumentPromise, buyInstrumentPromise, sellInstrumentPromise } = require("../services/instrument-service");


exports.getInstrumentById = async (req, res, next, id) => {

    try
    {
        let instrument = await getInstrumentByIdPromise(id);
        req.instrument = instrument;
        next();
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}



exports.getInstrument = (req, res) => {
  return res.status(200).json(req.instrument)
}



exports.getAllInstruments =  async (req, res) => {

    try
    {
        let instruments = await getAllInstrumentsPromise()
        return res.status(200).json(instruments)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }

}


exports.checkForInstrumentExistsWithName = async (req, res, next) => 
{
    try
    {
        let instrument = await checkForInstrumentExistsWithNamePromise(req.body.instrument_name)
        next();
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }

}

exports.createInstrument = async (req, res) => {


    let instrument = new Instrument(req.body.instrument_name, req.body.ltp, req.body.type)

    // Validations
    if(instrument.isInstrumentDetailsValid())
    {
        try
        {
            let createdInstrumentMsg = await createInstrumentPromise(instrument)
            return res.status(201).json(createdInstrumentMsg)

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
            error: instrument.getErrorDetails()[0]
        })
    }
}



exports.updateInstrument = async (req, res) => {

    let obj = req.body
    let instrument = new Instrument(obj.instrument_name, obj.ltp, obj.type)
    let reqInstrument = req.instrument

    if(instrument.isInstrumentDetailsValid())
    {
        try
        {
            let updatedInstrumentMsg = await updateInstrumentPromise(reqInstrument, instrument)
            return res.status(200).json(updatedInstrumentMsg)

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
            error: instrument.getErrorDetails()[0]
        })
    }

}



exports.deleteInstrument = async (req, res) => {

    let instrument = req.instrument;

    try
    {
        let deletedInstrumentMsg = await deleteInstrumentPromise(instrument)
        return res.status(200).json(deletedInstrumentMsg)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}


exports.buyInstrument =  async(req, res) => {

    try
    {
        let result = await buyInstrumentPromise(req.user, req.instrument, req.body.qty)
        return res.status(200).json({
            message: result
        })
    }
    catch(error)
    {
        return res.status(400).json({
            error: "An error occured"
        })
    }
 
}

exports.sellInstrument = async (req, res) => {

    try
    {
        let result = await sellInstrumentPromise(req.user, req.instrument, req.body.qty)
        return res.status(200).json({
            message: result
        })
    }
    catch(errorMsg)
    {
        return res.status(400).json({
            error: errorMsg.message
        })
    }

}

