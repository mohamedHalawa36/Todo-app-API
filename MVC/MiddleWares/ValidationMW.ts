import { NextFunction, Request, Response } from "express";

const { body, validationResult,param } = require("express-validator");
module.exports = function (req:Request, res:Response, next:NextFunction) {
  let result = validationResult(req);
  if (result.errors.length != 0) {
    let errorString = result.errors.reduce((current:string, errorObj:ValidationError) => {
      return current + errorObj.msg + " , ";
    }, "");
    let error:ServerError = new Error(errorString);
    error.status = 422;
    next(error);
  } else {
    next();
  }
};

module.exports.createUserValidations = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please enter a valid email"),
  body("userName")
    .notEmpty()
    .withMessage("user name is required")
    .isString()
    .withMessage("user name should be a string"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%^&*()-_+=])[A-Za-z0-9!@#\$%^&*()-_+=]{8,}$/
    )
    .withMessage(
      "password should be at least 8 characters, containing a capital letter and a number and a special character"
    ),
];

module.exports.loginValidations = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please enter a valid email"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%^&*()-_+=])[A-Za-z0-9!@#\$%^&*()-_+=]{8,}$/
    )
    .withMessage(
      "password should be at least 8 characters, containing a capital letter and a number and a special character"
    ),
];

module.exports.todoValidations = [
  body("id").notEmpty().withMessage("id is required").isString().withMessage("id should be UUID string"),
  body("title").notEmpty().withMessage("title is required").isString().withMessage("the title should be a string"),
  body("done").notEmpty().withMessage("done flag is required").isBoolean().withMessage("done property should be a boolean"),
];

module.exports.deleteTaskValidation = body("taskId").isString().withMessage("task id should ve a string").notEmpty().withMessage("task id is required")
module.exports.paramUserIdValidation = param("id").isMongoId().withMessage("user id should be ObjectId type")