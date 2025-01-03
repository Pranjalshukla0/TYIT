"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string()
    .required("Please enter your password!")
    .min(6, "Password must be at least 6 characters"),
});

const Login: FC<Props> = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, isError, error, isLoading }] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading("Logging in...");
    }

    if (isSuccess) {
      toast.dismiss(); // Remove any loading toast
      toast.success("Login Successful");
      setOpen(false);
    }

    if (isError) {
      toast.dismiss(); // Remove any loading toast
      if (error && "data" in error) {
        const errorData = error as any;
        toast.error(errorData.data?.message || "An unknown error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }, [isSuccess, isError, error, isLoading, setOpen]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className={styles.title}>Login with KnowledgeHub</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        {/* Email Input */}
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
            placeholder="loginmail@gmail.com"
            className={`${
              errors.email && touched.email ? "border-red-500" : ""
            } ${styles.input}`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        {/* Password Input */}
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
            placeholder="password@#%"
            className={`${
              errors.password && touched.password ? "border-red-500" : ""
            } ${styles.input}`}
          />
          <button
            type="button"
            className="absolute right-2 top-10 text-gray-500"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <AiOutlineEye size={20} />
            ) : (
              <AiOutlineEyeInvisible size={20} />
            )}
          </button>
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Social Login */}
        <h5 className="text-center text-sm text-black dark:text-white">
          or join with
        </h5>
        <div className="flex justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mx-2"
           onClick={()=>signIn("google")}
          />
          <AiFillGithub
            size={30}
            className="cursor-pointer mx-2 text-black dark:text-white"
          onClick={()=> signIn("gitHub")}
          />
        </div>

        {/* Signup Link */}
        <h5 className="text-center text-sm text-black dark:text-white">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              console.log("Navigating to Sign-Up page");
              setRoute("Sign-Up");
            }}
          >
            Sign up
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Login;
