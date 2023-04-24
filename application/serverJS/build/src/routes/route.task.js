"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const requireUser_1 = __importDefault(require("../middlewares/requireUser"));
const requireBackofficer_1 = __importDefault(require("../middlewares/requireBackofficer"));
const schema_task_1 = require("../schemas/schema.task");
const requireWorker_1 = __importDefault(require("../middlewares/requireWorker"));
const zodMiddlewares_1 = __importDefault(require("../middlewares/zodMiddlewares"));
const controller_task_1 = require("../controllers/controller.task");
function default_1(app) {
    const baseUrl = "/task";
    // get by id
    app.get(baseUrl + "/:id", (0, catchAsync_1.default)(controller_task_1.getTaskById));
    // create
    app.post(baseUrl + "/create", requireUser_1.default, requireBackofficer_1.default, (0, zodMiddlewares_1.default)(schema_task_1.createTaskSchema, "body"), (0, catchAsync_1.default)(controller_task_1.createTaskHandle));
    // search by disposalName (old or later) and state, type with pagination(need more, get by disposal and state)
    app.post(baseUrl, (0, zodMiddlewares_1.default)(schema_task_1.searchTasksSchema, "body"), (0, catchAsync_1.default)(controller_task_1.searchTask));
    // delete all done tasks
    app.delete(baseUrl + "/donetasks", (0, catchAsync_1.default)(controller_task_1.deleteDoneTasksHandle));
    // delete task
    app.delete(baseUrl + "/:id", (0, catchAsync_1.default)(controller_task_1.deleteTaskHandle));
    // update state to needReview task for worker
    app.put(baseUrl + "/:id/needreview", requireUser_1.default, requireWorker_1.default, (0, zodMiddlewares_1.default)(schema_task_1.updateNeedReviewTaskSchema, "param"), (0, catchAsync_1.default)(controller_task_1.updateNeedReviewTaskHandle));
    // backoffcer answer
    app.put(baseUrl + "/:id/answer", requireUser_1.default, requireBackofficer_1.default, (0, zodMiddlewares_1.default)(schema_task_1.backOfficerReviewTaskParamsSchema, "param"), (0, zodMiddlewares_1.default)(schema_task_1.backOfficerReviewTaskBodySchema, "body"), (0, catchAsync_1.default)(controller_task_1.backOfficerReviewTaskHandle));
}
exports.default = default_1;
