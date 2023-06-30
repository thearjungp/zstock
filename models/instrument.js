
class Instrument
{
    ltpchange = 0;
    #errorDetails = [];
    instrument_id;
    constructor(instrument_name, ltp, type)
    {
        this.instrument_name = instrument_name;
        this.ltp = ltp;
        this.type = type;
        this.ltpchange = this.ltp;
    }

    isInstrumentDetailsValid()
    {
        this.#errorDetails = [];
        
        // type validation
        if(!this.#instrumentTypeValidator(this.type)) {
            this.#errorDetails.push('Invalid Instrument type - Provide one of the three values (STOCK, INDEX, DERIVATIVE)')
            return false;
        }

        return true;
    }

    #instrumentTypeValidator(type)
    {
        return type == 'STOCK' || type == 'INDEX' || type == 'DERIVATIVE'
    }

    getErrorDetails()
    {
        return this.#errorDetails;
    }

}

module.exports = Instrument;