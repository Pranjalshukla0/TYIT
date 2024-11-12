import { Schema, model, Document } from "mongoose";

interface FaqItem {
  question: string;
  answer: string;
}

interface Category {
  title: string;
}

interface BannerImage {
  public_id: string;
  url: string;
}

interface Layout extends Document {
  type: string;
  faq: FaqItem[];
  categories: Category[];
  banner: {
    image: BannerImage;
    title: string;
    subTitle: string;
  };
}

// Schema for FaqItem
const faqSchema = new Schema<FaqItem>({
  question: { type: String },
  answer: { type: String },
});

// Schema for Category
const categorySchema = new Schema<Category>({
  title: { type: String },
});

// Schema for BannerImage
const bannerImageSchema = new Schema<BannerImage>({
  public_id: { type: String },
  url: { type: String },
});

// Schema for Layout
const layoutSchema = new Schema<Layout>({
  type: { type: String },
  faq: { type: [faqSchema] },
  categories: { type: [categorySchema] },
  banner: {
    image: { type: bannerImageSchema },
    title: { type: String },
    subTitle: { type: String },
  },
});

const LayoutModel = model<Layout>("Layout", layoutSchema);

export default LayoutModel;
