import { Request, Response, NextFunction } from "express";
import { generateLast12MonthData } from "../utils/analytics.generator";
import OrderModel from "../models/orderModel";
import ErrorHandle from "../utils/ErrorHandle";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";

export const getUsersAnalytics= CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthData(userModel);
      
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandle("Failed to retrieve analytics data", 500));
    }
  }
);

export const getCourseAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await generateLast12MonthData(CourseModel);

    try {
    
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error) {
      return next(new ErrorHandle("Failed to retrieve analytics data", 500));
    }
  }
);

export const getOrderAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const orders = await generateLast12MonthData(OrderModel);
  
      try {
      
        res.status(200).json({
          success: true,
          orders,
        });
      } catch (error) {
        return next(new ErrorHandle("Failed to retrieve analytics data", 500));
      }
    }
  );
  