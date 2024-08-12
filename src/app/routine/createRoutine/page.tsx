"use client";
import { useRouter } from 'next/router';
import React, { useEffect,useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { MoveLeft, FilePenLine, Star, SquarePen, CircleCheckBig, Smile, CircleDot, Trash } from 'lucide-react';
import Image from 'next/image';
import Switch2 from '../../components/Switch2';
import { Button } from "@/components/ui/button";
import Participants from './../../components/Participants';
import Option from './../../components/Option';
import { useQuery } from 'react-query';
import axios from 'axios';
const apiUrl = process.env.API_BASE_URL;
const api = axios.create({
  baseURL: apiUrl,
});

interface QuestionType {
  type: string;
  text: string;
  options: string[];
}
interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  selected: boolean;
}


interface OptionsData {
  email: boolean;
  frequency: string;
  schedule: string;
  reminder: string;
  visibility: string;
}



export default  function CreateRoutine() {
  const handleSave = async () => {
    const routineData = {
      routineName,
      description,
      userId: 1,
      startTime: optionsData.schedule,
      reminder: optionsData.reminder,
      email: optionsData.email,
      frequency: optionsData.frequency,
      privacy: optionsData.visibility,
      active: enabled,
      type: "none"
    };
  
    const questionsData = questions;
    const selectedParticipantIds = selectedParticipants.map((p) => p.id);
  
    try {
      const response = await axios.post('http://localhost:3000/api/createRoutine', {
        routineData,
        questionsData,
        selectedParticipants: selectedParticipantIds
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to save routine');
      }
  
      const result = response.data;
      setTimeout(() => {
        setIsSuccess(true);
      }, 1500);
      
      console.log('Routine saved successfully:', result);
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error saving routine:', error);
      // Handle error (e.g., show an error message)
    }
  };
  
  
  useEffect(() => {
    const fetchData= async ()=> {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        if (response.status !== 200) {
          throw new Error('Failed to fetch data');
        }
        const membersWithSelected = response.data.map((member: any) => ({
          ...member,
          selected: false, // Initialize 'selected' attribute to false
        }));
        setInitialMembers(membersWithSelected);

        // Handle the fetched data as needed
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []); 
  const [activeTab, setActiveTab] = useState<'question' | 'participant' | 'option'>('question');
  const [routineName, setRoutineName] = useState('Set Routine Name');
  const [description, setDescription] = useState('Set Description');
  const [showModal, setShowModal] = useState(false);
  const [questionType, setQuestionType] = useState<string | null>(null);
  const [initialMembers, setInitialMembers] = useState<Member[]>([]);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [isSuccess,setIsSuccess]=useState(false);
  const [optionsData, setOptionsData] = useState<OptionsData>({
    email: false,
    frequency: '',
    schedule: '',
    reminder: '',
    visibility: ''
  });
  const [selectedParticipants, setSelectedParticipants] = useState<Member[]>([]);

    const handleParticipantsUpdate = (participants: Member[]) => {
        setSelectedParticipants(participants);
    };

  const handleAddQuestion = (type: string) => {
    setQuestionType(type);
    setShowModal(false);

    if (type === 'text' || type === 'number') {
      setQuestions([...questions, { type, text: '', options: [] }]);
    } else if (type === 'checkbox' || type === 'radio') {
      setQuestions([...questions, { type, text: '', options: [''] }]);
    }
  };

  const aff = () => {
    console.log(questions);
  }

  const handleSaveQuestion = (index: number, text: string, options: string[]) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], text, options };
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleOptionChange = (index: number, optionIndex: number, value: string) => {
    const newOptions = [...questions[index].options];
    newOptions[optionIndex] = value;
    handleSaveQuestion(index, questions[index].text, newOptions);
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    const newOptions = questions[questionIndex].options.filter((_, i) => i !== optionIndex);
    handleSaveQuestion(questionIndex, questions[questionIndex].text, newOptions);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    handleSaveQuestion(index, value, questions[index].options);
  };

  const handleUpdate = (data: OptionsData) => {
    setOptionsData(data);
  };
  

  return (
    <div className='cont h-full border-r-'>
      <div className='p-2 w-full flex justify-between pr-12'>
        <Link href={"/routine/"}>
          <MoveLeft className='h-9 w-9 mt-2 ml-3 cursor-pointer rounded-full p-1 hover:bg-neutral-200' />
        </Link>
        <button className='btn w-[105px] h-[50px] ' onClick={handleSave}>Save</button>
      </div>
      <div className='grid grid-cols-12 w-full border-t-2 border-neutral-200 h-full'>
        <div className='col-span-3 p-2 border-r-2 border-l-[1px] border-neutral-200 min-h-full'>
          <div className="w-full max-w-md">
            <div className="flex border-b border-gray-200 ">
              <button
                className={`flex-1 py-2 text-center font-bold text-black ${activeTab === 'question' ? 'border-b-2 border-pink-500 text-pink-500' : 'border-b-2 border-transparent text-black'}`}
                onClick={() => setActiveTab('question')}
              >
                Question
              </button>
              <button
                className={`flex-1 py-2 text-center font-bold  ${activeTab === 'participant' ? 'border-b-2 border-pink-500 text-pink-500' : 'border-b-2 border-transparent text-black'}`}
                onClick={() => setActiveTab('participant')}
              >
                Participant
              </button>
              <button
                className={`flex-1 py-2 text-center font-bold text-black ${activeTab === 'option' ? 'border-b-2 border-pink-500 text-pink-500' : 'border-b-2 border-transparent text-black'}`}
                onClick={() => setActiveTab('option')}
              >
                Option
              </button>
            </div>
            <div className="p-4">
              {activeTab === 'question' && (
                <div className="text-gray-700 " id='questionPlace'>
                  <div className='flex'>
                    <button 
                      id="addquestion"
                      onClick={() => setShowModal(true)}
                      className="flex items-center px-2 py-2 mt-4 text-pink-500 bg-pink-100 rounded hover:bg-pink-200"
                    >
                      <span>+</span>
                    </button>
                    <p className='mt-6 ml-2 font-bold'>Add question</p>
                  </div>
                </div>
              )}
              {activeTab === 'participant' && <div className="text-gray-700"><Participants initialMembers={initialMembers} onParticipantsUpdate={handleParticipantsUpdate} /></div>}
              {activeTab === 'option' && <div className="text-gray-700"><Option onUpdate={handleUpdate} /></div>}
            </div>
          </div>
        </div>
        <div className='col-span-9 h-full p-6' id='main content'>
          <div className="grid grid-cols-12 ml-2">
            <div className="col-span-10" id="col-span-10">
              <div className='p-2 flex justify-end'>
              <Switch2 enabled={enabled} setEnabled={setEnabled} />
              <h1 className='ml-2 font-bold'>{enabled ? 'Activer' : 'Desactiver'}</h1>
              </div>
              <div className='relative'>
                <Image src={"/images/Rectangle.png"} alt={"image"} width={500} height={500} className="w-full h-32 object-cover rounded-xl" />
                <div className="flex items-center justify-center absolute top-[72px] right-[30px]">
                  <label className="cursor-pointer bg-white bg-opacity-40 text-[#FF2D60] p-2 rounded-xl text-sm font-normal font-['Poppins']">
                    <input type="file" className="hidden" />
                    <span className='flex'>
                      <FilePenLine className='mr-1 h-4 w-4' />Change Cover
                    </span>
                  </label>
                </div>
              </div>
              <div className='bg-white rounded-xl border border-neutral-300 p-8 my-3'>
                <h1 className='mb-2 ml-1'>Name</h1>
                <input
                  type="text"
                  className='p-3 rounded-xl w-full border border-neutral-300 mb-2 font-bold'
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                />
                <h1 className='my-2'>Description</h1>
                <textarea
                  className='p-4 rounded-xl w-full border border-neutral-300'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              {questions.map((question, index) => (
                <div key={index} className="bg-white rounded-xl border border-neutral-300 p-8 my-3">
                  <div className='flex justify-between items-center mb-2'>
                    <input
                      type="text"
                      className='p-3 rounded-xl w-full border border-neutral-300 font-bold'
                      placeholder="Question text"
                      value={question.text}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                    <Trash className='h-6 w-6 text-red-500 ml-2 cursor-pointer' onClick={() => handleDeleteQuestion(index)} />
                  </div>
                  
                  {question.type !== 'text' && question.type !== 'number' && question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className='flex items-center mb-2'>
                      <input
                        type="text"
                        className='p-3 rounded-xl w-full border border-neutral-300'
                        placeholder="Option"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                      />
                      <Trash className='h-6 w-6 text-red-500 ml-2 cursor-pointer' onClick={() => handleDeleteOption(index, optionIndex)} />
                    </div>
                  ))}
                  {question.type !== 'text' && question.type !== 'number' && (
                    <button
                      className="flex items-center px-2 py-2 mt-4 text-pink-500 bg-pink-100 rounded hover:bg-pink-200"
                      onClick={() => handleSaveQuestion(index, question.text, [...question.options, ''])}
                    >
                      <span>+</span> Add option
                    </button>
                  )}
                </div>
              ))}
              <div className='mt-6'></div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-xl text-md font-semibold font-['Poppins']">
            <h2 className="mb-2">Select a question type</h2>
            <hr className='bg-black' />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button onClick={() => handleAddQuestion('text')} className="p-3 bg-[#DEE5FF4D] rounded-xl text-[#5577FF]"><SquarePen className='inline-block h-4 w-4' /> Text </button>
              <button onClick={() => handleAddQuestion('rating')} className="p-3 bg-[#ea8d1354] text-[#EA8D13] rounded-xl">Rating <Star className='inline-block h-4 w-4' /></button>
              <button onClick={() => handleAddQuestion('checkbox')} className="p-3 bg-[#E8F9FF] text-[#49CCF9] rounded-xl"><CircleCheckBig className='inline-block h-4 w-4' /> Checkbox</button>
              <button onClick={() => handleAddQuestion('number')} className="p-3 bg-[#F2F2F2] text-[#282E2C] rounded-xl"> 123 Number</button>
              <button onClick={() => handleAddQuestion('radio')} className="p-3 bg-[#6772FE21] text-[#6772FE] rounded-xl"><CircleDot className='inline-block h-4 w-4' /> Radio</button>
              <button onClick={() => handleAddQuestion('emoji')} className="p-3 bg-[#FF2D6017] text-[#FF2D60] rounded-xl"> <Smile className='inline-block h-4 w-4' /> Emoji</button>
            </div>
          </div>
          
        </div>
      )}
      {isSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-xl text-md font-semibold font-['Poppins'] text-[#FF2D60]">
         <h1>Routine saved successfully</h1>
          </div>
        </div>
      )}
    </div>
  );
}
