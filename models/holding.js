

class Holding
{
    holding_id;
    avg_price = 0;
    qty = 0;
    underlyingValue = 0;

    constructor(user_id, instrument_id)
    {
        this.user_id = user_id;
        this.instrument_id = instrument_id;
    }

    updateHolding(transactionQty, boughtAtPrice)
    {
        this.qty = this.qty + transactionQty;
        if(this.qty != 0) this.avg_price = (this.underlyingValue + (boughtAtPrice * transactionQty))/this.qty;
        else this.avg_price = 0;
        this.underlyingValue = this.avg_price * this.qty 
    }
}

module.exports = Holding