import { NextFunction, Request, Response } from "express"

const createTaskHandle = async (req: Request, res: Response, next: NextFunction) => {
    // const {title, description, dueDate, priority, status, userId} = req.body
    // const task = await Task.create({title, description, dueDate, priority, status, userId})
    // res.status(201).json(task)
}

export {
    createTaskHandle
}