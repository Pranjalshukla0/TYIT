import {NextFunction, Response} from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/orderModel";
import orderModel from "../models/orderModel";

export const newOrder = CatchAsyncError(async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
      success: true,
      order,
    });
  });

  // get all order
export const getAllOrderService =async (res:Response)=>{
  const orders= await orderModel.find().sort({createdAt:-1});
  res.status(201).json({
    success:true,
    orders,
  });
}