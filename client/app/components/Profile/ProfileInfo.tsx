import Image from "next/image";
import { FC, useEffect, useState } from "react";

import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";
import { styles } from "@/app/styles/style";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user?.name||"");
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] =
    useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onloadend = async () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result as string;
        try {
          await updateAvatar(avatar).unwrap(); // Await for the mutation to complete
          console.log("Avatar updated successfully.");
        } catch (err) {
          console.error("Failed to update avatar:", err);
        }
      }
    };
    fileReader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isSuccess ||success) {
       setLoadUser(true);
    }

    if (error || updateError) {
      console.error( error);
    }
    if(success){
      toast.success("profile updated successfully");
    }
  }, [isSuccess, error,success,updateError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name: name,
        
      });
    }
  };

  return (
    <div className="w-full flex justify-center items-center flex-col mt-10">
      {/* Avatar Section */}
      <div className="relative mb-6">
        <Image
          src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
          alt="User Avatar"
          width={120}
          height={120}
          className="w-[120px] h-[120px] border-[3px] border-[#37a39a] rounded-full object-cover"
          priority
        />
        <input
          type="file"
          id="avatar"
          className="hidden"
          onChange={imageHandler}
          accept="image/png, image/jpeg, image/webp"
        />
        <label htmlFor="avatar">
          <div className="w-[40px] h-[40px] bg-slate-900 rounded-full absolute bottom-0 right-0 flex items-center justify-center cursor-pointer border-[2px] border-white">
            <AiOutlineCamera size={20} color="#fff" />
          </div>
        </label>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block dark:text-gray-300 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block dark:text-gray-300 font-medium pb-2">
              Email Address
            </label>
            <input
              type="text"
              readOnly
              className={`${styles.input}  !w-[95%] mb-4 800px:mb-0`}
              value={user?.email}
            />
          </div>
          <input
          className={`w-full 800px:w-[250px] h-[40px] border-[#37a39a] text-center  items-center justify-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
           required
           value="Update"
           type="submit"
          />

          
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
