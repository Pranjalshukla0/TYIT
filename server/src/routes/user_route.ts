import express from "express";
import {
  activateUser,
  socialAuth,
  loginUser,
  getUserInfo,
  logoutUser,
  registrationUser,
  updateAccessToken,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller";
import { authorizeRoles, IsAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get(
  "/logout",
  IsAuthenticated /*,authorizeRoles("admin")*/,
  logoutUser
);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", IsAuthenticated, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", IsAuthenticated, updateUserInfo);
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
