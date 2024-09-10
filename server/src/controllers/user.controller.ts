require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandle from "../utils/ErrorHandle";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendmail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";

// Register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandle("Email already exists", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      // Send activationToken and response here if necessary
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email:${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandle(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as string,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandle("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandle("Email already exist", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  }
);
// login user
interface IloginRequest {
  email: string;
  password: string;
}
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as IloginRequest;
      if (!email || !password) {
        return next(new ErrorHandle("please enter email and password", 400));
      }
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandle("Invalid email or password", 400));
      }
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandle("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  }
);

//logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear access and refresh tokens in the cookies
      res.cookie("access_token", "", {
        maxAge: 1,
        httpOnly: true,
        sameSite: "lax",  // Adjust as needed
        secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      });
      
      res.cookie("refresh_token", "", {
        maxAge: 1,
        httpOnly: true,
        sameSite: "lax",  // Adjust as needed
        secure: process.env.NODE_ENV === "production",
      });

      // If userId is available, delete session from Redis
      const userId = req.user?._id;
      if (userId && typeof userId === "string") {
        try {
          const result = await redis.del(userId);
          console.log(`Redis key deleted, number of keys removed: ${result}`);
        } catch (err) {
          console.error("Error deleting Redis key:", err);
        }
      } else {
        console.log("No valid user ID provided for Redis key deletion");
      }

      // Send success response
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.error("Logout error:", error); // Log errors
      return next(new ErrorHandle(error.message, 400));
    }
  }
);

export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      // Verify the refresh token
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      if (!decoded || !decoded.id) {
        return next(new ErrorHandle("Could not refresh token", 400));
      }

      // Check session in Redis using the user ID
      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(new ErrorHandle("Could not refresh token", 400));
      }

      // Parse the session and generate new tokens
      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m", // 5 minutes
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d", // 3 days
        }
      );

      // Set the new tokens in cookies
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      // Send the new access token in the response
      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  }
);

export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    // Use await to properly handle the asynchronous function
    await getUserById(userId, res);
  } catch (error: any) {
    return next(new ErrorHandle(error.message, 400));
  }
});
 interface ISocialAuthBody{
  email:string;
  name:string;
  avatar:string;
 }

export const socialAuth = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const{email,name,avatar}=req.body as ISocialAuthBody;
    const user = await userModel.findOne({email});
    if(!user){
      const newUser = await userModel.create({email,name,avatar});
      sendToken(newUser,200,res);
    }else{
      sendToken(user,200,res);
    }
  } catch (error: any) {
    return next(new ErrorHandle(error.message,400));
  }
})