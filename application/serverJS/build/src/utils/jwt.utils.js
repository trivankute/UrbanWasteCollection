"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signJwt = (payload, options) => {
    const privateKey = process.env.PRIVATE_KEY;
    return jsonwebtoken_1.default.sign(payload, privateKey, Object.assign(Object.assign({}, (options && options)), { algorithm: 'RS256' }));
};
exports.signJwt = signJwt;
const verifyJwt = (token) => {
    const publicKey = process.env.PUBLIC_KEY;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return {
            decoded,
            expired: false,
            valid: true
        };
    }
    catch (err) {
        return {
            valid: false,
            expired: true,
            decoded: null
        };
    }
};
exports.verifyJwt = verifyJwt;
