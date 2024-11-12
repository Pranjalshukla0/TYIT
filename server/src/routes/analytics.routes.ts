import express from "express";
import {  getCourseAnalytics, getOrderAnalytics,  getUsersAnalytics } from "../controllers/analytics.controller";
import { IsAuthenticated, authorizeRoles } from "../middleware/auth";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  IsAuthenticated,
  authorizeRoles("admin"),
  getUsersAnalytics
);

analyticsRouter.get(
  "/get-courses-analytics",
  IsAuthenticated,
  authorizeRoles("admin"),
  getCourseAnalytics
);
analyticsRouter.get(
    "/get-orders-analytics",
    IsAuthenticated,
    authorizeRoles("admin"),
    getOrderAnalytics
  );

export default analyticsRouter;
