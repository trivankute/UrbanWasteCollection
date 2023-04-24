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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const jwt_utils_1 = require("../utils/jwt.utils");
function deserializeUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = lodash_1.default.get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
        if (!accessToken) {
            return next();
        }
        try {
            const { decoded, expired } = yield (0, jwt_utils_1.verifyJwt)(accessToken);
            if (expired) {
                return next();
            }
            if (decoded) {
                res.locals.user = decoded;
            }
        }
        catch (err) {
            return res.status(401).json({ status: "fail", message: "Unauthorized" });
        }
        return next();
    });
}
exports.default = deserializeUser;
