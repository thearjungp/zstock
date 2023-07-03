

exports.topInvestorsConsolidator = (holdings, limit) => {

    // console.log(holdings)

    let consolidatedHoldings = holdings.reduce((arr, holding) => {

        if(arr.length > 0 && arr[arr.length-1].user_id == holding.user_id)
        {
            arr[arr.length-1].underlyingValue += holding.underlyingValue;
            return arr;
        }

        arr.push(holding)
        return arr;

    }, [])

    consolidatedHoldings = consolidatedHoldings.filter((h) => h.underlyingValue > 0)
    consolidatedHoldings = this.sortTopInvestorsByDescOrder(consolidatedHoldings, limit)

    return consolidatedHoldings;

}

exports.sortTopInvestorsByDescOrder = (topInvestors, limit) => {
    topInvestors.sort((a, b) => b.underlyingValue - a.underlyingValue)
    topInvestors = topInvestors.slice(0, limit)
    return topInvestors
}


exports.topTradingInstrumentsResultsCleaner = (topTradingInstruments) => {
    topTradingInstruments = topTradingInstruments.map((o) => {
        o['no_of_transactions'] = o['COUNT(transactions.instrument_id)']
        delete o['COUNT(transactions.instrument_id)'];
        return o;
    })

    return topTradingInstruments;
}