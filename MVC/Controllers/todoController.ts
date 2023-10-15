import { NextFunction, Request, Response } from "express";

export {};
const prisma = require("../../prisma");

module.exports.getUserTodos = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      select: { tasks: true },
      where: { id },
    });
    if (!user) throw new Error("User not found");
    res.status(200).json({ status: "done", todos: user.tasks });
  } catch (error) {
    next(error);
  }
};

module.exports.addTodo = async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;
  const { title, done, id: todoId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { tasks: true },
    });
    if (!user) throw new Error("User not found");
    user.tasks.push({ title, done, id: todoId });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        tasks: user.tasks,
      },
    });
    if (!updatedUser) throw new Error("failed to add todo");
    res.status(200).json({ status: "done", updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.updateTodo = async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;
  const { id: todoId, done, title } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { tasks: true },
    });
    if (!user) throw new Error("User not found");
    const task = user.tasks.find((task:Task) => task.id === todoId);
    if (!task) throw new Error("Task not found");

    task.done = done;
    task.title = title;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        tasks: user.tasks,
      },
    });
    res.status(200).json({ status: "done", updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteTodo = async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;
  const { taskId } = req.body;
  console.log(id, taskId);
  const user = await prisma.user.findUnique({
    where: { id },
    select: { tasks: true },
  });
  if (!user) throw new Error("User not found");
  const { tasks } = user;
  console.log(tasks);
  // const deletedTask = tasks.find((task) => task.id === taskId);
  const newTasks = tasks.filter((task:Task) => task.id !== taskId);
  console.log(newTasks);
  const newUserTasks = await prisma.user.update({
    where: { id },
    select: { tasks: true },
    data: { tasks: newTasks },
  });
  if (!newUserTasks) throw new Error("Failed to update");
  res.status(200).json({ status: "done", newUserTasks });
};
