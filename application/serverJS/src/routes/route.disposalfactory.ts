import {Express} from "express"
import catchAsync from "../utils/catchAsync"
import { createDisposalFactoryHandle, getAllDisposalFactoryHandle, getDisposalFactoryHandle } from "../controllers/controller.disposalfactory"
import { disposalCreateSchema, disposalGetSchema } from "../schemas/schema.disposalfactory"
import zodMiddlewares from "../middlewares/zodMiddlewares"

export default function(app: Express) {
    const baseUrl = "/disposalfactory"

    // create
    app.post(baseUrl+"/create", zodMiddlewares(disposalCreateSchema, "body"), catchAsync(createDisposalFactoryHandle))

    // get all disposals
    app.get(baseUrl+"/all", catchAsync(getAllDisposalFactoryHandle))
    
    // // get disposal by id
    app.get(baseUrl+"/:id", zodMiddlewares(disposalGetSchema, "param"), catchAsync(getDisposalFactoryHandle))

    
}