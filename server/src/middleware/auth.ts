import{ Request, Response, NextFunction } from "express";
import {CatchAsyncError} from "./catchAsyncErrors";
import ErrorHandle from "../utils/ErrorHandle";
import jwt, {JwtPayload} from "jsonwebtoken";
import {redis}from "../utils/redis";
// authenticated user

export const IsAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies.access_token as string;
  
      if (!access_token) {
        return next(new ErrorHandle("Please login to access this resource", 400));
      }
  
      const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
  
      if (!decoded) {
        return next(new ErrorHandle("Access token is not valid", 400));
      }
  
      const user = await redis.get(decoded.id);
  
      if (!user) {
        return next(new ErrorHandle("User not found", 400));
      }
  
      req.user = JSON.parse(user);
      next();
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  });

// validate user role 
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user?.role || "")) {
        return next(
          new ErrorHandle(`Role: ${req.user?.role} is not allowed to access this resource`, 400)
        );
      }
      next();
    };
  };