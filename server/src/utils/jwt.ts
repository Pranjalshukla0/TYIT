require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";  // User model with custom methods
import { redis } from "./redis";  // Redis client


// Interface for cookie options
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Function to send tokens in response with cookies
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();  // Generate access token
  const refreshToken = user.SignRefreshToken();  // Generate refresh token

  // Convert user._id to string before setting it in Redis
  const userId = user._id?.toString();  // Safely convert _id to string

  // Store user session in Redis with user._id as key
  if (userId) {
    redis.set(userId, JSON.stringify(user));  // Using stringified _id
  } else {
    console.error("User ID is missing or invalid");
    return res.status(500).json({ success: false, message: "User ID is missing" });
  }

  // Parse environment variables or use default expiration values
  const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
  const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);

  // Options for the access token cookie
  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  // Options for the refresh token cookie
  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  // Ensure cookies are secure in production environment
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  // Set cookies in response
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Send the response with success message, user info, and tokens
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
