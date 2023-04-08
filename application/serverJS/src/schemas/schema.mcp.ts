import {z} from 'zod'
const mcpCreateSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }).nonempty(
        {
            message: "Name must be nonempty"
        }
    ),
    address: z.string({
        required_error: "Address is required",
    }).nonempty(
        {
            message: "Address must be nonempty"
        }
    )
})

const mcpGetSchema = z.object({
    id: z.string({
        required_error: "id is required",
    }).nonempty(
        {
            message: "id must be nonempty"
        }
    )
})

type mcpCreateInput = z.infer<typeof mcpCreateSchema>
type mcpGetInput = z.infer<typeof mcpGetSchema>

export {
    mcpCreateSchema,mcpCreateInput,
    mcpGetSchema,mcpGetInput
}