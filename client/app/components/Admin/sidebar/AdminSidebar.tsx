'use client';
import React, { FC, useState, useEffect } from "react";
import {
  HomeOutlined,
  PeopleOutlined,
  ReceiptOutlined,
  OndemandVideo,
  Quiz,
  Settings,
  Logout,
  ManageHistory,
  BarChart,
  PieChart,
  ArrowBackIos,
  ArrowForwardIos,
  Web,
  Wysiwyg,
} from "@mui/icons-material";
import avatarDefault from "../../../../public/assets/avatar.png";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Box, Typography, IconButton, Link } from "@mui/material";
import { signOut } from "next-auth/react";

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (title: string) => void;
}

const SidebarItem: FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => (
  <Box
    display="flex"
    alignItems="center"
    padding="10px 20px"
    sx={{
      backgroundColor: selected === title ? "#6870fa" : "transparent",
      borderRadius: "5px",
      "&:hover": { backgroundColor: "#868dfb" },
    }}
    onClick={() => setSelected(title)}
  >
    {icon}
    <Link href={to} style={{ marginLeft: "10px", textDecoration: "none", color: "inherit" }}>
      <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
    </Link>
  </Box>
);

const Sidebar: FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [selected, setSelected] = useState("Dashboard");
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const logOutHandler = async () => {
      setLogout(true);
      await signOut();
    };

  return (
    <Box
      sx={{
        
          zIndex: 1201,
          background: theme === "dark" ? "#111C43" : "#fff",
          color: theme === "dark" ? "#ffffffc1" : "#000",
          height: "100vh",
          width: isCollapsed ? "70px" : "250px",
          overflowY: "auto", // Enable vertical scrolling
          position: "fixed",
          top: 0,
          left: 0,
          padding: "10px",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#6870fa",
            borderRadius: "8px",
          },
          "&": {
            scrollbarWidth: "thin", // Firefox scrollbar
            scrollbarColor: "#6870fa #111C43", // Firefox colors
          },
          transition: "width 0.3s ease",
        
        
      }}
    >
       <Box>
        {/* Sidebar Toggle */}
        <Box
          display="flex"
          justifyContent={isCollapsed ? "center" : "space-between"}
          alignItems="center"
          padding="10px"
        >
          {!isCollapsed && (
            <Typography variant="h6" sx={{ marginLeft: "10px", fontWeight: 600 }}>
              KnowledegHub
            </Typography>
          )}
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{ color: theme === "dark" ? "#ffffff" : "#000000", }}
          >
            {isCollapsed ? <ArrowForwardIos /> : <ArrowBackIos />}
          </IconButton>
        </Box>

      {/* Profile Section */}
      
      <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          padding="20px 0"
        >
      <Image
            src={user?.avatar?.url || avatarDefault}
            alt="profile picture"
            width={isCollapsed ? 50 : 100}
            height={isCollapsed ? 50 : 100}
            style={{
              borderRadius: "50%",
              border: "3px solid #5b6fe6",
              transition: "width 0.3s ease, height 0.3s ease",
            }}
          />
      {!isCollapsed && (
            <Box mt={2}>
              <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 500 }}>
                {user?.name || "User Name"}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "14px",color: theme === "dark" ? "#aaa" : "#555"  }}>
                - {user?.role?.toUpperCase() || "Role"}
              </Typography>
            </Box>
          )}
          </Box>
          </Box>
      {/* Sidebar Items */}
      <Box>
        {/* Dashboard */}
        <SidebarItem
          title="Dashboard"
          to="/admin"
          icon={<HomeOutlined />}
          selected={selected}
          setSelected={setSelected}
        />

        {/* Data Section */}
        {!isCollapsed && <Typography className="!text-[18px] mt-3 ml-4">Data</Typography>}
        <SidebarItem
          title="Users"
          to="/admin/users"
          icon={<PeopleOutlined />}
          selected={selected}
          setSelected={setSelected}
        />
        <SidebarItem
          title="Invoices"
          to="/admin/invoices"
          icon={<ReceiptOutlined />}
          selected={selected}
          setSelected={setSelected}
        />

        {/* Content Section */}
        {!isCollapsed && <Typography className="!text-[18px] mt-3 ml-4">Content</Typography>}
        <SidebarItem
          title="Create Course"
          to="/admin/create-course"
          icon={<OndemandVideo />}
          selected={selected}
          setSelected={setSelected}
        />
        <SidebarItem
          title="Live Courses"
          to="/admin/courses"
          icon={<Quiz />}
          selected={selected}
          setSelected={setSelected}
        />

        {/* Customization */}
        {!isCollapsed && <Typography className="!text-[18px] mt-3 ml-4">Customization</Typography>}
        <SidebarItem
          title="Hero"
          to="/admin/hero"
          icon={<Web />}
          selected={selected}
          setSelected={setSelected}
        />
        <SidebarItem
          title="FAQ"
          to="/faq"
          icon={<Quiz />}
          selected={selected}
          setSelected={setSelected}
        />
        

        {/* Controllers */}
        {!isCollapsed && <Typography className="!text-[18px] mt-3 ml-4">Controllers</Typography>}
        <SidebarItem
          title="Manage Team"
          to="/admin/team"
          icon={<PeopleOutlined />}
          selected={selected}
          setSelected={setSelected}
          
        />

        {/* Analytics */}
        {!isCollapsed && <Typography className="!text-[18px] mt-3 ml-4">Analytics</Typography>}
        <SidebarItem
          title="Users Analytics"
          to="/admin/users-analytics"
          icon={<ManageHistory />}
          selected={selected}
          setSelected={setSelected}
        />
        <SidebarItem
          title="Courses Analytics"
          to="/admin/courses-analytics"
          icon={<BarChart />}
          selected={selected}
          setSelected={setSelected}
        />
        <SidebarItem
          title="Orders Analytics"
          to="/admin/orders-analytics"
          icon={<PieChart />}
          selected={selected}
          setSelected={setSelected}
        />

        {/* Extras */}
        {!isCollapsed && <Typography className="!text-[18px] mt-3 ml-4">Extras
          
          </Typography>}
        <div  onClick={() => logOutHandler()}>
        <SidebarItem
          title="Logout"
          to="/"
          icon={<Logout />}
          selected={selected}
          setSelected={setSelected}
          
        />
        </div>
      </Box>
    </Box>
  );
};

export default Sidebar;
