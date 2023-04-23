import {z} from 'zod'
const taskTypes = z.union([z.literal('janitor'), z.literal('collector'), z.literal("")]);
const createTaskSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }).nonempty({
        message: "Name must be not empty"
    }),
    type: taskTypes,
    vehicleId: z.string({
        required_error: "Vehicle id is required",
    }).nonempty({
        message: "Vehicle id must be not empty"
    }),
    pathDisposalFactoriesIds: z.array(z.object({
        id: z.string({
            required_error: "Disposal factory id is required",
        }).nonempty({
            message: "Disposal factory id must be not empty"
        })
    })),
    routes: z.array(z.string()),
    mcpIds: z.array(z.object({
        id: z.string({
            required_error: "Mcp id is required",
        }).nonempty({
            message: "Mcp id must be not empty"
        })
    })),
    createdTime: z.string({
        required_error: "Created time is required",
    })
})

const searchTasksSchema = z.object({
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
    name:z.string({
        required_error: "Name is required",
    }),
    disposalName:z.string({
        required_error: "Disposal name is required",
    }),
    type: taskTypes,
    state: z.union([z.literal('need review'), z.literal('in progress'), z.literal('done'), z.literal("")]),
    mcpName:z.string({
        required_error: "Mcp name is required",
    }),
})

const updateNeedReviewTaskSchema = z.object({
    id: z.string({
        required_error: "Task id is required",
    }).nonempty({
        message: "Task id must be not empty"
    })
})

const backOfficerReviewTaskParamsSchema = z.object({
    id: z.string({
        required_error: "Task id is required",
    }).nonempty({
        message: "Task id must be not empty"
    }),
})

const backOfficerReviewTaskBodySchema = z.object({
    answer: z.union([z.literal('accept'), z.literal('refuse')]),
})

type createTaskInput = z.infer<typeof createTaskSchema>
type searchTasksInput = z.infer<typeof searchTasksSchema>
type updateNeedReviewTaskInput = z.infer<typeof updateNeedReviewTaskSchema>
type backOfficerReviewTaskParamsInput = z.infer<typeof backOfficerReviewTaskParamsSchema>
type backOfficerReviewTaskBodyInput = z.infer<typeof backOfficerReviewTaskBodySchema>


export {
    createTaskSchema, createTaskInput,
    searchTasksSchema, searchTasksInput,
    updateNeedReviewTaskSchema, updateNeedReviewTaskInput,
    backOfficerReviewTaskParamsSchema, backOfficerReviewTaskParamsInput,
    backOfficerReviewTaskBodySchema, backOfficerReviewTaskBodyInput,
}