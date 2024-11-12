import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandle from "../utils/ErrorHandle";
import cloudinary from "cloudinary";
import CourseModel from "../models/course.model";
import { createCourse, getAllCoursesService } from "../services/course.service";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendmail";
import NotificationModel from "../models/notificationModel";
import { getAllUsersService } from "../services/user.service";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Incoming request body:", req.body); // Log the request body
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail && typeof thumbnail === "string") {
        // Upload the new thumbnail
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else if (!thumbnail) {
        // Handle case where no thumbnail is provided
        return next(new ErrorHandle("Thumbnail is required", 400));
      } else if (typeof thumbnail === "object" && thumbnail.public_id) {
        // Keep existing thumbnail if it's an object
        data.thumbnail = thumbnail;
      }

      // Proceed to create the course
      await createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  }
);

// edit course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail; // Extract thumbnail from request body
    const courseId = req.params.id.trim(); // Trim the course ID to remove any whitespace
    console.log("Thumbnail value in editCourse:", thumbnail);

    try {
      // Check if thumbnail is provided and contains a public_id
      if (thumbnail && thumbnail.public_id) {
        // If a new thumbnail is provided, first destroy the old one
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        // Ensure thumbnail.url is a string and not empty
        if (typeof thumbnail.url !== "string" || !thumbnail.url.trim()) {
          return next(
            new ErrorHandle("Thumbnail URL must be a non-empty string", 400)
          );
        }

        // Upload the new thumbnail using the URL
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail.url, {
          folder: "courses",
        });

        // Update the data with new thumbnail information
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      // Update the course in the database
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true } // Return the updated document
      );

      // Check if the course was found and updated
      if (!course) {
        return next(new ErrorHandle("Course not found", 404));
      }

      // Send back the updated course information
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      // Log the error and return a generic error response
      console.error("Error in editCourse:", error.message || error);
      return next(
        new ErrorHandle("Error updating course. Please try again later.", 500)
      );
    }
  }
);
// get single course -- without purchasing

export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCacheExist = await redis.get(courseId);
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        // console.log('hitting redis');
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.link"
        );
        await redis .set(courseId, JSON.stringify(course),'EX',604800);
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);
//get all courses --without purchasing
export const getAllCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourse");
      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        //cosole.log('hitting redis');
        res.status(200).json({
          success: true,
          courses,
        });
      }
      const course = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.link"
      );
      //  console.log('hitting mongodb');
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

// get course constent -- only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExits = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );
      if (!courseExits) {
        return next(
          new ErrorHandle("you are not eligible to access this course", 404)
        );
      }
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;

      // Validate courseId and contentId
      if (
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(contentId)
      ) {
        return next(new ErrorHandle("Invalid ID(s) provided", 400));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandle("Course not found", 404));
      }

      const courseContent = course.courseData.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandle("Content not found", 404));
      }

      // Create a new question object
      const newQuestion: any = {
        user: req.user, // Ensure req.user exists and has necessary fields
        question,
        questionReplies: [],
      };

      // Add the question to the course content
      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user:req.user?._id,
        title:"New Question Received",
        message:`you have a new question in ${courseContent.title} `,
      });
      // Save the updated course
      await course.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

interface IAddAnswerData {
  answer: string;
  courseId: string;
  questionId: string;
  contentId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      // Validate courseId, contentId, and questionId
      if (
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(contentId) ||
        !mongoose.Types.ObjectId.isValid(questionId)
      ) {
        return next(new ErrorHandle("Invalid ID provided", 400));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandle("Course not found", 404));
      }

      const courseContent = course.courseData.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandle("Content not found", 404));
      }

      const question = courseContent.questions.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandle("Question not found", 404));
      }

      // Create the answer
      const newAnswer: any = {
        user: req.user, // Ensure req.user exists and has necessary fields
        answer,
      };

      // Add answer to the question's replies
      question.questionReplies?.push(newAnswer);

      // Save the updated course
      await course.save();

      // Notify the user if the answer isn't from the original questioner
      if (req.user?._id !== question.user._id) {
        await NotificationModel.create({
          user:req.user?._id,
          title:"New Question Reply Received",
          message: `You have a new quesstion reply in ${courseContent.title}`,
        });
       }else{  const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandle(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

// add review
interface IAddReviewData {
  review: string;
  courseId: string;
  rating: string;
  UserId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      // Check if the user is eligible to access this course
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );
      if (!courseExists) {
        return next(
          new ErrorHandle("You are not eligible to review this course", 403)
        );
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandle("Course not found", 404));
      }

      const { review, rating } = req.body as IAddReviewData;
      const parsedRating = parseFloat(rating);

      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return next(
          new ErrorHandle("Rating must be a number between 1 and 5", 400)
        );
      }

      const reviewData: any = {
        user: req.user,
        rating: parsedRating,
        comment: review,
      };

      // Add the new review to the course's reviews array
      course.reviews.push(reviewData);

      // Calculate the average rating
      const totalRating = course.reviews.reduce(
        (sum: number, rev: any) => sum + rev.rating,
        0
      );
      course.ratings = totalRating / course.reviews.length;

      await course.save();

      const notification = {
        title: "New Review Received",
        message: `${req.user?.name} has given a review in ${course.name}`,
      };
      // create notification logic (assume there’s a function for this)

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

// add reply in review

interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandle("Course not found", 404));
      }

      const review = course.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandle("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };

      // Initialize commentReplies if it doesn't exist
      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies.push(replyData);

      await course.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

// get all courses-- only for admin
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  }
);

// delete course only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);
      if (!course) {
        return next(new ErrorHandle("user not found", 404));
      }
      await course.deleteOne({ id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        messagee: "course deleted successsfully",
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 400));
    }
  })