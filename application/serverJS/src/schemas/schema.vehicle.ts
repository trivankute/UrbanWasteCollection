import {z} from 'zod'

const VehicleSchema = z.object({
    numberPlate: z.string({
        required_error: "Number plate is required",
    }).nonempty({
        message: "Number plate must be not empty"
    }).min(6, {
        message: "Number plate must be at least 6 characters"
    }).max(10, {
        message: "Number plate must be at most 10 characters"
    }),
    currentDisposalFactoryId: z.string({
        required_error: "Current disposal factory id is required",
    }).nonempty({
        message: "Current disposal factory id must be not empty"
    }),
})

const getVehicleSchema = z.object({
    id: z.string({
        required_error: "Id is required",
    }).nonempty({
        message: "Id must be not empty"
    }).min(6, {
        message: "Id must be at least 6 characters"
    })
})

export const assignWorkersToVehicleSchema = z.object({
    vehicleId: z.string({
        required_error: "Vehicle id is required",
    }).nonempty({
        message: "Vehicle id must be not empty"
    }),
    workerIds: z.array(z.object({
        id: z.string({
            required_error: "Worker id is required",
        }).nonempty({
            message: "Worker id must be not empty"
        })
    })),
    typeVehicle: z.string({
        required_error: "Type vehicle is required",
    }).nonempty({
        message: "Type vehicle must be not empty"
    })
})

type VehicleInputSchema = z.infer<typeof VehicleSchema>

export {
    VehicleSchema, VehicleInputSchema,
    getVehicleSchema
}
