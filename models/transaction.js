
class Transaction
{
    transaction_id;
    underlyingValue = 0;
    constructor(holding_id, user_id, instrument_id, qty, boughtAtPrice)
    {
        this.holding_id = holding_id;
        this.user_id = user_id;
        this.instrument_id = instrument_id;
        this.date = this.#dateInSQLFormat();
        this.qty = qty
        this.boughtAtPrice = boughtAtPrice;
        this.underlyingValue = this.qty * this.boughtAtPrice;
    }

    #dateInSQLFormat()
    {
        let d = new Date()
        let sqld = `${d.getFullYear()}-${this.#numFormatter(d.getMonth())}-${this.#numFormatter(d.getDay())}`
        return sqld;
    }

    #numFormatter (myNumber)
    {
       return ("0" + myNumber).slice(-2);
    }
}

module.exports = Transaction