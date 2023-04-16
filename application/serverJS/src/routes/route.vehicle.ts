import {Express} from "express"
import { updateWorkerToVehicleHandle, createVehicleHandle, deleteAllVehiclesHandle, getAllVehicleHandle, getVehicleHandle } from "../controllers/controller.vehicle"
import { VehicleSchema, assignWorkersToVehicleSchema, getVehicleSchema } from "../schemas/schema.vehicle"
import catchAsync from "../utils/catchAsync"
import requireUser from "../middlewares/requireUser"
import requireBackofficer from "../middlewares/requireBackofficer"
import zodMiddlewares from "../middlewares/zodMiddlewares"
export default function (app: Express) {
    const baseUrl = "/vehicle"
    
    // create a new vehicle
    app.post(baseUrl + "/create", requireUser, requireBackofficer, zodMiddlewares(VehicleSchema, "body"), catchAsync(createVehicleHandle))

    // find a vehicle by id with queries
    app.get(baseUrl, zodMiddlewares(getVehicleSchema, "query"), catchAsync(getVehicleHandle))

    // find all vehicles
    app.get(baseUrl + "/all", catchAsync(getAllVehicleHandle))

    // delete all vehicles
    app.delete(baseUrl + "/deleteAll", requireUser, requireBackofficer, catchAsync(deleteAllVehiclesHandle))

    // assign workers to vehicle
    app.put(baseUrl+"/assign", requireUser, requireBackofficer, zodMiddlewares(assignWorkersToVehicleSchema, "body"), catchAsync(updateWorkerToVehicleHandle))

    // search by disposal and state, type with pagination(need more, get by disposalName and state)

}