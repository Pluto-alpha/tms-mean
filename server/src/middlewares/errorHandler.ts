import { Request, Response, NextFunction } from "express";
import { constants } from "../constants";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({
                title: "Validation Failed",
                message: error.message,
                stackTrace: error.stack,
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: error.message,
                stackTrace: error.stack,
            });
            break;
        case constants.UNAUTHORIZED:
            res.json({
                title: "Unauthorized",
                message: error.message,
                stackTrace: error.stack,
            });
            break;
        case constants.FORBIDDEN:
            res.json({
                title: "Forbidden",
                message: error.message,
                stackTrace: error.stack,
            });
            break;
        case constants.SERVER_ERROR:
            res.json({
                title: "Server Error",
                message: error.message,
                stackTrace: error.stack,
            });
            break;
        default:
            res.status(500).json({
                title: "Unknown Error",
                message: "An unexpected error occurred.",
                stackTrace: error.stack,
            });
            break;
    }
    next();
};

