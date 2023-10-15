"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { getUserTodos, addTodo, updateTodo, deleteTodo, } = require("../Controllers/todoController");
const router = express.Router();
const validationMW = require("../MiddleWares/ValidationMW");
router
    .route("/:id/todo")
    .get(validationMW.paramUserIdValidation, validationMW, getUserTodos)
    .post(validationMW.paramUserIdValidation, validationMW.todoValidations, validationMW, addTodo)
    .put(validationMW.paramUserIdValidation, validationMW.todoValidations, validationMW, updateTodo)
    .delete(validationMW.paramUserIdValidation, validationMW.deleteTaskValidation, validationMW, deleteTodo);
module.exports = router;
