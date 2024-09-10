import { Response} from "express";
import userModel from "../models/user.model";

export const getUserById = async (id: string, res: Response) => {
    try {
      const user = await userModel.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  