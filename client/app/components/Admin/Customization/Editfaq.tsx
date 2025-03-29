"use client";
import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";
import { v4 as uuidv4 } from "uuid";

const EditFaq = () => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error, isLoading: isSaving }] = useEditLayoutMutation();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions([...data.layout.faq]);
    }
  }, [JSON.stringify(data?.layout?.faq)]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("FAQ updated successfully!");
    }
    if (error && "data" in error) {
      toast.error((error as any)?.data?.message || "Failed to update FAQ.");
    }
  }, [isSuccess, error]);

  // Toggle FAQ open/close
  const toggleQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  // Handle text input changes
  const handleChange = (id: string, field: "question" | "answer", value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, [field]: value } : q))
    );
  };

  // Add a new FAQ
  const addNewFaq = () => {
    setQuestions([
      ...questions,
      {
        _id: uuidv4(),
        question: "",
        answer: "",
        active: true, // Open new FAQs by default
      },
    ]);
  };

  // Check if changes exist
  const areQuestionsUnchanged = () => JSON.stringify(data?.layout?.faq) === JSON.stringify(questions);
  const isAnyFieldEmpty = () => questions.some((q) => !q.question.trim() || !q.answer.trim());

  // Save changes
  const handleEdit = async () => {
    if (!data?.layout?.faq || areQuestionsUnchanged() || isAnyFieldEmpty()) return;
    
    await editLayout({
      type: "FAQ",
      faq: questions,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
          <div className="mt-12">
            <dl className="space-y-8">
              {questions.map((q) => (
                <div key={q._id} className={`${q._id !== questions[0]?._id ? "border-t border-gray-200 pt-6" : ""}`}>
                  <dt className="text-lg">
                    <button
                      className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                      onClick={() => toggleQuestion(q._id)}
                    >
                      <input
                        className={`${styles.input} border-none`}
                        value={q.question}
                        onChange={(e) => handleChange(q._id, "question", e.target.value)}
                        placeholder="Add your question..."
                      />
                      <span className="ml-6 flex-shrink-0">
                        {q.active ? <HiMinus className="h-6 w-6" /> : <HiPlus className="h-6 w-6" />}
                      </span>
                    </button>
                  </dt>
                  {q.active && (
                    <dd className="mt-2 pr-12 flex items-center">
                      <input
                        className={`${styles.input} border-none flex-grow`}
                        value={q.answer}
                        onChange={(e) => handleChange(q._id, "answer", e.target.value)}
                        placeholder="Add your answer..."
                      />
                      <AiOutlineDelete
                        className="dark:text-white text-black text-[18px] cursor-pointer ml-4"
                        onClick={() => setQuestions(questions.filter((item) => item._id !== q._id))}
                      />
                    </dd>
                  )}
                </div>
              ))}
            </dl>

            <br />
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={addNewFaq}
            />
          </div>

          {/* Save Button */}
          <div className="w-full flex justify-end mt-6">
            <button
              className={`${
                styles.button
              } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black ${
                areQuestionsUnchanged() || isAnyFieldEmpty() || isSaving
                  ? "!cursor-not-allowed !bg-gray-400"
                  : "!cursor-pointer !bg-[#42d383]"
              } !rounded`}
              onClick={handleEdit}
              disabled={areQuestionsUnchanged() || isAnyFieldEmpty() || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;
