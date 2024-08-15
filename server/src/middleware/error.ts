import { NextFunction, Request, Response } from "express";
import ErrorHandle from "../utils/ErrorHandle";

export default errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error ";

  // wrong mongoDB id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandle(message, 400);
  }
  // duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyvalues)}entered`;
    err = new ErrorHandle(message, 400);
  }
   //  wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = "Json web token is invalid try again";
    err = new ErrorHandle(message, 400);
  }

  // jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = "Json token is expired try again";
    err = new ErrorHandle(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};