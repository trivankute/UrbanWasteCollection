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
exports.getMcpHandle = exports.getAllMcpHandle = exports.createMcpHandle = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const expressError_1 = __importDefault(require("../utils/expressError"));
const http_status_codes_1 = require("http-status-codes");
const createMcpHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, addressPoint } = req.body;
        const newMCP = yield prisma_1.default.mCP.create({
            data: {
                name,
                addressPoint
            },
            select: {
                id: true,
                name: true,
                addressPoint: true
            }
        });
        res.status(201).json({ status: "success", data: newMCP });
    }
    catch (err) {
        next(new expressError_1.default('Cannot create MCP', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.createMcpHandle = createMcpHandle;
const getAllMcpHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allMcps = yield prisma_1.default.mCP.findMany();
        res.status(200).json({ status: "success", data: allMcps });
    }
    catch (err) {
        next(new expressError_1.default('Cannot get all MCP', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.getAllMcpHandle = getAllMcpHandle;
const getMcpHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const mcp = yield prisma_1.default.mCP.findUnique({
            where: {
                id
            }
        });
        if (!mcp) {
            return res.status(404).json({ status: "fail", message: "MCP not found" });
        }
        res.status(200).json({ status: "success", data: mcp });
    }
    catch (err) {
        next(new expressError_1.default('Cannot get MCP', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.getMcpHandle = getMcpHandle;
