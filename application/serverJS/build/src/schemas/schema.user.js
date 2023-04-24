"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserSchema = exports.updateProfileSchema = exports.updateRoleSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
const userSchema = {
    email: zod_1.z.string({
        required_error: "Email is required",
    }).email({
        message: "Email is not valid",
    }),
    password: zod_1.z.string({
        required_error: "Password is required",
    }).min(6, {
        message: "Password must be at least 6 characters"
    })
};
const registerUserSchema = zod_1.z.object(Object.assign({ name: zod_1.z.string({
        required_error: "Name is required",
    }), confirmPassword: zod_1.z.string({
        required_error: "Confirm password is required",
    }).min(6, {
        message: "Confirm password must be at least 6 characters"
    }) }, userSchema)).refine(data => data.password === data.confirmPassword, {
    message: "Password and confirm password must be the same",
    path: ["confirmPassword"]
});
exports.registerUserSchema = registerUserSchema;
const loginUserSchema = zod_1.z.object(Object.assign({}, userSchema));
exports.loginUserSchema = loginUserSchema;
const updateRoleSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "Id is required",
    }).nonempty({
        message: "Id must be not empty"
    }),
    role: zod_1.z.string({
        required_error: "Role is required",
    }).nonempty({
        message: "Role must be not empty"
    })
});
exports.updateRoleSchema = updateRoleSchema;
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
    age: zod_1.z.string({
        required_error: "Age is required",
    }),
    address: zod_1.z.string({
        required_error: "Address is required",
    }),
    phone: zod_1.z.string({
        required_error: "Phone is required",
    }),
    nationality: zod_1.z.string({
        required_error: "Nationality is required",
    }),
    birthday: zod_1.z.string({
        required_error: "Birthday is required",
    }),
    gender: zod_1.z.string({
        required_error: "Gender is required",
    })
});
exports.updateProfileSchema = updateProfileSchema;
const searchUserSchema = zod_1.z.object({
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
    role: zod_1.z.union([zod_1.z.literal("user"), zod_1.z.literal("janitor"), zod_1.z.literal("collector"), zod_1.z.literal("backofficer"), zod_1.z.literal("")]),
    disposalName: zod_1.z.string({
        required_error: "Disposal name is required",
    }),
    state: zod_1.z.union([zod_1.z.literal("nothing"), zod_1.z.literal("in progress"), zod_1.z.literal("")]),
});
exports.searchUserSchema = searchUserSchema;
