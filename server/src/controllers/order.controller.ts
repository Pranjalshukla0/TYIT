import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandle from "../utils/ErrorHandle";
import CourseModel from "../models/course.model";
import userModel from "../models/user.model";
import { getAllOrderService, newOrder } from "../services/order.service";
import NotificationModel from "../models/notificationModel";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendmail";
import { IOrder } from "../models/orderModel";
import { getAllUsersService } from "../services/user.service";

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);

      if (!user) {
        return next(new ErrorHandle("User not found", 404));
      }

      const courseExistInUser = user.courses.some(
        (course: any) => course._id.toString() === courseId
      );
      if (courseExistInUser) {
        return next(
          new ErrorHandle("You have already purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandle("Course not found", 404));
      }

      const courseIdString = String(course._id); // Cast _id to string

      const data: any = {
        courseId: courseIdString,
        userId: user.id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: courseIdString.slice(0, 6), // _id as string
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData.order }
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",

          data: mailData,
          template: "order-confirmation.ejs",
        });
      } catch (error: any) {
        return next(new ErrorHandle(error.message, 500));
      }

      user.courses.push({ courseId: courseIdString }); // Push courseIdString to user.courses
      await user.save();

      await NotificationModel.create({
        user: user._id,
        title: "New Order",
        message: `You have a new order for ${course.name}`,
      });
      course.purchased ? (course.purchased += 1) : course.purchased;

      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

// get all order-- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrderService(res);
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  }
);
