import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";
// import Client1 from "../../../public/assets/client-1.png";
// import Client2 from "../../../public/assets/client-2.png";
// import Client3 from "../../../public/assets/client-3.png";
// import Banner from "../../../public/assets/banner.png";

type Props = {};

const Hero: FC<Props> = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center w-full min-h-screen px-4 lg:px-12">
      {/* Hero Image Section */}
      <div className="flex justify-center lg:justify-start w-full lg:w-1/2 relative mt-8 lg:mt-0">
        <div className="h-[50vh] w-[50vh] lg:h-[200px] lg:w-[200px] xl:h-[500px] xl:w-[500px] hero_animation rounded-full">
        <Image
            src="/assets/banner.png"
            alt="banner"
            width={50}
            height={50}
            className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-10"
          />

        </div>
      </div>

      {/* Hero Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0">
        <h4 className="dark:text-white text-[#000000c7] text-[24px] sm:text-[30px] lg:text-[48px] xl:text-[64px] font-[600] font-Josefin leading-[1.4] lg:leading-[1.2] px-2 lg:px-0">
          Improve Your Online Learning Experience Instantly
        </h4>

        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[16px] sm:text-[18px] mt-4 lg:mt-6 w-[90%] sm:w-[70%] lg:w-[80%] xl:w-[70%]">
          We have 40k+ online courses & 500k+ online registered students. Find
          your desired courses from them.
        </p>

        {/* Search Bar */}
        <div className="w-full sm:w-[80%] lg:w-[70%] h-[50px] bg-transparent relative mt-6">
          <input
            type="search"
            placeholder="Search Courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[16px] sm:text-[18px] font-[500] font-Josefin"
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className="text-white" size={30} />
          </div>
        </div>

        {/* Client Logos */}
        <div className="flex items-center justify-center lg:justify-start gap-4 mt-8 relative">
          <div className="relative">
            <Image
              src="/assets/client-1.png"
              alt="Client 1"
              width={50}
              height={50}
              className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full z-30"
            />
          </div>
          <div className="relative -ml-3 sm:-ml-5">
            <Image
              src="/assets/client-2.png"
              alt="Client 2"
              width={50}
              height={50}
              className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full z-20"
            />
          </div>
          <div className="relative -ml-3 sm:-ml-5">
            <Image
              src="/assets/client-3.png"
              alt="Client 3"
              width={50}
              height={50}
              className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full z-10"
            />
          </div>
          <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          500K+ people already trusted us.{" "}
          <Link href="/courses" className="text-blue-500 underline">
            View Courses
          </Link>
        </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
