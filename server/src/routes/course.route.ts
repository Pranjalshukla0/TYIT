import express from "express";
import {
  addAnwser,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAdminAllCourses,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, IsAuthenticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  IsAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  IsAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get(
  "/get-admin-courses",
  IsAuthenticated,
  authorizeRoles("admin"),
  getAdminAllCourses
);

courseRouter.get("/get-course-content/:id", IsAuthenticated, getCourseByUser);

courseRouter.put("/add-question", IsAuthenticated, addQuestion);

courseRouter.put("/add-answer", IsAuthenticated, addAnwser);

courseRouter.put("/add-review/:id", IsAuthenticated, addReview);

courseRouter.put(
  "/add-reply",
  IsAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl, IsAuthenticated);

courseRouter.delete(
  "/delete-course/:id",
  IsAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
