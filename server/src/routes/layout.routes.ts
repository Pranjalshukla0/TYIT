import express from "express";
import { authorizeRoles, IsAuthenticated } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";
const LayoutRouter = express.Router();

LayoutRouter.post(
  "/create-Layout",
  IsAuthenticated,
  authorizeRoles("admin"),
  createLayout
);

LayoutRouter.put(
    "/edit-Layout/:id",
    IsAuthenticated,
    authorizeRoles("admin"),
    editLayout
  );

  LayoutRouter.get(
    "/get-Layout",
    getLayoutByType
  );
export default LayoutRouter