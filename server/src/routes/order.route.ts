import express from "express";
import { authorizeRoles, IsAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";

const orderRouter = express.Router();

// Create a new order
orderRouter.post("/create-order", IsAuthenticated, createOrder);

// Get all orders (admin only)
orderRouter.get(
  "/get-orders",
  IsAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

export default orderRouter;
