"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "../components/Admin/DashBoardHero";

type Props = {};

const page = (props: Props) => {
  
  return (
    <AdminProtected>
      <Heading
        title="KnowledgeHub-Admin"
        description="KnowledgeHub is a platform for students to learn and get help from teachers"
        keywords="programming, MERN, Redux, Machine Learning"
      />

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/5 1500px:w-[16%]">
          <AdminSidebar   />
        </div>

        {/* Main Content Area */}
        <div className="w-4/5 flex justify-center items-center">
          <DashboardHero isDashboard={true} />
        </div>
      </div>
    </AdminProtected>
  );
};

export default page;
