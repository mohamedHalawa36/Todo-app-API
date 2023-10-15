"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma = require("../../prisma");
module.exports.getUserTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma.user.findUnique({
            select: { tasks: true },
            where: { id },
        });
        if (!user)
            throw new Error("User not found");
        res.status(200).json({ status: "done", todos: user.tasks });
    }
    catch (error) {
        next(error);
    }
});
module.exports.addTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, done, id: todoId } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { id },
            select: { tasks: true },
        });
        if (!user)
            throw new Error("User not found");
        user.tasks.push({ title, done, id: todoId });
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: {
                tasks: user.tasks,
            },
        });
        if (!updatedUser)
            throw new Error("failed to add todo");
        res.status(200).json({ status: "done", updatedUser });
    }
    catch (error) {
        next(error);
    }
});
module.exports.updateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { id: todoId, done, title } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { id },
            select: { tasks: true },
        });
        if (!user)
            throw new Error("User not found");
        const task = user.tasks.find((task) => task.id === todoId);
        if (!task)
            throw new Error("Task not found");
        task.done = done;
        task.title = title;
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: {
                tasks: user.tasks,
            },
        });
        res.status(200).json({ status: "done", updatedUser });
    }
    catch (error) {
        next(error);
    }
});
module.exports.deleteTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { taskId } = req.body;
    console.log(id, taskId);
    const user = yield prisma.user.findUnique({
        where: { id },
        select: { tasks: true },
    });
    if (!user)
        throw new Error("User not found");
    const { tasks } = user;
    console.log(tasks);
    // const deletedTask = tasks.find((task) => task.id === taskId);
    const newTasks = tasks.filter((task) => task.id !== taskId);
    console.log(newTasks);
    const newUserTasks = yield prisma.user.update({
        where: { id },
        select: { tasks: true },
        data: { tasks: newTasks },
    });
    if (!newUserTasks)
        throw new Error("Failed to update");
    res.status(200).json({ status: "done", newUserTasks });
});
