"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    if (res.locals.user.role !== "backofficer") {
        return res.status(403).json({ status: "fail", message: "You are not backofficer" });
    }
    return next();
}
exports.default = default_1;
