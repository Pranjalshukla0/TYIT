"use client";

import { useRouter, usePathname } from "next/navigation";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const changeLanguage = (lang: string) => {
    router.replace(`/${lang}`); // Change URL with locale
  };
  
  return (               
    <div className="flex space-x-2">
      <button onClick={() => changeLanguage("en")} className="px-3 py-1 bg-gray-200 rounded">
        English
      </button>
      <button onClick={() => changeLanguage("hi")} className="px-3 py-1 bg-gray-200 rounded">
        हिंदी
      </button>
      <button onClick={() => changeLanguage("mr")} className="px-3 py-1 bg-gray-200 rounded">
        मराठी
      </button>
    </div>
  );
};

export default LanguageSwitcher;
