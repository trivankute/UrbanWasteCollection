import {Express} from 'express'
import catchAsync from "../utils/catchAsync";
import { createTaskHandle } from '../controllers/controller.task';

export default function (app: Express) {
    const baseUrl="/task"

    // create
    app.post(baseUrl+"create", catchAsync(createTaskHandle))
}