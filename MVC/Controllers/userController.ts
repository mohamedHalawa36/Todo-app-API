import { NextFunction, Request, Response } from "express";

export {};
const prisma = require("../../prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports.register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName, password, email } = req.body;
    const checkUser = await prisma.user.findUnique({
      where: { email },
    });
    if (checkUser) throw new Error("email already exists");
    const saltRounds = 10;
    bcrypt.hash(
      password,
      saltRounds,
      async function (err: Error | null, hash: string) {
        if (err) next(err);
        const newUser = await prisma.user.create({
          data: {
            email,
            userName,
            password: hash,
            tasks: [],
          },
        });
        res.status(201).json({ message: "done", newUser });
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      select: { id: true, password: true, email: true },
      where: { email },
    });
    //check if email exists
    if (!user) throw new Error("email not found");
    //check if password match
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("wrong password");
    //create token
    const token = jwt.sign(user, process.env.SECRET_KEY);
    res.status(200).json({ status: "done", data: { token, userId: user.id } });
  } catch (error) {
    next(error);
  }
};
