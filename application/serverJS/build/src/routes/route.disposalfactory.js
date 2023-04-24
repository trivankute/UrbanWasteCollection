"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const controller_disposalfactory_1 = require("../controllers/controller.disposalfactory");
const schema_disposalfactory_1 = require("../schemas/schema.disposalfactory");
const zodMiddlewares_1 = __importDefault(require("../middlewares/zodMiddlewares"));
function default_1(app) {
    const baseUrl = "/disposalfactory";
    // create
    app.post(baseUrl + "/create", (0, zodMiddlewares_1.default)(schema_disposalfactory_1.disposalCreateSchema, "body"), (0, catchAsync_1.default)(controller_disposalfactory_1.createDisposalFactoryHandle));
    // get all disposals
    app.get(baseUrl + "/all", (0, catchAsync_1.default)(controller_disposalfactory_1.getAllDisposalFactoryHandle));
    // // get disposal by id
    app.get(baseUrl + "/:id", (0, zodMiddlewares_1.default)(schema_disposalfactory_1.disposalGetSchema, "param"), (0, catchAsync_1.default)(controller_disposalfactory_1.getDisposalFactoryHandle));
}
exports.default = default_1;
