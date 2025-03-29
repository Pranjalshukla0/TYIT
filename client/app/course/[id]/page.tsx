'use client';
import React, { use } from "react";
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

interface Params {
  id: string;
}

const Page = ({ params }: { params: Promise<Params> }) => {
    const resolvedParams = use(params) as Params; // Type assertion to fix TS error

    return (
        <div>
            <CourseDetailsPage id={resolvedParams.id} />
        </div>
    );
};

export default Page;
