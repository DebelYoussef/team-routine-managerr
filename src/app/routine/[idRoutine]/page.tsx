"use client";
import React, { useEffect,useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoveLeft, FilePenLine, Star, SquarePen, CircleCheckBig, Smile, CircleDot, Trash } from 'lucide-react';
import Image from 'next/image';
import Switch2 from '../../components/Switch2';
import { Button } from "@/components/ui/button";
import Participants from './../../components/Participants';
import Option2 from './../../components/Option2';
import Question from './../../components/question';
import { question } from '@/schema';
import { useQuery } from 'react-query';
import axios from 'axios';
import Participants2 from '@/app/components/Participants2';



interface QuestionType {
  type: string;
  text: string;
  options: string[];
} 
interface OldOption{
    id:number;
    value: string;
    new:boolean;
    questionId:number;
    changed:boolean;
}
interface OldQuestion{
    id:number;
    type: string;
    changed:boolean;
    question:string;
    options: OldOption[];
    visible:boolean;

}
interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  selected: boolean;
}
interface oldMember{
    id:number;
    employeeId:number;
    routineId:number;
}

interface OptionsData {
  email: boolean;
  frequency: string;
  schedule: string;
  reminder: string;
  visibility: string;
}
interface Params {
    idRoutine: string;
  }
interface RoutineDetailProps {
    params: Params;
}
  
  


