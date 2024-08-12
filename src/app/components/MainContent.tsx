"use client";
import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Package2, Home, Users2, ShoppingCart, LineChart, Package } from 'lucide-react';
import Link from 'next/link';

interface Question {
  type: string;
  text: string;
  options: string[];
}

const MyComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('question');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    type: '',
    text: '',
    options: []
  });

  const handleAddQuestion = () => {
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ type: '', text: '', options: [] });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between">
        <button
          className={`mr-5 w-[191px] h-[50px] font-medium bg-customred p-3 text-white rounded-xl text-lg font-['Poppins'] ${activeTab === 'question' ? 'border-b-4 border-pink-500' : ''}`}
          onClick={() => setActiveTab('question')}
        >
          Question
        </button>
        <button
          className={`mr-5 w-[191px] h-[50px] font-medium bg-customred p-3 text-white rounded-xl text-lg font-['Poppins'] ${activeTab === 'participant' ? 'border-b-4 border-pink-500' : ''}`}
          onClick={() => setActiveTab('participant')}
        >
          Participant
        </button>
        <button
          className={`mr-5 w-[191px] h-[50px] font-medium bg-customred p-3 text-white rounded-xl text-lg font-['Poppins'] ${activeTab === 'option' ? 'border-b-4 border-pink-500' : ''}`}
          onClick={() => setActiveTab('option')}
        >
          Option
        </button>
      </div>

      <div className="p-5">
        {activeTab === 'question' && (
          <div>
            <button
              className="mr-5 w-[191px] h-[50px] font-medium bg-[#FF2D60] p-3 text-white rounded-xl text-lg font-['Poppins']"
              onClick={() => setIsModalOpen(true)}
            >
              Add Questions
            </button>

            {questions.map((question, index) => (
              <div key={index} className="mt-5">
                <h3>{question.text}</h3>
                {question.options.map((option, idx) => (
                  <div key={idx}>{option}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="mb-5">Select a question type</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setQuestionType('text')} className="p-3 bg-blue-100 rounded-md">Texte</button>
              <button onClick={() => setQuestionType('rating')} className="p-3 bg-yellow-100 rounded-md">Rating</button>
              <button onClick={() => setQuestionType('checkbox')} className="p-3 bg-blue-100 rounded-md">Check box</button>
              <button onClick={() => setQuestionType('number')} className="p-3 bg-gray-100 rounded-md">Number</button>
              <button onClick={() => setQuestionType('multiple')} className="p-3 bg-blue-100 rounded-md">Multiple choice</button>
              <button onClick={() => setQuestionType('emoji')} className="p-3 bg-pink-100 rounded-md">Emoji</button>
            </div>

            {questionType && (
              <div className="mt-5">
                <input
                  type="text"
                  placeholder="Enter your question"
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                  className="p-3 border rounded-md w-full mb-3"
                />
                {(questionType === 'checkbox' || questionType === 'multiple') && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter an option"
                      value=""
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, options: [...currentQuestion.options, e.target.value] })}
                      className="p-3 border rounded-md w-full mb-3"
                    />
                    <button onClick={() => setCurrentQuestion({ ...currentQuestion, options: [...currentQuestion.options, ''] })}>Add Option</button>
                  </div>
                )}
                <div className="flex justify-between">
                  <button
                    onClick={handleAddQuestion}
                    className="bg-[#FF2D60] text-white p-3 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 text-black p-3 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
