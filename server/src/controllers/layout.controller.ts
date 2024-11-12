import { Request, Response, NextFunction } from "express";
import LayoutModel from "../models/layout.model";
import ErrorHandle from "../utils/ErrorHandle";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import cloudinary from "cloudinary";

// Controller to create a new Layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      // Check if layout type already exists
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandle(`${type} already exists`, 400));
      }

      // Define layout data based on type
      let layoutData: {
        type: string;
        banner?: any;
        faq?: any;
        categories?: any;
      } = { type };

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        if (!image || !title || !subTitle) {
          return next(
            new ErrorHandle("Banner requires image, title, and subTitle", 400)
          );
        }

        // Upload image to cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });

        layoutData.banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
      } else if (type === "FAQ") {
        const { faq } = req.body;
        if (!faq) return next(new ErrorHandle("FAQ content is required", 400));
        layoutData.faq = faq || [];
      } else if (type === "Categories") {
        const { categories } = req.body;
        if (!categories)
          return next(new ErrorHandle("Categories content is required", 400));
        layoutData.categories = categories || [];
      } else {
        return next(new ErrorHandle("Invalid layout type", 400));
      }

      // Create layout document in database
      const layout = await LayoutModel.create(layoutData);

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
        data: layout,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);
// EDIT layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { type } = req.body;

      // Find the layout by ID
      const layout = await LayoutModel.findById(id);
      if (!layout) {
        return next(new ErrorHandle("Layout not found", 404));
      }

      // Update layout data based on type
      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        if (!title || !subTitle) {
          return next(
            new ErrorHandle("Banner requires title and subTitle", 400)
          );
        }

        // Update image if provided
        if (image) {
          // Remove the old image from Cloudinary
          if (layout.banner?.image?.public_id) {
            await cloudinary.v2.uploader.destroy(layout.banner.image.public_id);
          }
          // Upload new image
          const myCloud = await cloudinary.v2.uploader.upload(image, {
            folder: "Layout",
          });
          layout.banner.image = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }

        layout.banner.title = title;
        layout.banner.subTitle = subTitle;
      } else if (type === "FAQ") {
        const { faq } = req.body;
        if (!faq) return next(new ErrorHandle("FAQ content is required", 400));
        layout.faq = faq;
      } else if (type === "Categories") {
        const { categories } = req.body;
        if (!categories)
          return next(new ErrorHandle("Categories content is required", 400));
        layout.categories = categories;
      } else {
        return next(new ErrorHandle("Invalid layout type", 400));
      }

      // Save updated layout
      await layout.save();

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
        data: layout,
      });
    } catch (error: any) {
      next(new ErrorHandle(error.message, 500));
    }
  }
);

// get layout by Id

export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      const layout = await LayoutModel.findOne({ type });

      if (!layout) {
        return next(
          new ErrorHandle(`Layout with type '${type}' not found`, 404)
        );
      }

      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);
