import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, IsAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout",IsAuthenticated, logoutUser);

userRouter.get("/me", IsAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info",IsAuthenticated, updateUserInfo);

userRouter.put("/update-user-password", IsAuthenticated, updatePassword);

userRouter.put("/update-user-avatar", IsAuthenticated, updateProfilePicture);

userRouter.get(
  "/get-users",
  IsAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/update-user",
  IsAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
IsAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
