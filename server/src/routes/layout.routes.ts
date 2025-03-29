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
    "/edit-Layout",
  
    IsAuthenticated,
    authorizeRoles("admin"),
    editLayout
  );

  LayoutRouter.get(
    "/get-Layout/:type",
  
    getLayoutByType
  );
export default LayoutRouter