import express from 'express';
import {activateUser,socialAuth,loginUser,getUserInfo, logoutUser ,registrationUser,updateAccessToken}from '../controllers/user.controller';
import { authorizeRoles,IsAuthenticated} from "../middleware/auth";
const userRouter=express.Router();

userRouter.post('/registration',registrationUser);
userRouter.post('/activate-user',activateUser);
userRouter.post('/login',loginUser);
userRouter.get('/logout',IsAuthenticated/*,authorizeRoles("admin")*/,logoutUser);
userRouter.get("/refresh",updateAccessToken);
userRouter.get("/me",IsAuthenticated,getUserInfo);
userRouter.post('/social-auth',socialAuth);




export default userRouter;