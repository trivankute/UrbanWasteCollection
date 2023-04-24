"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    if (res.locals.user.role === "janitor" || res.locals.user.role === "collector") {
        return next();
    }
    return res.status(403).json({ status: "fail", message: "You are not workers" });
}
exports.default = default_1;
