require('dotenv').config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {  errorMiddleware } from "./middleware/error";
import userRouter from "./routes/user_route";
export const app = express();
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import analyticsRouter from "./routes/analytics.routes";
import LayoutRouter from "./routes/layout.routes";
import notificationRoute from "./routes/notification.route"
// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// CORS => Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.ORIGIN 
}));
//routes
app.use("/api/v1",userRouter,orderRouter,courseRouter,notificationRoute,analyticsRouter,LayoutRouter);
//app.use("/api/v1",courseRouter);

// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

// Error handling middleware
app.use(errorMiddleware);
