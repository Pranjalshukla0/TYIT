import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser; // Ideally, replace with a proper IUser interface
  question: string;
  questionReplies?: IComment[];
}

interface IReview extends Document {
  user: IUser; // Ideally, replace with a proper IUser interface
  rating: number;
  comment: string;
  commentReplies?: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object; // Define a proper type for videoThumbnail if necessary
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  Links: ILink[];
  suggestion: string;
  questions: IComment[];
}

interface ICourse extends Document {
  name: string;
  description?: string;
  price: number;
  estimatePrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

// Review schema
const reviewSchema = new Schema<IReview>({
  user: { type: Object, required: true }, // Define a proper user schema if necessary
  rating: {
    type: Number,
    default: 0,
  },
  comment: { type: String, required: true },
  commentReplies:[Object],
});

// Link schema
const linkSchema = new Schema<ILink>({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

// Comment schema
const commentSchema = new Schema<IComment>({
  user: { type: Object, required: true },
  question: { type: String, required: true },
  questionReplies: { type: [Schema.Types.Mixed], default: [] },
});

// Course data schema
const courseDataSchema = new Schema<ICourseData>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  videoThumbnail: { type: Object, required:true },
  videoSection: { type: String, required: true },
  videoLength: { type: Number, required: true },
  videoPlayer: { type: String, required: true },
  Links: [linkSchema],
  suggestion: { type: String },
  questions: [commentSchema],
});

// Course schema
const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  estimatePrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
    //  required: false,
    },
    url: {
      type: String,
    //  required: false,
    },
  },
  tags: {
    type: String,
    required: false,
  },
  level: {
    type: String,
    required: false,
  },
  demoUrl: {
    type: String,
    required: false,
  },
  benefits: [{ title: { type: String, required: true } }],
  prerequisites: [{ title: { type: String, required: true } }],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
},{timestamps:true});

courseSchema.index({createAt:1});
const CourseModel: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);
export default CourseModel;
