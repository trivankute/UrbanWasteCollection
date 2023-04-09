import {Express} from 'express'
import { createMcpHandle, getAllMcpHandle, getMcpHandle } from '../controllers/controller.mcp'
import { processRequestBody, processRequestParams, processRequestQuery } from 'zod-express-middleware'
import { mcpCreateSchema, mcpGetSchema } from '../schemas/schema.mcp'
import requireUser from '../middlewares/requireUser'
import requireBackofficer from '../middlewares/requireBackofficer'
import catchAsync from '../utils/catchAsync'

export default function (app:Express) {
    const baseUrl = "/mcp"
    
    // create mcp
    app.post(baseUrl+"/create", processRequestBody(mcpCreateSchema), createMcpHandle)

    // // get all mcp
    app.get(baseUrl + "/all", getAllMcpHandle)

    // get mcp by name
    app.get(baseUrl + "/:id", processRequestParams(mcpGetSchema), getMcpHandle)

    // delete all mcp
    // app.delete(baseUrl+"/deleteAll", requireUser, requireBackofficer, catchAsync(deleteAllMcpHandle))

} 