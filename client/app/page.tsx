"use client";
import React, { FC, useEffect, useState } from "react";
import Heading from "./utils/Heading";

import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";


const Chatbot = dynamic(() => import("./components/Chatbot/Chatbot"), { ssr: false });

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  
  return (
    <div>
      <Heading
          title={("KnowledgeHub")}
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Page;
