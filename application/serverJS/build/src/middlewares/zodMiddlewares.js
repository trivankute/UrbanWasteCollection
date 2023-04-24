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
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const zodMiddlewares = (schema, type) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (type === "body") {
                yield schema.parseAsync(req.body);
            }
            else if (type === "param") {
                yield schema.parseAsync(req.params);
            }
            else if (type === "query") {
                yield schema.parseAsync(req.query);
            }
            next();
        }
        catch (error) {
            let errors;
            if (error instanceof zod_1.z.ZodError) {
                errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message.replace(/_/g, ' '),
                }));
            }
            res.status(400).json({ status: "fail", errors: errors });
        }
    });
};
exports.default = zodMiddlewares;
