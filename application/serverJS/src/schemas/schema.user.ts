import {z} from 'zod'

const userSchema = {
    email: z.string({
        required_error: "Email is required",
    }).email({
        message: "Email is not valid",
    }),
    password: z.string({
        required_error: "Password is required",
    }).min(6, {
        message: "Password must be at least 6 characters"
    })
}

const registerUserSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }),
    confirmPassword: z.string({
        required_error: "Confirm password is required",
    }).min(6,{
        message: "Confirm password must be at least 6 characters"
    }),
    ...userSchema,
}).refine(data=>data.password===data.confirmPassword, {
    message: "Password and confirm password must be the same",
    path: ["confirmPassword"]
})

const loginUserSchema = z.object({
    ...userSchema
})

const updateRoleSchema = z.object({
    id: z.string({
        required_error: "Id is required",
    }).nonempty({
        message: "Id must be not empty"
    }),
    role: z.string({
        required_error: "Role is required",
    }).nonempty({
        message: "Role must be not empty"
    })
})

const updateProfileSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }),
    age: z.string({
        required_error: "Age is required",
    }),
    address: z.string({
        required_error: "Address is required",
    }),
    phone: z.string({
        required_error: "Phone is required",
    }),
    nationality: z.string({
        required_error: "Nationality is required",
    }),
    birthday: z.string({
        required_error: "Birthday is required",
    }),
    gender: z.string({
        required_error: "Gender is required",
    })
})

const searchUserSchema = z.object({
    page:z.number({
        required_error: "Page is required",
    }).min(1, {
        message: "Page must be at least 1"
    }),
    pageSize:z.number({
        required_error: "Page size is required",
    }).min(1, {
        message: "Page size must be at least 1"
    }),
    name: z.string({
        required_error: "Name is required",
    }),
    role:z.union([z.literal("user"), z.literal("janitor"), z.literal("collector"), z.literal("backofficer"), z.literal("")]),
    disposalName:z.string({
        required_error: "Disposal name is required",
    }),
    state:z.union([z.literal("nothing"), z.literal("in progress"), z.literal("")]),
})


type registerUserInput = z.infer<typeof registerUserSchema>
type loginUserInput = z.infer<typeof loginUserSchema>
type updateRoleInput = z.infer<typeof updateRoleSchema>
type updateProfileInput = z.infer<typeof updateProfileSchema>
type searchUserInput = z.infer<typeof searchUserSchema>


export {
    registerUserSchema,registerUserInput,
    loginUserSchema,loginUserInput,
    updateRoleSchema,updateRoleInput,
    updateProfileSchema, updateProfileInput,
    searchUserSchema, searchUserInput
}