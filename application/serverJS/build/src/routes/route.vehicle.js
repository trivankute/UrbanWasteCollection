"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_vehicle_1 = require("../controllers/controller.vehicle");
const schema_vehicle_1 = require("../schemas/schema.vehicle");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const requireUser_1 = __importDefault(require("../middlewares/requireUser"));
const requireBackofficer_1 = __importDefault(require("../middlewares/requireBackofficer"));
const zodMiddlewares_1 = __importDefault(require("../middlewares/zodMiddlewares"));
const requireWorker_1 = __importDefault(require("../middlewares/requireWorker"));
function default_1(app) {
    const baseUrl = "/vehicle";
    // create a new vehicle
    app.post(baseUrl + "/create", requireUser_1.default, requireBackofficer_1.default, (0, zodMiddlewares_1.default)(schema_vehicle_1.VehicleSchema, "body"), (0, catchAsync_1.default)(controller_vehicle_1.createVehicleHandle));
    // find a vehicle by id with queries
    app.get(baseUrl, (0, zodMiddlewares_1.default)(schema_vehicle_1.getVehicleSchema, "query"), (0, catchAsync_1.default)(controller_vehicle_1.getVehicleHandle));
    // find all vehicles
    app.get(baseUrl + "/all", (0, catchAsync_1.default)(controller_vehicle_1.getAllVehicleHandle));
    // delete all vehicles
    app.delete(baseUrl + "/deleteAll", requireUser_1.default, requireBackofficer_1.default, (0, catchAsync_1.default)(controller_vehicle_1.deleteAllVehiclesHandle));
    // assign workers to vehicle
    app.put(baseUrl + "/assign", requireUser_1.default, requireBackofficer_1.default, (0, zodMiddlewares_1.default)(schema_vehicle_1.assignWorkersToVehicleSchema, "body"), (0, catchAsync_1.default)(controller_vehicle_1.updateWorkerToVehicleHandle));
    // search by disposal and state, type with pagination(need more, get by disposalName and state)
    app.post(baseUrl, (0, zodMiddlewares_1.default)(schema_vehicle_1.searchVehicleSchema, "body"), (0, catchAsync_1.default)(controller_vehicle_1.searchVehicleHandle));
    // re fuel, reset capacity
    app.get(baseUrl + "/:id/refuel", requireUser_1.default, requireWorker_1.default, (0, zodMiddlewares_1.default)(schema_vehicle_1.refuelVehicleParamHandle, "param"), (0, catchAsync_1.default)(controller_vehicle_1.refuelVehicleHandle));
}
exports.default = default_1;
