const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userController = require("../controllers/userController");

router.post('/register',userController.createUser)

router.post('/login',userController.login)



module.exports = router;
