import {Express} from 'express'
import catchAsync from "../utils/catchAsync";
import { createTaskHandle, deleteTaskHandle, searchTask } from '../controllers/controller.task';
import requireUser from '../middlewares/requireUser';
import requireBackofficer from '../middlewares/requireBackofficer';
import { processRequestBody } from 'zod-express-middleware';
import { createTaskSchema, searchTaskSchema } from '../schemas/schema.task';

export default function (app: Express) {
    const baseUrl="/task"

    // create
    app.post(baseUrl+"/create", requireUser, requireBackofficer, processRequestBody(createTaskSchema), catchAsync(createTaskHandle))

    // search by disposalName (old or later) and state, type with pagination(need more, get by disposal and state)
    app.post(baseUrl, processRequestBody(searchTaskSchema), catchAsync(searchTask))

    // delete task
    app.delete(baseUrl+"/:id", catchAsync(deleteTaskHandle))

}