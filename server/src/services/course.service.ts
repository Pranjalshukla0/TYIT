import { NextFunction, Request, Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandle from "../utils/ErrorHandle";
import courseModel from "../models/course.model";

// Create course
export const createCourse = async (data: any, res: Response, next: NextFunction) => {
  try {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return next(new ErrorHandle("Error creating course", 500));
  }
};

// get all users
export const getAllCoursesService =async (res:Response)=>{
  const courses= await courseModel.find().sort({createdAt:-1});
  res.status(201).json({
    success:true,
    courses
  });
}