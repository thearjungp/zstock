
const User = require("../models/user");
const { getUserByIdPromise, getAllUsersPromise, createUserPromise, updateUserPromise, deleteUserPromise } = require("../services/user-service");


  
exports.getUserById = async (req, res, next, id) => {

    try
    {
        let user = await getUserByIdPromise(id)
        req.user = user;
        next();
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
    
}

exports.getUserByIdFromQuery = async (req, res, next) => {

    try
    {
        let user = await getUserByIdPromise(req.query.user_id);
        req.user = user;
        next();
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}



exports.getUser = (req, res) => {
    return res.status(200).json(req.user)
}



exports.getAllUsers = async (req, res) => {

    try
    {
        let users = await getAllUsersPromise()
        return res.status(200).json(users)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}



exports.createUser = async (req, res) => {

    let obj = req.body;
    let user = new User(obj.name, obj.email, obj.phone, obj.pan, obj.acnt_number, obj.role, obj.available_margin)

    // Validations
    if(user.isUserDetailsValid())
    {

        try
        {
            let createdUserMsg = await createUserPromise(user);
            return res.status(201).json(createdUserMsg)
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
            error: user.getErrorDetails()[0]
        })
    }
}



exports.updateUser = async (req, res) => {

    let obj = req.body;
    let user = new User(obj.name, obj.email, obj.phone, obj.pan, obj.acnt_number, obj.role, obj.available_margin)

    if(user.isUserDetailsValid())
    {
        try
        {
            let updatedUserMsg = await updateUserPromise(req.user.user_id, user)
            return res.status(201).json(updatedUserMsg)
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
            error: user.getErrorDetails()[0]
        })
    }
    
}



exports.deleteUser = async (req, res) => {

    let user = req.user;

    try
    {
        let deletedUserMsg = await deleteUserPromise(user)
        return res.status(200).json(deletedUserMsg)
    }
    catch(errorObj)
    {
        return res.status(400).json({
            error: errorObj.message
        })
    }
}