'use client'
import DashboardHero from '@/app/components/Admin/DashBoardHero'
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar'
import AllUsers from '@/app/components/Admin/Users/AllUsers'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
         <AdminProtected>
     <Heading
        title="KnowledgeHub-Admin"
        description="KnowledgeHUb is a platform for student to learn and get help from teachers "
        keywords="programming ,MERN,Redux,Machine Lerning"
      />

      <div className="flex h-screen">
        <div className=" 1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
     <DashboardHero/>
     <AllUsers isTeam={true}/> 
     </div>
      </div>
     </AdminProtected>
    </div>
  )
}

export default page