"use client";

import {use} from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import DashBoardHeader from "@/app/components/Admin/DashBoardHeader";
import EditCourse from "../../../components/Admin/Course/EditCourse";

type Props = {
  params: Promise<{id: string }>;
  
};

const Page = ({ params }: Props) => {
  const { id } = use(params);

  return (
    <div>
      <Heading
        title="KnowledgeHub - Admin"
        description="Elearning is a platform for students to learn and get help from teachers."
        keywords="Programming, MERN, REDUX, Machine Learning"
      />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/5">
          <AdminSidebar />
        </div>
        {/* Main Content */}
        <div className="w-[85%]">
          <DashBoardHeader />
          <EditCourse id={id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
