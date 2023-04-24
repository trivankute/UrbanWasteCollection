"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVehicleSchema = exports.refuelVehicleParamHandle = exports.assignWorkersToVehicleSchema = exports.getVehicleSchema = exports.VehicleSchema = void 0;
const zod_1 = require("zod");
const VehicleSchema = zod_1.z.object({
    numberPlate: zod_1.z.string({
        required_error: "Number plate is required",
    }).nonempty({
        message: "Number plate must be not empty"
    }).min(6, {
        message: "Number plate must be at least 6 characters"
    }).max(10, {
        message: "Number plate must be at most 10 characters"
    }),
    disposalName: zod_1.z.string({
        required_error: "Current disposal factory id is required",
    }).nonempty({
        message: "Current disposal factory id must be not empty"
    }),
});
exports.VehicleSchema = VehicleSchema;
const getVehicleSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "Id is required",
    }).nonempty({
        message: "Id must be not empty"
    }).min(6, {
        message: "Id must be at least 6 characters"
    })
});
exports.getVehicleSchema = getVehicleSchema;
const assignWorkersToVehicleSchema = zod_1.z.object({
    vehicleId: zod_1.z.string({
        required_error: "Vehicle id is required",
    }).nonempty({
        message: "Vehicle id must be not empty"
    }),
    workerIds: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string({
            required_error: "Worker id is required",
        }).nonempty({
            message: "Worker id must be not empty"
        })
    })),
    typeVehicle: zod_1.z.union([zod_1.z.literal('janitor'), zod_1.z.literal('collector'), zod_1.z.literal('nothing')]),
});
exports.assignWorkersToVehicleSchema = assignWorkersToVehicleSchema;
const refuelVehicleParamHandle = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "Vehicle id is required",
    }).nonempty({
        message: "Vehicle id must be not empty"
    }),
});
exports.refuelVehicleParamHandle = refuelVehicleParamHandle;
const searchVehicleSchema = zod_1.z.object({
    page: zod_1.z.number({
        required_error: "Page is required",
    }).min(1, {
        message: "Page must be at least 1"
    }),
    pageSize: zod_1.z.number({
        required_error: "Page size is required",
    }).min(1, {
        message: "Page size must be at least 1"
    }),
    numberPlate: zod_1.z.string({
        required_error: "Number plate is required",
    }),
    disposalName: zod_1.z.string({
        required_error: "Disposal name is required",
    }),
    type: zod_1.z.union([zod_1.z.literal('janitor'), zod_1.z.literal('collector'), zod_1.z.literal("")]),
    state: zod_1.z.union([zod_1.z.literal('in progress'), zod_1.z.literal('nothing'), zod_1.z.literal("")]),
});
exports.searchVehicleSchema = searchVehicleSchema;
