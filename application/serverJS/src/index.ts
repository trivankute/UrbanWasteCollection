import express, { NextFunction } from "express";
import config from "config";
import log from "./logger"
import { Request, Response } from "express"
import cookieParser from "cookie-parser";
import deserializeUser from "./middlewares/deserializeUser";
import ExpressError from "./utils/expressError";
import { StatusCodes } from "http-status-codes";
import cors from 'cors';
import http from 'http';

const port = config.get("port") as number;
const host = config.get("host") as string;

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}  

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
import vehicleRoutes from './routes/route.vehicle'
import workersRoutes from './routes/route.workers'
import disposalfactoryRoutes from './routes/route.disposalfactory'
import configureSocket from "./socket";

userRoutes(app)
mcpRoutes(app)
taskRoutes(app)
vehicleRoutes(app)
workersRoutes(app)
disposalfactoryRoutes(app)
const server = http.createServer(app);

configureSocket(server)

server.listen((process.env.PORT||port), async () => {
    // comment cua Tri Van
    log.info(`server list at http://${host}:${port}`);
})

type ErrorType = {
    status: number,
    message: string
}
app.all('*', (err: ErrorType, req: Request, res: Response, next: NextFunction) => {
    return next(new ExpressError('Not Found', StatusCodes.NOT_FOUND))
})
app.use((err: ErrorType, req: Request, res: Response, next: NextFunction) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).json({status:"fail", message: message})
})