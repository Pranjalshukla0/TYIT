'use client';
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Loader from "./components/Loader/Loader";


interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      
      
      <Heading
        title="KnowledeHub"
        description="E-learning is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux, Next JS"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
    
      <Hero />
    </div>
  );
};

export default Page;
