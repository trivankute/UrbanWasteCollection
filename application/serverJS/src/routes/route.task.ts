import {Express} from 'express'
import catchAsync from "../utils/catchAsync";
import { backOfficerReviewTaskHandle, createTaskHandle, deleteTaskHandle, searchTask, updateNeedReviewTaskHandle } from '../controllers/controller.task';
import requireUser from '../middlewares/requireUser';
import requireBackofficer from '../middlewares/requireBackofficer';
import { backOfficerReviewTaskBodySchema, backOfficerReviewTaskParamsSchema, createTaskSchema, searchTaskSchema, updateNeedReviewTaskSchema } from '../schemas/schema.task';
import requireWorker from '../middlewares/requireWorker';
import zodMiddlewares from '../middlewares/zodMiddlewares';

export default function (app: Express) {
    const baseUrl="/task"

    // create
    app.post(baseUrl+"/create", requireUser, requireBackofficer, zodMiddlewares(createTaskSchema, "body"), catchAsync(createTaskHandle))

    // search by disposalName (old or later) and state, type with pagination(need more, get by disposal and state)
    app.post(baseUrl, zodMiddlewares(searchTaskSchema, "body"), catchAsync(searchTask))

    // delete task
    app.delete(baseUrl+"/:id", catchAsync(deleteTaskHandle))

    // update state to needReview task for worker
    app.put(baseUrl+"/:id/needreview", requireUser, requireWorker, zodMiddlewares(updateNeedReviewTaskSchema, "param"), catchAsync(updateNeedReviewTaskHandle))

    // backoffcer answer
    app.put(baseUrl+"/:id/answer", requireUser, requireBackofficer, zodMiddlewares(backOfficerReviewTaskParamsSchema, "param"), zodMiddlewares(backOfficerReviewTaskBodySchema, "body"), catchAsync(backOfficerReviewTaskHandle))

}