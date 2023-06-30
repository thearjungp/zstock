

exports.isAdmin = (req, res, next) => {

    if(req.query.role != 1)
    {
        return res.status(403).json({
            error: "You're not ADMIN, Access denied!"
        })
    }
    next();
}



exports.isMarginSufficientForUser = (req, res, next) => {
    let marginRequired = req.instrument.ltp * req.body.qty;
    if(marginRequired > req.user.available_margin)
    {
        return res.status(400).json({
            message: "Insufficient margin"
        })
    }
    else {
        next();
    }
}