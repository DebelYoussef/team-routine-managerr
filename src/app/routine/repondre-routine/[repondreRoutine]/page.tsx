"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import axios from 'axios';
import Question from '../../../components/question';

interface Options {
  id: number;
  value: string;
  questionId: number;
  checked: boolean;
}

interface Questions {
  id: number;
  type: string;
  question: string;
  options: Options[];
  visible: boolean;
}

interface Response {
  idQuestion: number;
  idRoutine: number;
  value: string;
 
}

interface RepondreRoutineProps {
  params: Params;
}

interface Params {
  repondreRoutine: string;
}

const RepondreRoutine: React.FC<RepondreRoutineProps> = ({ params }) => {
  const { repondreRoutine } = params;
  const idRoutine = parseInt(repondreRoutine, 10);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [routineName, setRoutineName] = useState("");
  const [responses, setResponses] = useState<Response[]>([]);
  const Publish = async () => {
    console.log("clicked");
    try {
      const response = await axios.post('http://localhost:3000/api/insertRoutineResponses', {
        employeeId:1,
        responses
       
       
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to add responses');
      }
  
      const result = response.data;
      console.log('responses added successfully:', result);
    } catch (error) {
      console.error('Error adding responses:', error);
    }
  };

  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/detailRoutine?routineId=${idRoutine}`);

        if (response.status !== 200) {
          throw new Error('Failed to fetch data');
        }

        const data = response.data;

        setRoutineName(data.routineName || 'Routine Name');
        setQuestions(data.questions || []);
        setResponses(data.responses || []); // Assuming responses are part of the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRoutineData();
  }, [idRoutine]);

  const handleQuestionClick = (clickedId: number) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.id === clickedId
          ? { ...question, visible: true }
          : { ...question, visible: false }
      )
    );
  };

  const handleResponseChange = (questionId: number, value: string, type: string, checked = false) => {
    setResponses(prevResponses => {
      let updatedResponses = [...prevResponses];

      if (type === 'checkbox') {
        if (checked) {
          updatedResponses.push({ idQuestion: questionId, idRoutine, value });
        } else {
          updatedResponses = updatedResponses.filter(response => !(response.idQuestion === questionId && response.value === value));
        }
      } else if (type === 'radio') {
        updatedResponses = updatedResponses.filter(response => response.idQuestion !== questionId);
        updatedResponses.push({ idQuestion: questionId, idRoutine, value });
      } else {
        updatedResponses = updatedResponses.filter(response => response.idQuestion !== questionId);
        updatedResponses.push({ idQuestion: questionId, idRoutine, value });
      }

      return updatedResponses;
    });
  };

  const getResponseValue = (questionId: number) => {
    const response = responses.find(res => res.idQuestion === questionId);
    return response ? response.value : '';
  };

  const getResponseChecked = (questionId: number, value: string) => {
    return !!responses.find(res => res.idQuestion === questionId && res.value === value);
  };

  return (
    <div className='cont h-full w-full font-poppins'>
      <div className='p-2 w-full flex justify-between pr-10 relative border-b border-b-neutral-200 '>
        <Link href={"/routine/"}>
          <MoveLeft className='h-9 w-9 mt-2 ml-3 cursor-pointer rounded-full p-1 hover:bg-neutral-200' />
        </Link>
        <h1 className="text-black text-2xl font-['Poppins'] mt-2 absolute left-[70px] font-bold">{routineName}</h1>
        <button className='btn w-[105px] h-[50px]' onClick={Publish}>Publish</button>
      </div>
      <div className='grid grid-cols-12 w-full h-full'>
        <div className='col-span-3 h-full p-5'>
          <div>
            <h1 className='text-xl font-bold mb-4 font-poppins'>Questions</h1>
            <hr />
            <div id='questions'>
              {questions.map((question) => (
                <div key={question.id} onClick={() => handleQuestionClick(question.id)}>
                  <Question
                    questionText={question.question}
                    questionType={question.type}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='col-span-9 h-full border border-neutral-200 p-5 grid grid-cols-12'>
          <div className='col-span-9 h-full mt-8 ml-3' id='responses'>
            {questions.filter(q => q.visible).map((question) => (
              <div key={question.id} className='mb-4'>
                <h2 className='font-bold mb-4'>{question.question}</h2>
                {question.type === 'text' && (
                  <textarea
                    name={`response_${question.id}`}
                    cols={80}
                    rows={8}
                    className='ml-2 border-[2px] border-[#F2F2F2] rounded p-4'
                    placeholder='Respond here'
                    value={getResponseValue(question.id)}
                    onChange={(e) => handleResponseChange(question.id, e.target.value, question.type)}
                  />
                )}
                {question.type === 'number' && (
                  <input 
                    type="number" 
                    placeholder='Put a number' 
                    className='ml-2 border-[2px] border-[#F2F2F2] rounded p-2 w-[400px]'
                    value={getResponseValue(question.id)}
                    onChange={(e) => handleResponseChange(question.id, e.target.value, question.type)}
                  />
                )}
                {question.type === 'checkbox' && question.options.map((option) => (
                  <div key={option.id} className='ml-3'>
                    <label>
                      <input 
                        type="checkbox" 
                        name={`response_${question.id}`} 
                        value={option.value} 
                        className='mr-2 mb-4 w-4 h-4'
                        checked={getResponseChecked(question.id, option.value)}
                        onChange={(e) => handleResponseChange(question.id, option.value, question.type, e.target.checked)}
                      />
                      {option.value}
                    </label>
                  </div>
                ))}
                {question.type === 'radio' && question.options.map((option) => (
                  <div key={option.id} className='ml-3'>
                    <label>
                      <input 
                        type="radio" 
                        name={`response_${question.id}`} 
                        value={option.value} 
                        className='mr-2 w-3 h-3'
                        checked={getResponseChecked(question.id, option.value)}
                        onChange={(e) => handleResponseChange(question.id, option.value, question.type)}
                      />
                      {option.value}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="col-span-3 h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default RepondreRoutine;
