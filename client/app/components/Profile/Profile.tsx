"use client";
import React, { FC, useState } from "react";
import SideBarProfile from "./SidesBarProfile";
import { useLogoutQuery } from "../../../redux/features/auth/authApi";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo"
import ChangePassword from "./ChangePassword";

type Props = {
  user: any;
};
const Profile: FC<Props> = (user) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });
  const logOutHandler = async () => {
     await signOut();
    setLogout(true);
    redirect("/");
  };
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }
  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#00000016] border-[#ffffff16] rounded-[5px]  shadow-xl dark:shadow-sm mt-[80px] sticky
             ${scroll ? "top-[120px]" : "top-[30px]"} left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
     
      </div>
      {active === 1 && (
       <div className="w-full h-full bg-transparent mt-[80px">
        <ProfileInfo  avatar={avatar} user={user}/>
   </div>     ) }
   {active === 2 && (
       <div className="w-full h-full bg-transparent mt-[80px">
<ChangePassword/>
   </div>     ) }
    </div>
  );
};
export default Profile;
