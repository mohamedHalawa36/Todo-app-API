export {};
const express = require("express");
const { login, register } = require("../Controllers/userController");
const {
  createUserValidations,
  loginValidations,
} = require("../MiddleWares/ValidationMW");
const validationMW = require("../MiddleWares/ValidationMW");
const router = express.Router();

router.route("/login").post(loginValidations, validationMW, login);
router.route("/register").post(createUserValidations, validationMW, register);

module.exports = router;
