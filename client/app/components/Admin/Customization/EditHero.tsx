import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import Image from "next/image";

type Props = {};

const EditHero: FC<Props> = ({}) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner.title);
      setSubTitle(data?.layout?.banner.subTitle);
      setImage(data?.layout?.banner?.image?.url);
    }
    if (isSuccess) {
      refetch();
      toast.success("Hero Updated successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, isSuccess, error]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  return (
    <>
      <section className="flex flex-col lg:flex-row items-center w-full min-h-screen px-4 lg:px-12">
        {/* Image Section */}
        <div className="flex justify-center lg:justify-start w-full lg:w-1/2 relative mt-8 lg:mt-0">
          <div className="h-[60vh] w-[60vh] lg:h-[600px] lg:w-[600px] xl:h-[300px] xl:w-[300px] hero_animation rounded-full">
            <img
              src={image } // Default image in case of empty image state
              alt="banner"
              className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-10"
            />
          </div>
          <input
            type="file"
            name=""
            id="banner"
            accept="image/*"
            onChange={handleUpdate}
            className="hidden"
          />
          <label
            htmlFor="banner"
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-200"
          >
            <AiOutlineCamera className="text-black text-[18px]" />
          </label>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0">
          {/* Title Textarea */}
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="dark:text-white resize-none text-[#000000c7] text-[30px] 1000px:text-[40px] 1500px:text-[50px] font-[600] font-Josefin bg-transparent w-full focus:outline-none placeholder-gray-300 mb-5 overflow-hidden"
            placeholder="Improve your Online Learning Experience Better Instantly"
            rows={4}
          />
          <br />
          {/* Subtitle Textarea */}
          <textarea
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            className="dark:text-white text-black font-[500] text-[18px] 1000px:text-[20px] 1000px:!w-[90%] 1500px:!w-[80%] bg-transparent font-Josefin leading-[1.6] focus:outline-none placeholder-gray-400 overflow-hidden"
            placeholder="We have 40k+ online courses & 500k+ online registered students. Find your desired courses from them."
          ></textarea>
          <br />
          <br />
          <br />
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34]
              ${
                data?.layout.banner?.title !== title ||
                data?.layout.banner?.subTitle !== subTitle ||
                data?.layout.banner?.image?.url !== image
                  ? "!cursor-pointer !bg-[#42d383]"
                  : "!cursor-not-allowed"
              } !rounded absolute bottom-12 right-12`}
            onClick={
              data?.layout.banner?.title !== title ||
              data?.layout.banner?.subTitle !== subTitle ||
              data?.layout.banner?.image?.url !== image
                ? handleEdit
                : () => null
            }
          >
            Save
          </div>
        </div>
      </section>
    </>
  );
};

export default EditHero;
