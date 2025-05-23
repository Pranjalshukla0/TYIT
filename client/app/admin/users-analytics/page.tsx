
"use client";
import React from "react";


import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import DashBoardHeader from "@/app/components/Admin/DashBoardHeader";

import UserAnalytics from "@/app/components/Admin/Analytics/UserAnalytics";

type Props = {};

function page({}: Props) {
  return (
    <div>
      <Heading
        title="KnowledgeHub -Admin"
        description="Elearning is a platform for the students to learn and get help from teachers"
        keywords=" Programming ,MERN ,REDUX,Machine learning"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
        <AdminSidebar/>
        
        </div>
        <div className="w-[85%]">
            <DashBoardHeader />
            <UserAnalytics/>
        </div>

      </div>
    </div>
  );
}

export default page;
