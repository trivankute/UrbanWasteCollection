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

const assignWorkersToVehicleSchema = z.object({
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
    typeVehicle: z.union([z.literal('janitor'), z.literal('collector'), z.literal('nothing')]),
})

const refuelVehicleParamHandle = z.object({
    id: z.string({
        required_error: "Vehicle id is required",
    }).nonempty({
        message: "Vehicle id must be not empty"
    }),
})

const searchVehicleSchema = z.object({
    page: z.number({
        required_error: "Page is required",
    }).min(1, {
        message: "Page must be at least 1"
    }),
    pageSize: z.number({
        required_error: "Page size is required",
    }).min(1, {
        message: "Page size must be at least 1"
    }),
    numberPlate: z.string({
        required_error: "Number plate is required",
    }),
    disposalName:z.string({
        required_error: "Disposal name is required",
    }),
    type: z.union([z.literal('janitor'), z.literal('collector'), z.literal("")]),
    state: z.union([z.literal('in progress'), z.literal('nothing'), z.literal("")]),
})

type VehicleInputSchema = z.infer<typeof VehicleSchema>
type GetVehicleInputSchema = z.infer<typeof getVehicleSchema>
type AssignWorkersToVehicleInputSchema = z.infer<typeof assignWorkersToVehicleSchema>
type RefuelVehicleInputParamHandle = z.infer<typeof refuelVehicleParamHandle>
type SearchVehicleInputSchema = z.infer<typeof searchVehicleSchema>
// lol hehe

export {
    VehicleSchema, VehicleInputSchema,
    getVehicleSchema, GetVehicleInputSchema,
    assignWorkersToVehicleSchema, AssignWorkersToVehicleInputSchema,
    refuelVehicleParamHandle, RefuelVehicleInputParamHandle,
    searchVehicleSchema, SearchVehicleInputSchema
}
