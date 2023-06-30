
class Watchlist
{
    watchlist_id;
    constructor(watchlist_name, user_id)
    {
        this.watchlist_name = watchlist_name;
        this.user_id = user_id;
    }
}

module.exports = Watchlist