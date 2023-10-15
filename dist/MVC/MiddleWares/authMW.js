"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.get("authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            throw new Error("not authenticated");
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken)
            throw new Error("not authenticated");
        req.decodedToken = decodedToken;
        next();
    }
    catch (error) {
        error.status = 401;
        next(error);
    }
};