const RoutineDetail: React.FC<RoutineDetailProps> = ({ params }) => {
  const { idRoutine } = params;
 
  
  
 
  
  const [activeTab, setActiveTab] = useState<'question' | 'participant' | 'option'>('question');
  const [routineName, setRoutineName] = useState('Set Routine Name');
  const [description, setDescription] = useState('Set Description');
  const [showModal, setShowModal] = useState(false);
  const [questionType, setQuestionType] = useState<string | null>(null);
  const [initialMembers, setInitialMembers] = useState<Member[]>([]);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [isSuccess,setIsSuccess]=useState(false);
  const [oldQuestion,setOldQuestion]=useState<OldQuestion[]>([]);
  const [optionNeedUpdate,setOptionNeedUpdate]=useState<OldOption[]>([]);
  const [questionNeedUpdate,setQuestionNeedUpdate]=useState<OldQuestion[]>([]);
  const [newOption,setNewOption]=useState<OldOption[]>([]);
  const [deleteOption,setDeleteOption]=useState<OldOption[]>([]);
  const [deleteQuestion,setDeleteQuestion]=useState<OldQuestion[]>([]);
  const [participantOut, setParticipantOut] = useState<Number[]>([]);
  const [participantIn, setParticipantIn] = useState<Number[]>([]);
  


  const [oldMembers,setOldMembers]=useState<oldMember[]>([]);

  const [optionsData, setOptionsData] = useState<OptionsData>({
    email: false,
    frequency: '',
    schedule: '',
    reminder: '',
    visibility: ''
  });
  const Publish = async (participantOut2:number[], participantIn2:number[]) => {
    try {
      const response = await axios.post('http://localhost:3000/api/updateRoutine', {
        routineName,
        routineId: idRoutine,
        description,
        questions,
        questionNeedUpdate,
        optionNeedUpdate,
        newOptions: newOption,
        deleteOption,
        deleteQuestion,
        participantOut: participantOut2,
        participantIn: participantIn2,
        email: optionsData.email,
        activer: enabled,
        visibilty: optionsData.visibility,
        frequency: optionsData.frequency
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to update routine');
      }
  
      const result = response.data;
      console.log('Routine updated successfully:', result);
    } catch (error) {
      console.error('Error updating routine:', error);
    }
  };
  const Update = async () => {
    const updatedQuestions = oldQuestion.filter(question => question.changed);
    const updatedOptions = oldQuestion.flatMap(question =>
      question.options.filter(option => option.changed && !option.new)
    );
    const newOptions = oldQuestion.flatMap(question =>
      question.options.filter(option => option.new)
    );
  
    const { participantOut2, participantIn2 } = await handleUpdateParticipants();
  
    setQuestionNeedUpdate(updatedQuestions);
    setOptionNeedUpdate(updatedOptions);
    setNewOption(newOptions);
  
    console.log(updatedQuestions);
    console.log(updatedOptions);
    console.log(newOptions);
    console.log("deleteOption:", deleteOption);
    console.log("deleteQuestion:", deleteQuestion);
    console.log("old members:", oldMembers);
    console.log("selpart", selectedParticipants);
  
    Publish(participantOut2, participantIn2);
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
      const fetchRoutineData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/detailRoutine?routineId=${idRoutine}`);
      
          if (response.status !== 200) {
            throw new Error('Failed to fetch data');
          }
      
          const data = response.data;
      
          // Update state with fetched data
          setRoutineName(data.routineName || 'Set Routine Name');
          setDescription(data.description || 'Set Description');
          setEnabled(data.active || false);
          setOldQuestion(data.questions || []);
          setOldMembers(data.memberships || []);
          const routineOptions={
            email: data.email,
            frequency: data.frequency,
            schedule: '',
            reminder: '',
            visibility: data.privacy
          }
          setOptionsData(routineOptions);
         
      
          // Handle the fetched data as needed
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    fetchData();

    fetchRoutineData();
    
    
    
  }, [idRoutine]); 

  

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
// old question methods 

const handleSaveOldQuestion = (id: number, question: string, options: OldOption[]) => {
    const newOldQuestions = oldQuestion.map(q => 
      q.id === id ? { ...q, question, changed: true, options } : q
    );
    setOldQuestion(newOldQuestions);
  };
  
  // Function to handle deleting an old question
  const handleDeleteOldQuestion = (id: number) => {
    const questionToDelete = oldQuestion.find(q => q.id === id);
    if (questionToDelete) {
      setDeleteQuestion(prevState => [...prevState, questionToDelete]);
    }
    const newOldQuestions = oldQuestion.filter(q => q.id !== id);
    setOldQuestion(newOldQuestions);
  };
  
  
  // Function to handle changing an old option value
  const handleOptionChangeOld = (questionId: number, optionId: number, value: string) => {
    const newOptions = oldQuestion.find(q => q.id === questionId)?.options.map(option =>
      option.id === optionId ? { ...option, value, changed: true } : option
    ) || [];
    handleSaveOldQuestion(questionId, oldQuestion.find(q => q.id === questionId)?.question || '', newOptions);
  };
  
  // Function to handle adding a new option to an old question
  const handleAddNewOptionOld = (questionId: number, value: string) => {
    const newOption: OldOption = {
      id: generateUniqueId(),
      value,
      new: true,
      questionId,
      changed: true
    };
  
    const newOptions = [...(oldQuestion.find(q => q.id === questionId)?.options || []), newOption];
    handleSaveOldQuestion(questionId, oldQuestion.find(q => q.id === questionId)?.question || '', newOptions);
  };
  
  // Function to handle deleting an old option
  const handleDeleteOptionOld = (questionId: number, optionId: number) => {
    const question = oldQuestion.find(q => q.id === questionId);
  
    if (question) {
      const optionToDelete = question.options.find(option => option.id === optionId);
  
      if (optionToDelete && !optionToDelete.new) {
        setDeleteOption(prevState => [...prevState, optionToDelete]);
      }
  
      const newOptions = question.options.filter(option => option.id !== optionId);
      handleSaveOldQuestion(questionId, question.question, newOptions);
    }
  };
  
  
  // Function to handle input change for old questions
  const handleInputChangeOld = (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const { value } = e.target;
    handleSaveOldQuestion(id, value, oldQuestion.find(q => q.id === id)?.options || []);
  };
  
  function generateUniqueId() {
    // Implement your unique ID generation logic here
    return Math.floor(Math.random() * 1000000);
  }
  
  const handleQuestionClick = (questionId: number) => {
    const updatedQuestions = oldQuestion.map(question =>
      question.id === questionId ? { ...question, visible: true } : question
    );
    setOldQuestion(updatedQuestions);
  };

  const handleUpdateParticipants = async () => {
    const { participantOut2, participantIn2 } = await getParticipantChanges(selectedParticipants, oldMembers);
    
    console.log("partout", participantOut2);
    console.log("partIn:", participantIn2);
    
    setParticipantOut(participantOut2);
    setParticipantIn(participantIn2);
    
    return { participantOut2, participantIn2 };
  };
 async function getParticipantChanges(selectedParticipants: Member[], oldMembers: oldMember[]) {
    const participantOut2 = oldMembers
      .filter(oldMember => !selectedParticipants.some(participant => participant.id === oldMember.employeeId))
      .map(oldMember => oldMember.employeeId);
  
    const participantIn2 = selectedParticipants
      .filter(participant => !oldMembers.some(oldMember => oldMember.employeeId === participant.id))
      .map(participant => participant.id);
  
    return { participantOut2, participantIn2 };
  }
  
  
  return (
    <div className='cont h-full'>
      <div className='p-2 w-full flex justify-between pr-10 relative '>
        <Link href={"/routine/"}>
          <MoveLeft className='h-9 w-9 mt-2 ml-3 cursor-pointer rounded-full p-1 hover:bg-neutral-200' />
        </Link>
        <h1 className="text-black text-2xl font-medium font-['Poppins'] mt-2 absolute left-[70px]">{routineName}</h1>
        <button className='btn w-[105px] h-[50px]' onClick={Update} >Publish</button>
      </div>
      <div className='grid grid-cols-12 w-full border-t-2 border-neutral-200 h-full'>
        <div className='col-span-3 p-2 border-r-2 border-l-[1px] border-neutral-200 min-h-full overflow-y-auto max-h-[100vh]'>
          <div className="w-full max-w-md">
            <div className="flex border-b border-gray-200 ">
              <button
                className={`flex-1 py-2 text-center ${activeTab === 'question' ? 'border-b-2 border-pink-500 text-pink-500' : 'border-b-2 border-transparent text-gray-500'}`}
                onClick={() => setActiveTab('question')}
              >
                Question
              </button>
              <button
                className={`flex-1 py-2 text-center ${activeTab === 'participant' ? 'border-b-2 border-pink-500 text-pink-500' : 'border-b-2 border-transparent text-gray-500'}`}
                onClick={() => setActiveTab('participant')}
              >
                Participant
              </button>
              <button
                className={`flex-1 py-2 text-center ${activeTab === 'option' ? 'border-b-2 border-pink-500 text-pink-500' : 'border-b-2 border-transparent text-gray-500'}`}
                onClick={() => setActiveTab('option')}
              >
                Option
              </button>
            </div>
            <div className="p-4">
              {activeTab === 'question' && (
                <div className="text-gray-700 " id='questionPlace'>
                    <div>
                      {oldQuestion.map((question)=>(
                       <div  key={question.id} onClick={() => handleQuestionClick(question.id)}>
                         <Question
                       
                        questionText={question.question}
                        questionType={question.type}
                        
                      />
                       </div>

                      )
                    
                    )}  
                    
                    </div>
                  <div className='flex'>

                    <button 
                      id="addquestion"
                      onClick={() => setShowModal(true)}
                      className="flex items-center px-2 py-2 mt-4 text-pink-500 bg-pink-100 rounded hover:bg-pink-200"
                    >
                      <span>+</span>
                    </button>
                    <p className='mt-6 ml-2'>Add question</p>
                  </div>
                  
                </div>
              )}
              {activeTab === 'participant' && <div className="text-gray-700"><Participants2
  initialMembers={initialMembers}
  oldMembers={oldMembers}
  onParticipantsUpdate={handleParticipantsUpdate}
/>
</div>}
              {activeTab === 'option' && <div className="text-gray-700"><Option2 schedule2={optionsData.schedule}
  visibility2={optionsData.visibility} 
  
  reminder2={optionsData.reminder}
  frequency2={optionsData.frequency}
  emailParam={optionsData.email}
  onUpdate={handleUpdate}
/>
</div>}
            </div>
          </div>
        </div>
        <div className='col-span-9 h-full p-6 overflow-y-auto max-h-[100vh] ' id='main content'>
          <div className="grid grid-cols-12 ml-2">
            <div className="col-span-10" id="col-span-10">
              <div className='p-2 flex justify-end'>
              <Switch2 enabled={enabled} setEnabled={setEnabled} />
              <h1 className='ml-2'>{enabled ? 'Activer' : 'Desactiver'}</h1>
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

              {oldQuestion.filter(question => question.visible).map((question) => (
      <div key={question.id} className="bg-white rounded-xl border border-neutral-300 p-8 my-3">
        <div className='flex justify-between items-center mb-2'>
          <input
            type="text"
            className='p-3 rounded-xl w-full border border-neutral-300 font-bold'
            placeholder="Question text"
            value={question.question}
            onChange={(e) => handleInputChangeOld(e, question.id)}
          />
          <Trash className='h-6 w-6 text-red-500 ml-2 cursor-pointer' onClick={() => handleDeleteOldQuestion(question.id)} />
        </div>

        {question.type !== 'text' && question.type !== 'number' && question.options.map((option) => (
          <div key={option.id} className='flex items-center mb-2'>
            <input
              type="text"
              className='p-3 rounded-xl w-full border border-neutral-300'
              placeholder="Option"
              value={option.value}
              onChange={(e) => handleOptionChangeOld(question.id, option.id, e.target.value)}
            />
            <Trash className='h-6 w-6 text-red-500 ml-2 cursor-pointer' onClick={() => handleDeleteOptionOld(question.id, option.id)} />
          </div>
        ))}
        {question.type !== 'text' && question.type !== 'number' && (
          <button
            className="flex items-center px-2 py-2 mt-4 text-pink-500 bg-pink-100 rounded hover:bg-pink-200"
            onClick={() => handleAddNewOptionOld(question.id, '')}
          >
            <span>+</span> Add option
          </button>
        )}
      </div>
    ))}
              
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
      <button onClick={() => {
  handleUpdateParticipants();
  console.log("participant out:", participantOut);
  console.log("participant in:", participantIn);
}}>click</button>

    </div>
  );
}
export default RoutineDetail;
