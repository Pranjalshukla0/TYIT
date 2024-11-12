import NotificationModel from "../models/notificationModel";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandle from "../utils/ErrorHandle";
import cron from "node-cron";
// get all notification --only admin
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createAt: -1,
      });
      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

//update notification status -- only admin
// update notification status -- only admin
export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      
      if (!notification) {
        return next(new ErrorHandle("Notification not found", 404));
      }
      
      // Set status to "read" explicitly
      notification.status = "read";
      await notification.save();

      // Fetch all notifications sorted by createdAt
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });
      
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);
//delete notification --only admin
cron.schedule("0 0 0  * * *", async()=>{
  const thirtyDaysAgo = new Date(Date.now()-30*24*60*60*1000);
  await NotificationModel.deleteMany({status:"read",createdAt:{$lt:thirtyDaysAgo}});
  console.log('Deleted read notification');
});