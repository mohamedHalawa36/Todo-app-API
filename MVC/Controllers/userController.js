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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password, email } = req.body;
        const checkUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (checkUser)
            throw new Error("email already exists");
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function (err, hash) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err)
                    next(err);
                const newUser = yield prisma.user.create({
                    data: {
                        email,
                        userName,
                        password: hash,
                        tasks: [],
                    },
                });
                res.status(201).json({ message: "done", newUser });
            });
        });
    }
    catch (error) {
        next(error);
    }
});
module.exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            select: { id: true, password: true, email: true },
            where: { email },
        });
        //check if email exists
        if (!user)
            throw new Error("email not found");
        //check if password match
        const match = yield bcrypt.compare(password, user.password);
        if (!match)
            throw new Error("wrong password");
        //create token
        const token = jwt.sign(user, process.env.SECRET_KEY);
        res.status(200).json({ status: "done", data: { token, userId: user.id } });
    }
    catch (error) {
        next(error);
    }
});
