import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();
  const passwordChangeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("password do not match");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("password changed successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-4">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center gap-6"
        >
          {/* Old Password Field */}
          <div className="w-full 800px:w-[60%]">
            <label
              htmlFor="old-password"
              className="block dark:text-gray-300 font-medium mb-2"
            >
              Enter Your Old Password
            </label>
            <input
              id="old-password"
              type="password"
              aria-label="Old Password"
              className={`${styles.input} w-full mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          {/* New Password Field */}
          <div className="w-full 800px:w-[60%]">
            <label
              htmlFor="new-password"
              className="block dark:text-gray-300 font-medium mb-2"
            >
              Enter Your New Password
            </label>
            <input
              id="new-password"
              type="password"
              aria-label="New Password"
              className={`${styles.input} w-full mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="w-full 800px:w-[60%]">
            <label
              htmlFor="confirm-password"
              className="block dark:text-gray-300 font-medium mb-2"
            >
              Confirm Your Password
            </label>
            <input
              id="confirm-password"
              type="password"
              aria-label="Confirm Password"
              className={`${styles.input} w-full mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <input
            type="submit"
            value="Update"
            className="w-full 800px:w-[250px] h-[40px] border-[#37a39a] bg-[#37a39a] text-white text-center rounded-[3px] mt-4 cursor-pointer hover:opacity-90"
          />
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
