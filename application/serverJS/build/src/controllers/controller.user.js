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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetcheckincheckoutHandle = exports.checkoutHandle = exports.checkinHandle = exports.updateProfileHandle = exports.searchUserHandle = exports.updateRoleHandle = exports.logoutHandle = exports.getMeHandle = exports.loginHandle = exports.registerHandle = void 0;
const hash_1 = require("../utils/hash");
const jwt_utils_1 = require("../utils/jwt.utils");
const prisma_1 = __importDefault(require("../utils/prisma"));
const expressError_1 = __importDefault(require("../utils/expressError"));
const http_status_codes_1 = require("http-status-codes");
const registerHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const { role, disposalId } = req.query;
        const { hash, salt } = (0, hash_1.hashPassword)(password);
        if (role && disposalId) {
            const newUser = yield prisma_1.default.user.create({
                data: {
                    name,
                    email,
                    password: hash,
                    salt,
                    role: role,
                    disposalFactory: {
                        connect: {
                            id: disposalId
                        }
                    }
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    disposalFactory: true
                }
            });
            res.json({ status: "success", message: "User registered successfully" });
        }
        else {
            const newUser = yield prisma_1.default.user.create({
                data: {
                    name,
                    email,
                    password: hash,
                    salt
                },
                include: {
                    disposalFactory: {
                        select: {
                            name: true,
                        }
                    },
                    vehicle: {
                        include: {
                            task: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                }
            });
            res.json({ status: "success", message: "User registered successfully" });
        }
    }
    catch (err) {
        next(new expressError_1.default("Cannot register", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.registerHandle = registerHandle;
const loginHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password: loginPassword } = req.body;
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email
            },
            include: {
                disposalFactory: {
                    select: {
                        name: true,
                    }
                },
                vehicle: {
                    include: {
                        task: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        const isPasswordCorrect = (0, hash_1.verifyPassword)({ password: loginPassword, salt: user.salt, hash: user.password });
        if (!isPasswordCorrect) {
            return res.status(400).json({ status: "fail", message: "Password is not correct" });
        }
        const { password, salt } = user, rest = __rest(user, ["password", "salt"]);
        const accessTokenTtl = "15m";
        const accessToken = (0, jwt_utils_1.signJwt)(Object.assign({}, rest), { expiresIn: accessTokenTtl });
        res.status(200).json({ status: "success", accessToken, user: rest });
    }
    catch (err) {
        next(new expressError_1.default("Cannot login", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.loginHandle = loginHandle;
const getMeHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: res.locals.user.id
            },
            include: {
                disposalFactory: {
                    select: {
                        name: true,
                    }
                },
                vehicle: {
                    include: {
                        task: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        const { password, salt } = user, rest = __rest(user, ["password", "salt"]);
        res.status(200).json({ status: "success", user: rest });
    }
    catch (err) {
        next(new expressError_1.default("Cannot get user", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.getMeHandle = getMeHandle;
const logoutHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ status: "success", message: "Logout successfully" });
    }
    catch (err) {
        next(new expressError_1.default("Cannot logout", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.logoutHandle = logoutHandle;
const updateRoleHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, role } = req.body;
        const user = yield prisma_1.default.user.update({
            where: {
                id
            },
            data: {
                role
            }
        });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        else
            res.status(200).json({ status: "success", data: user });
    }
    catch (err) {
        next(new expressError_1.default("Cannot update role", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.updateRoleHandle = updateRoleHandle;
const searchUserHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role, page, pageSize, disposalName, state } = req.body;
        let user = yield prisma_1.default.user.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            where: {
                name: {
                    contains: name
                },
                role: {
                    contains: role,
                    not: "backofficer"
                },
                disposalFactory: {
                    name: {
                        contains: disposalName
                    }
                },
                state: {
                    contains: state
                },
            },
            include: {
                vehicle: {
                    include: {
                        task: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                state: true,
                                accept: true,
                                routes: true,
                                vehicleId: true,
                                mcpIds: true,
                                vehicle: {
                                    select: {
                                        "id": true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        // select the user
        let userSelect = user.map((item) => {
            const { password, salt } = item, rest = __rest(item, ["password", "salt"]);
            return rest;
        });
        if (!userSelect) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        else
            res.status(200).json({ status: "success", data: userSelect });
    }
    catch (err) {
        next(new expressError_1.default("Cannot search user", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.searchUserHandle = searchUserHandle;
const updateProfileHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let path;
        if (req.file) {
            path = req.file.path;
        }
        else {
            path = res.locals.image;
        }
        let { name, age, address, phone, nationality, birthday, gender } = req.body;
        // age to int
        let correctAge = parseInt(age);
        const user = yield prisma_1.default.user.update({
            where: {
                id: res.locals.user.id
            },
            data: {
                name,
                age: correctAge,
                address,
                phone,
                nationality,
                birthday,
                gender,
                image: path
            }
        });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        else
            res.status(200).json({ status: "success", data: user });
    }
    catch (err) {
        next(new expressError_1.default("Cannot update profile", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.updateProfileHandle = updateProfileHandle;
const checkinHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = res.locals.user.id;
        // find user first
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id
            },
        });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        if (user.checkin) {
            return res.status(400).json({ status: "fail", message: "You have already checked in" });
        }
        if (user.checkout) {
            return res.status(400).json({ status: "fail", message: "You have already checked out" });
        }
        // update user
        const newUser = yield prisma_1.default.user.update({
            where: {
                id
            },
            data: {
                checkin: true,
                checkinTime: new Date()
            },
            include: {
                disposalFactory: {
                    select: {
                        name: true
                    }
                },
                vehicle: {
                    include: {
                        task: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            }
        });
        // remove password and salt
        const { password, salt } = newUser, rest = __rest(newUser, ["password", "salt"]);
        res.status(200).json({ status: "success", data: rest });
    }
    catch (err) {
        next(new expressError_1.default("Cannot checkin", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.checkinHandle = checkinHandle;
const checkoutHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = res.locals.user.id;
        // find user first
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        if (!user.checkin) {
            return res.status(400).json({ status: "fail", message: "User has not checked in" });
        }
        if (user.checkout) {
            return res.status(400).json({ status: "fail", message: "User has already checked out" });
        }
        // not enough 8 hours
        if (new Date().getTime() - user.checkinTime.getTime() < 8 * 60 * 60 * 1000) {
            return res.status(400).json({ status: "fail", message: "User has not worked 8 hours" });
        }
        // update user
        const newUser = yield prisma_1.default.user.update({
            where: {
                id
            },
            data: {
                checkout: true,
                checkoutTime: new Date()
            },
            include: {
                disposalFactory: {
                    select: {
                        name: true
                    }
                },
                vehicle: {
                    include: {
                        task: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            }
        });
        // remove password and salt
        const { password, salt } = newUser, rest = __rest(newUser, ["password", "salt"]);
        res.status(200).json({ status: "success", data: rest });
    }
    catch (err) {
        next(new expressError_1.default("Cannot checkout", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.checkoutHandle = checkoutHandle;
const resetcheckincheckoutHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = res.locals.user.id;
        // find user first
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id
            },
            select: {
                checkin: true,
                checkinTime: true,
                checkout: true,
                checkoutTime: true
            }
        });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        if (!user.checkin) {
            return res.status(400).json({ status: "fail", message: "User has not checked in" });
        }
        if (!user.checkout) {
            return res.status(400).json({ status: "fail", message: "User has not checked out" });
        }
        // update user
        const newUser = yield prisma_1.default.user.update({
            where: {
                id
            },
            data: {
                checkin: false,
                checkinTime: null,
                checkout: false,
                checkoutTime: null
            },
            include: {
                disposalFactory: {
                    select: {
                        name: true
                    }
                },
                vehicle: {
                    include: {
                        task: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            }
        });
        // remove password and salt
        const { password, salt } = newUser, rest = __rest(newUser, ["password", "salt"]);
        res.status(200).json({ status: "success", data: rest });
    }
    catch (error) {
        next(new expressError_1.default("Cannot reset checkin checkout", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.resetcheckincheckoutHandle = resetcheckincheckoutHandle;
