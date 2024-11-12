import express from "express";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, IsAuthenticated } from "../middleware/auth";

const courseRouter = express.Router();

// Create course
courseRouter.post(
  "/create-course",
  IsAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

// Edit course
courseRouter.put(
  "/edit-course/:id",
  IsAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

// Get single course
courseRouter.get("/get-course/:id", getSingleCourse);

// Get all courses
courseRouter.get("/get-courses", getAllCourse);

// Get course content for a user
courseRouter.get(
  "/get-course-content/:id", 
  IsAuthenticated,
  getCourseByUser
);

// Add a question
courseRouter.put(
  "/add-question", 
  IsAuthenticated,
  addQuestion
);

// Add an answer
courseRouter.put(
  "/add-answer", 
  IsAuthenticated,
  addAnswer
);

// Add a review
courseRouter.put(
  "/add-review/:id", 
  IsAuthenticated,
  addReview
);

// Add a reply to a review
courseRouter.put(
  "/add-reply", 
  IsAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

// Get all courses for admin
courseRouter.get(
  "/get-courses-admin", 
  IsAuthenticated,
  authorizeRoles("admin"),
  getAllCourses
);

courseRouter.delete(
  "/delete-course/:id", 
  IsAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);
export default courseRouter;
