import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

export const getUserById = async (id: string, res: Response) => {
  try {
    const userJson = await redis.get(id);

    if (userJson) {
      const user = JSON.parse(userJson);

      return res.status(200).json({
        success: true,
        user,
      });
    }

    const userFromDb = await userModel.findById(id);

    if (!userFromDb) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await redis.set(id, JSON.stringify(userFromDb));

    return res.status(200).json({
      success: true,
      user: userFromDb,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all users
export const getAllUsersService =async (res:Response)=>{
  const users = await userModel.find().sort({createdAt:-1});
  res.status(201).json({
    success:true,
    users
  })
}

export const updateUserRoleService =async (res:Response,id:string,role:string)=>{
  const user = await userModel.findByIdAndUpdate(id,{role},{new:true});
  res.status(201).json({
    success:true,
    user,
  })
}