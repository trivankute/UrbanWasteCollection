import {Express, Request, Response} from "express"

import {getMeHandle, loginHandle, logoutHandle, registerHandle} from "../controllers/controller.user";
import catchAsync from "../utils/catchAsync";
import {loginUserSchema, registerUserSchema} from '../schemas/schema.user'
import { processRequestBody } from "zod-express-middleware";
import alreadyLoggedIn from "../middlewares/alreadyLoggedIn";
import requireUser from "../middlewares/requireUser";

export default function(app: Express) {
    const baseUrl = "/user"
    // // Register user
    app.post(baseUrl+"/register", processRequestBody(registerUserSchema), catchAsync(registerHandle));

    // // Login
    app.post(baseUrl+"/login", alreadyLoggedIn, processRequestBody(loginUserSchema),catchAsync(loginHandle))

    // // Get the user information
    app.get(baseUrl, requireUser, catchAsync(getMeHandle))

    // // Log out
    app.get(baseUrl+"/logout", requireUser, catchAsync(logoutHandle))

    // // for Posts
    // // create
    // app.post("/api/posts",
    // [requiresUser, validateRequest(createPostSchema)], createPostHandler)

    // // get
    // app.get("/api/posts/:postId", getPostHandler)

    // // update
    // app.put("/api/posts/:postId",[requiresUser, validateRequest(updatePostSchema)], updatePostHandler)

    // // delete
    // app.delete("/api/posts/:postId",[requiresUser, validateRequest(deletePostSchema)], deletePostHandler)

    // // find all post of a user
    // app.get("/api/allposts", requiresUser, getAllPostHandler)

}