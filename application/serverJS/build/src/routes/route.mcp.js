"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_mcp_1 = require("../controllers/controller.mcp");
const schema_mcp_1 = require("../schemas/schema.mcp");
const zodMiddlewares_1 = __importDefault(require("../middlewares/zodMiddlewares"));
function default_1(app) {
    const baseUrl = "/mcp";
    // create mcp
    app.post(baseUrl + "/create", (0, zodMiddlewares_1.default)(schema_mcp_1.mcpCreateSchema, "body"), controller_mcp_1.createMcpHandle);
    // // get all mcp
    app.get(baseUrl + "/all", controller_mcp_1.getAllMcpHandle);
    // get mcp by name
    app.get(baseUrl + "/:id", (0, zodMiddlewares_1.default)(schema_mcp_1.mcpGetSchema, "param"), controller_mcp_1.getMcpHandle);
    // delete all mcp
    // app.delete(baseUrl+"/deleteAll", requireUser, requireBackofficer, catchAsync(deleteAllMcpHandle))
}
exports.default = default_1;
