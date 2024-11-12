import express from "express";
import { authorizeRoles, IsAuthenticated } from "../middleware/auth";
import { getNotifications, updateNotification } from "../controllers/notification.controller";
const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notification",
  IsAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);

notificationRoute.put(
    "/update-notification/:id",
    IsAuthenticated,
    authorizeRoles("admin"),
    updateNotification
  );
export default notificationRoute;