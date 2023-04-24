"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const deserializeUser_1 = __importDefault(require("./middlewares/deserializeUser"));
const expressError_1 = __importDefault(require("./utils/expressError"));
const http_status_codes_1 = require("http-status-codes");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const port = config_1.default.get("port");
const host = config_1.default.get("host");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(deserializeUser_1.default);
app.get("/healthcheck", (req, res) => {
    res.sendStatus(200);
});
const route_user_1 = __importDefault(require("./routes/route.user"));
const route_mcp_1 = __importDefault(require("./routes/route.mcp"));
const route_task_1 = __importDefault(require("./routes/route.task"));
const route_vehicle_1 = __importDefault(require("./routes/route.vehicle"));
const route_workers_1 = __importDefault(require("./routes/route.workers"));
const route_disposalfactory_1 = __importDefault(require("./routes/route.disposalfactory"));
const socket_1 = __importDefault(require("./socket"));
(0, route_user_1.default)(app);
(0, route_mcp_1.default)(app);
(0, route_task_1.default)(app);
(0, route_vehicle_1.default)(app);
(0, route_workers_1.default)(app);
(0, route_disposalfactory_1.default)(app);
const server = http_1.default.createServer(app);
(0, socket_1.default)(server);
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    // comment cua Tri Van
    logger_1.default.info(`server list at http://${host}:${port}`);
}));
app.all('*', (err, req, res, next) => {
    return next(new expressError_1.default('Not Found', http_status_codes_1.StatusCodes.NOT_FOUND));
});
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).json({ status: "fail", message: message });
});
