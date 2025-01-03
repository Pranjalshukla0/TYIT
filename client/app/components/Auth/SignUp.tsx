"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { styles } from "../../../app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string()
    .required("Please enter your password!")
    .min(6, "Password must be at least 6 characters"),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful";
      toast.success(message);
      setRoute("Verification");
    }

    if (error && typeof error === "object" && "data" in error) {
      const errorData = error as { data: { message: string } };

      // Show a specific message for existing email
      if (errorData.data.message.includes("Email already exists")) {
        toast.error("This email is already registered. Please use a different email.");
      } else {
        toast.error(errorData.data.message);
      }
    } else if (error) {
      console.error("An unexpected error occurred:", error);
    }
  }, [isSuccess, error, setRoute]);

  const formik = useFormik({
    initialValues: { name: "", username: "", email: "", password: "" },
    validationSchema: schema, 
    onSubmit: async (values) => {
      const payload = {
        username: values.name, 
        email: values.email,
        password: values.password,
      };
      await register(payload);
    },
  });
  

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto">
      <h1 className={styles.title}>Join KnowledgeHub</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-3">
          <label className={styles.label} htmlFor="name">
            Enter your Name:
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="e.g., John Doe"
            className={`${
              errors.name && touched.name ? "border-red-500" : ""
            } ${styles.input}`}
            aria-label="Enter your name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>
          )}
        </div>

        <div className="mb-4">
          <label className={styles.label} htmlFor="email">
            Enter your Email:
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="example@mail.com"
            className={`${
              errors.email && touched.email ? "border-red-500" : ""
            } ${styles.input}`}
            aria-label="Enter your email"
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
          )}
        </div>

        <div className="mb-4 relative">
          <label className={styles.label} htmlFor="password">
            Enter your Password:
          </label>
          <input
            type={show ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="Password"
            className={`${
              errors.password && touched.password ? "border-red-500" : ""
            } ${styles.input}`}
            aria-label="Enter your password"
          />
          <button
            type="button"
            className="absolute right-2 top-10 text-gray-500"
            onClick={() => setShow(!show)}
            aria-label="Toggle password visibility"
          >
            {show ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
          </button>
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
          )}
        </div>

        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        <h5 className="text-center text-sm text-black dark:text-white mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Sign in
          </span>
        </h5>
      </form>
    </div>
  );
};

export default SignUp;
