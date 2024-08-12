"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MoveLeft } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { CalendarForm } from './../../../components/CalendarForm';

interface Options {
  id: number;
  value: string;
  questionId: number;
  checked: boolean;
}

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Questions {
  id: number;
  type: string;
  question: string;
  options: Options[];
  visible: boolean;
}

interface Response {
  id: number;
  employeeId:number;
  questionId: number;
  routineId: number;
  value: string;
  date:string;
}

interface routineResponsesProps {
  params: Params;
}

interface Params {
  routineId: string;
}

const RoutineResponses: React.FC<routineResponsesProps> = ({ params }) => {
  const { routineId } = params;
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [routineName, setRoutineName] = useState("");
  const [responses, setResponses] = useState<Response[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [lastMemberId, setLastMemberId] = useState<number>(1);
  const [date, setDate] = useState<string>(getTodayDateString());
  const [showAnswers,setShowAnswers]=useState(false);
  const [emptyAnswers,setEmptyAnswers]=useState(false);

  function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(today.getDate()).padStart(2, '0'); // Pad single digits with leading zero
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/detailRoutine?routineId=${routineId}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch data');
        }
        const data = response.data;
        setRoutineName(data.routineName || 'Routine Name');
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
        setResponses(Array.isArray(data.responses) ? data.responses : []); // Ensure this is an array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchRoutineMember = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/getMemberInfo?RoutineId=${routineId}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch data');
        }
        const data = response.data;
        setMembers(Array.isArray(data) ? data : []);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRoutineData();
    fetchRoutineMember();
  }, [routineId]);

  const getMemberResponses = async (memberId: number) => {

    setShowAnswers(true);

    setLastMemberId(memberId);
    try {
      const response = await axios.post('http://localhost:3000/api/getResponses', {
        RoutineId: routineId,
        employeeId: memberId,
        date,
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch responses');
      }
      const result = response.data.filteredResponses;
      setResponses(Array.isArray(result) ? result : []); // Ensure this is an array
      if(responses.length==0)
      {
        setEmptyAnswers(true);
      }
      else{
        setEmptyAnswers(false);
      }
      console.log('Responses:', result);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleDateChange = (date: string) => {
    setDate(date);
   
    getMemberResponses(lastMemberId);
    
    console.log("Selected date:", date);
  };

  return (
    <div className='cont h-full w-full font-poppins'>
      <div className='p-2 w-full flex justify-between pr-10 relative border-b border-b-neutral-200'>
        <Link href={"/routine/"}>
          <MoveLeft className='h-9 w-9 mt-2 ml-3 cursor-pointer rounded-full p-1 hover:bg-neutral-200' />
        </Link>
        <h1 className="text-black text-2xl font-['Poppins'] mt-2 absolute left-[70px] font-bold">{routineName}</h1>
      
      </div>
      <div className='grid grid-cols-12 w-full h-full'>
        <div className='col-span-3 h-full p-5'>
          <div className='flex ml-3 mb-3'>
            <Image src={"/images/users.webp"} alt={"image"} width={500} height={500} className="mt-1 mr-1 w-5 h-5" />
            <h1 className='font-bold text-lg underline'>Participants</h1>
          </div>
          <hr />
          <h1 className="text-[#8e9abb] text-md font-normal font-['Poppins'] leading-snug mt-8 ml-3">Participant</h1>
          <div className='participants mt-4 w-full'>
            {members.map((member) => (
              <div key={member.id} onClick={() => getMemberResponses(member.id)} className='participant hover:bg-gray-100 hover:border-l-4 hover:border-l-[#FF2D60] cursor-pointer p-2 rounded'>
                <div className="flex w-full">
                  <Image src={"/images/lightgray.webp"} alt={"image"} width={500} height={500} className="w-10 h-10 rounded-full" />
                  <div className="ml-2 w-full">
                    <div className="flex justify-between w-full">
                      <h1 className="text-[#212633] text-base font-medium font-['Poppins'] leading-normal">{`${member.firstName} ${member.lastName}`}</h1>
                      <h2 className="text-[#8e9abb] text-sm font-normal font-['Poppins'] leading-snug">9:13 AM</h2>
                    </div>
                    <h2 className="text-[#8e9abb] text-sm font-normal font-['Poppins'] leading-snug">{member.role}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='col-span-9 h-full border border-neutral-200 p-5'>
          <div className='flex h-10 relative w-full'>
            <button className='rounded-xl px-4 border border-neutral-200'>Filtre</button>
            <CalendarForm onDateChange={handleDateChange} />
            <button className='rounded w-[100px] p-2 border border-[#BFBDC6] text-[#BFBDC6] absolute left-[800px] bottom-[10px] flex'>
              <Image src={"/images/users.webp"} alt={"image"} width={500} height={500} className="w-5 h-5 rounded-full mt-[1px] mr-2 " />
              <h1>Share</h1>
            </button>
          </div>
          {showAnswers && !emptyAnswers &&<div className="responses&questions border border-neutral-200 rounded-xl mt-8 p-4 w-3/4">
            {questions.map((question) => (
              <div key={question.id} className="question-section mb-4">
                <h1 className="question font-bold text-lg">{question.question}</h1>
                {/* Render responses related to the current question */}
                {question.type!=="checkbox"  && responses
                  .filter(response => response.questionId === question.id)
                  .map(response => (
                    <div key={response.id} className="response border border-neutral-200 rounded-xl mt-2 p-4 w-3/4">
                      {response.value}
                    </div>
                  ))}
                  
                   {question.type==="checkbox"  &&  responses
                  .filter(response => response.questionId === question.id)
                  .map(response => (
                    <div key={response.id} className='flex mt-2 ml-2'  >
                      <div className='bg-[#FF2D60] w-2 h-2 mt-2 rounded-full mr-2'></div>  
                      <div>{response.value}</div>  

                    </div>
                    
                  ))}
                   
                  
                  
                 
                    
              </div>
            ))}
          </div>

          }
          {emptyAnswers && 
          <div className='text-xl mt-20 font-bold ml-8'>noo answers</div>

          }
        </div>
      </div>
    </div>
  );
}

export default RoutineResponses;
