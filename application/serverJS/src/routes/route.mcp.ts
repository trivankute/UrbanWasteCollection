import {Express} from 'express'
import { createMcpHandle, getAllMcpHandle, getMcpHandle } from '../controllers/controller.mcp'
import { mcpCreateSchema, mcpGetSchema } from '../schemas/schema.mcp'
import zodMiddlewares from '../middlewares/zodMiddlewares'

export default function (app:Express) {
    const baseUrl = "/mcp"
    
    // create mcp
    app.post(baseUrl+"/create", zodMiddlewares(mcpCreateSchema, "body"), createMcpHandle)

    // // get all mcp
    app.get(baseUrl + "/all", getAllMcpHandle)

    // get mcp by name
    app.get(baseUrl + "/:id", zodMiddlewares(mcpGetSchema, "param"), getMcpHandle)

    // delete all mcp
    // app.delete(baseUrl+"/deleteAll", requireUser, requireBackofficer, catchAsync(deleteAllMcpHandle))

} 