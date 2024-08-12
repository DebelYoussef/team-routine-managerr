"use client";
import * as React from "react";
import { Trash2 } from "lucide-react";

interface QuestionProps {
  questionText: string;
  questionType: string;
  
}

export default function Question({ questionText, questionType }: QuestionProps) {
  return (
    <div className="flex mt-3 cursor-pointer flex-col px-2.5 py-3 relative bg-purple-50 rounded-xl border border-solid border-slate-200 max-w-[306px]">
      <div className="flex gap-1.5">
        <div className="text-sm font-medium text-black">
          {questionText}
        </div>
        <div className="flex flex-col justify-end self-start p-0.5 ">
         
        </div>
      </div>
      <div className="justify-center self-start px-2.5 py-1 mt-2.5 text-xs font-semibold text-pink-400 whitespace-nowrap bg-pink-400 bg-opacity-20 rounded-[33px]">
        {questionType}
      </div>
    </div>
  );
}
