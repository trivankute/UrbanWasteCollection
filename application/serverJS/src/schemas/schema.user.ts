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

type registerUserInput = z.infer<typeof registerUserSchema>
type loginUserInput = z.infer<typeof loginUserSchema>

export {
    registerUserSchema,registerUserInput,
    loginUserSchema,loginUserInput

}