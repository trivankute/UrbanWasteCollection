import {Express} from "express"
import catchAsync from "../utils/catchAsync"
import { createDisposalFactoryHandle, getAllDisposalFactoryHandle, getDisposalFactoryHandle } from "../controllers/controller.disposalfactory"
import { processRequestBody, processRequestParams } from "zod-express-middleware"
import { disposalCreateSchema, disposalGetSchema } from "../schemas/schema.disposalfactory"

export default function(app: Express) {
    const baseUrl = "/disposalfactory"

    // create
    app.post(baseUrl+"/create", processRequestBody(disposalCreateSchema), catchAsync(createDisposalFactoryHandle))

    // get all disposals
    app.get(baseUrl+"/all", catchAsync(getAllDisposalFactoryHandle))
    
    // // get disposal by id
    app.get(baseUrl+"/:id", processRequestParams(disposalGetSchema), catchAsync(getDisposalFactoryHandle))

    
}