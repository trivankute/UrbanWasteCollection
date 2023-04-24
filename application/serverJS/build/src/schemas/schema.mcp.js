"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpGetSchema = exports.mcpCreateSchema = void 0;
const zod_1 = require("zod");
const mcpCreateSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }).nonempty({
        message: "Name must be nonempty"
    }),
    addressPoint: zod_1.z.string({
        required_error: "AddressPoint is required",
    }).nonempty({
        message: "AddressPoint must be nonempty"
    })
});
exports.mcpCreateSchema = mcpCreateSchema;
const mcpGetSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "id is required",
    }).nonempty({
        message: "id must be nonempty"
    })
});
exports.mcpGetSchema = mcpGetSchema;
