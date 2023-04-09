import {z} from 'zod'

const disposalCreateSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }).nonempty(
        {
            message: "Name must be nonempty"
        }
    ),
    addressPoint: z.string({
        required_error: "AddressPoint is required",
    }).nonempty(
        {
            message: "AddressPoint must be nonempty"
        }
    )
})

const disposalGetSchema = z.object({
    id: z.string({
        required_error: "id is required",
    }).nonempty(
        {
            message: "id must be nonempty"
        }
    )
})

type disposalCreateInput = z.infer<typeof disposalCreateSchema>
type disposalGetInput = z.infer<typeof disposalGetSchema>

export {
    disposalCreateSchema, disposalCreateInput,
    disposalGetSchema, disposalGetInput
}