"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_user_1 = require("../controllers/controller.user");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const schema_user_1 = require("../schemas/schema.user");
const alreadyLoggedIn_1 = __importDefault(require("../middlewares/alreadyLoggedIn"));
const requireUser_1 = __importDefault(require("../middlewares/requireUser"));
const requireBackofficer_1 = __importDefault(require("../middlewares/requireBackofficer"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../cloudinary");
const zodMiddlewares_1 = __importDefault(require("../middlewares/zodMiddlewares"));
const upload = (0, multer_1.default)({ storage: cloudinary_1.storage });
function default_1(app) {
    const baseUrl = "/user";
    // // Register user
    app.post(baseUrl + "/register", (0, zodMiddlewares_1.default)(schema_user_1.registerUserSchema, "body"), (0, catchAsync_1.default)(controller_user_1.registerHandle));
    // // Login
    app.post(baseUrl + "/login", alreadyLoggedIn_1.default, (0, zodMiddlewares_1.default)(schema_user_1.loginUserSchema, "body"), (0, catchAsync_1.default)(controller_user_1.loginHandle));
    // // Log out
    app.get(baseUrl + "/logout", requireUser_1.default, (0, catchAsync_1.default)(controller_user_1.logoutHandle));
    // update role
    app.put(baseUrl + "/role", (0, zodMiddlewares_1.default)(schema_user_1.updateRoleSchema, "body"), (0, catchAsync_1.default)(controller_user_1.updateRoleHandle));
    // // Get the user information
    app.get(baseUrl, requireUser_1.default, (0, catchAsync_1.default)(controller_user_1.getMeHandle));
    // search by name and role with pagination, with no name then get all (need more, get by disposalName and state)
    app.post(baseUrl, requireUser_1.default, requireBackofficer_1.default, (0, zodMiddlewares_1.default)(schema_user_1.searchUserSchema, "body"), (0, catchAsync_1.default)(controller_user_1.searchUserHandle));
    // update profile information, if image is nothing then not update image
    app.put(baseUrl, requireUser_1.default, upload.single('image'), (0, zodMiddlewares_1.default)(schema_user_1.updateProfileSchema, "body"), (0, catchAsync_1.default)(controller_user_1.updateProfileHandle));
    // checkin
    app.get(baseUrl + "/checkin", requireUser_1.default, (0, catchAsync_1.default)(controller_user_1.checkinHandle));
    // checkout
    app.get(baseUrl + "/checkout", requireUser_1.default, (0, catchAsync_1.default)(controller_user_1.checkoutHandle));
    // reset checking
    app.get(baseUrl + "/resetcheck", requireUser_1.default, (0, catchAsync_1.default)(controller_user_1.resetcheckincheckoutHandle));
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
exports.default = default_1;
