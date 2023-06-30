

const express = require("express");
const { getUserById, getUser, createUser, updateUser, deleteUser, getAllUsers } = require("../controllers/user");
const router = express.Router();

//params
router.param("userId", getUserById);

//routes
router.get("/users", getAllUsers);
router.get("/user/:userId", getUser);
router.post("/user", createUser);
router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);

module.exports = router;