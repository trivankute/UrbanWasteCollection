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
exports.getDisposalFactoryHandle = exports.getAllDisposalFactoryHandle = exports.createDisposalFactoryHandle = void 0;
const http_status_codes_1 = require("http-status-codes");
const expressError_1 = __importDefault(require("../utils/expressError"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const createDisposalFactoryHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const disposal = yield prisma_1.default.disposalFactory.create({
            data: {
                name: req.body.name,
                addressPoint: req.body.addressPoint
            },
            select: {
                id: true,
                name: true,
                addressPoint: true
            }
        });
        res.status(201).json({ status: "success", data: disposal });
    }
    catch (err) {
        next(new expressError_1.default('Cannot assign worker to vehicle', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.createDisposalFactoryHandle = createDisposalFactoryHandle;
const getAllDisposalFactoryHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDisposal = yield prisma_1.default.disposalFactory.findMany();
        res.status(200).json({ status: "success", data: allDisposal });
    }
    catch (err) {
        next(new expressError_1.default('Cannot get all disposal factory', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.getAllDisposalFactoryHandle = getAllDisposalFactoryHandle;
const getDisposalFactoryHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const disposal = yield prisma_1.default.disposalFactory.findUnique({
            where: {
                id
            }
        });
        if (!disposal) {
            return res.status(404).json({ status: "fail", message: "Disposal factory not found" });
        }
        res.status(200).json({ status: "success", data: disposal });
    }
    catch (err) {
        next(new expressError_1.default('Cannot get disposal factory', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.getDisposalFactoryHandle = getDisposalFactoryHandle;
