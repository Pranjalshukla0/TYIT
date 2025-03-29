import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandle";
import { IOrder } from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendmail";
import NotificationModel from "../models/notificationModel";
import { getAllOrderService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
// require("dotenv").config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user._id) {
        return next(new ErrorHandler("User is not authenticated", 401));
      }

      const { courseId, payment_info } = req.body as IOrder;

      const user = await userModel.findById(req.user._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (user.courses.some(course => course.courseId === courseId)) {
        return next(new ErrorHandler("You have already purchased this course", 400));
      }

      const course: ICourse | null = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const courseIdStr = String(course._id);
      const userIdStr = String(user._id);

      const data: any = {
        courseId: courseIdStr,
        userId: userIdStr,
        payment_info,
      };

      const mailData = {
        order: {
          _id: courseIdStr.slice(0, 6) || "000000",
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      // Sending email
      try {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
      } catch (error: any) {
        console.error("Email sending failed:", error.message);
      }

      // Add course to user's purchased courses
      user.courses.push({ courseId: courseIdStr });

      await user.save();

      // Create notification
      await NotificationModel.create({
        user: user._id,
        title: "New Order",
        message: `You have a new order for ${course.name}`,
      });

      // Increment course purchase count
      course.purchased += 1;
      await course.save();

      await newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// get All orders --- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrderService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/* //  send stripe publishble key
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// new payment
export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "E-Learning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
); */
