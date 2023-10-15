import { NextFunction, Request, Response } from "express";
type AuthRequest = Request & { decodedToken?: string };
export {};
const jwt = require("jsonwebtoken");
module.exports = (req:AuthRequest, res:Response, next:NextFunction) => {
  try {
    const token = req.get("authorization")?.split(" ")[1];
    if (!token) throw new Error("not authenticated");
    let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) throw new Error("not authenticated");
    req.decodedToken = decodedToken;
    next();
  } catch (error:any) {
    error.status = 401;
    next(error);
  }
};
