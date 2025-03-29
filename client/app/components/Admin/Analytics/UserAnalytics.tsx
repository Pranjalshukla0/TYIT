 "use client"
import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";


type Props = {
    isDashboard?:boolean;
}


//   const analyticsData = [
//     {name: "Jan 2024", count:120},
//     { name: "Feb 2024", count: 440 },
//     { name: "March 2024", count: 8200 },

//     { name: "April 2024", count: 4033 },
//     { name: "May 2024", count: 4502 },

//     { name: "June 2024", count: 2047 },

//     { name: "July 2024", count: 3452 },

//     { name: "August 2024", count: 6526 },
//     { name: "Sept 2024", count: 5667 },

//     { name: "Oct 2024", count: 1320 },

//     { name: "Nov 2024", count: 6526 },

//     { name: "Dec 2024", count: 5480 },

//     { name: "Jan 2025", count: 485 },
//   ];


const UserAnalytics = ({isDashboard}: Props) => {
  const { data,isLoading}=useGetUsersAnalyticsQuery({});
   const analyticsData:any=[];
   
   data && 
   data.users.last12Months.forEach((item: any)=>{
    analyticsData.push({name: item.month,count: item.count});
   });
  
  return (
    <>
    { 
    isLoading ? (
        <Loader/>
    ):(
       <div className={`${isDashboard ? "mt-[50px]" : "mt-[50px]  dark:bg-[#111C43] shadow-sm pb-5 rounded-sm" }`}>
        <div className={`${isDashboard ? "!ml-8 mb-5" : ""}`}>
            <h1 className={`${styles.title} ${isDashboard && '!text-[20px]'} px-5 !text-start`}>
                Users Analytics
            </h1>
         {
            !isDashboard && (
                <p className={`${styles.label} px-5`}>
                    Last 12 months analytics data{" "}
                </p>
            )
         }
        </div>
        <div className={`w-full ${isDashboard ? 'h-[30vh]':'h-screen'} flex items-center justify-center`}>
            <ResponsiveContainer width={isDashboard ? '100%':'90%'} height={!isDashboard ? '50%':'100%'}>
         <AreaChart
         data={analyticsData}
         margin={{
            top:20,
            right:30,
            left:0,
            bottom: 0,
         }}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Area
            type="monotone"
            dataKey="count"
            stroke="#4d62d9"
            fill="#4d62d9"
            />
         </AreaChart>
            </ResponsiveContainer>

        </div>
        </div> 
    )
}
    </>

  )

}

export default UserAnalytics