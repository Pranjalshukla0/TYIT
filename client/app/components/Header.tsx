"use client";

import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModel from "../utils/CustomModel";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assets/avatar.png";
import { useSession } from "next-auth/react";
import { console } from "node:inspector/promises";
import { useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image,
        });
      }
    }
    if(isSuccess){
      toast.success("login Successfully");
    }
  }, [data, user]);
  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href="/"
                className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
              >
                KnowledgeHub
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {user ? (
                <Link href="/profile">
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    alt="User Avatar"
                    className="w-[30px] h-[30px] rounded-full cursor-pointer"
                    width={30}
                    height={30}
                    style={{border:activeItem===5?"2px solid #37a39a":"none"}}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[999999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0 transition transform translate-x-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-5 text-black dark:text-white"
                onClick={() => setOpen(true)}
              />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright &#169; 2024 KnowledgeHub
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activateItem={activeItem}
          component={Login}
        />
      )}
      {route === "Sign-Up" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activateItem={activeItem}
          component={SignUp}
        />
      )}
      {route === "Verification" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activateItem={activeItem}
          component={Verification}
        />
      )}
    </div>
  );
};

export default Header;
