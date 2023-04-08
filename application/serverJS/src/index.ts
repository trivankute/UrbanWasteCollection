import express, { NextFunction } from "express";
import config from "config";
import log from "./logger"
import { Request, Response } from "express"
import cookieParser from "cookie-parser";
import deserializeUser from "./middlewares/deserializeUser";
import ExpressError from "./utils/expressError";
import { StatusCodes } from "http-status-codes";
import cors from 'cors';

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(deserializeUser)

app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200)
});

import userRoutes from './routes/route.user'
import mcpRoutes from './routes/route.mcp'
import taskRoutes from './routes/route.task'

app.listen(port, host, async () => {
    // comment cua Tri Van
    log.info(`server list at http://${host}:${port}`);
    userRoutes(app)
    mcpRoutes(app)
    taskRoutes(app)
})

// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//     return next(new ExpressError('Not Found', StatusCodes.NOT_FOUND))
// })
// type ErrorType = {
//     status: number,
//     message: string
// }
// app.use((err: ErrorType, req: Request, res: Response, next: NextFunction) => {
//     const { status = 500, message = 'Something went wrong' } = err;
//     res.status(status).send(message)
// })