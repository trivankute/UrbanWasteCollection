"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backOfficerReviewTaskBodySchema = exports.backOfficerReviewTaskParamsSchema = exports.updateNeedReviewTaskSchema = exports.searchTasksSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const taskTypes = zod_1.z.union([zod_1.z.literal('janitor'), zod_1.z.literal('collector'), zod_1.z.literal("")]);
const createTaskSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }).nonempty({
        message: "Name must be not empty"
    }),
    type: taskTypes,
    vehicleId: zod_1.z.string({
        required_error: "Vehicle id is required",
    }).nonempty({
        message: "Vehicle id must be not empty"
    }),
    pathDisposalFactoriesIds: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string({
            required_error: "Disposal factory id is required",
        }).nonempty({
            message: "Disposal factory id must be not empty"
        })
    })),
    routes: zod_1.z.array(zod_1.z.string()),
    mcpIds: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string({
            required_error: "Mcp id is required",
        }).nonempty({
            message: "Mcp id must be not empty"
        })
    })),
    createdTime: zod_1.z.string({
        required_error: "Created time is required",
    })
});
exports.createTaskSchema = createTaskSchema;
const searchTasksSchema = zod_1.z.object({
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
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
    disposalName: zod_1.z.string({
        required_error: "Disposal name is required",
    }),
    type: taskTypes,
    state: zod_1.z.union([zod_1.z.literal('need review'), zod_1.z.literal('in progress'), zod_1.z.literal('done'), zod_1.z.literal("")]),
    mcpName: zod_1.z.string({
        required_error: "Mcp name is required",
    }),
});
exports.searchTasksSchema = searchTasksSchema;
const updateNeedReviewTaskSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "Task id is required",
    }).nonempty({
        message: "Task id must be not empty"
    })
});
exports.updateNeedReviewTaskSchema = updateNeedReviewTaskSchema;
const backOfficerReviewTaskParamsSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "Task id is required",
    }).nonempty({
        message: "Task id must be not empty"
    }),
});
exports.backOfficerReviewTaskParamsSchema = backOfficerReviewTaskParamsSchema;
const backOfficerReviewTaskBodySchema = zod_1.z.object({
    answer: zod_1.z.union([zod_1.z.literal('accept'), zod_1.z.literal('refuse')]),
});
exports.backOfficerReviewTaskBodySchema = backOfficerReviewTaskBodySchema;
