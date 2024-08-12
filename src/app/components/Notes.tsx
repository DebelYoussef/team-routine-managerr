"use client";
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Note from "./Note"
import { NotebookPen,Plus,X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu";

interface Note{
  id:number;
  title:string;
  text:string;
  tags:string;
  date:string;
}
const notesData: Note[] = [
  { id: 1, title: 'Meeting Notes', text: 'Discussed project milestones', tags: 'meeting, project' ,date:'22/07/2024' },
  { id: 2, title: 'Todo List', text: '1. Finish the report\n2. Email the client', tags: 'tasks, urgent',date:'22/07/2024' },
  { id: 3, title: 'Idea Brainstorm', text: 'Consider new marketing strategies', tags: 'ideas, marketing ,AI ,Machine-Learning ,IT ,MO',date:'22/07/2024' },
];
const Notes: React.FC = () => {
  const [showCreateNote,setShowCreateNote]=useState(false);
  const [notes,setNotes]=useState<Note[]>([]);
  const [title,setTitle]=useState("");
  const [text,setText]=useState("");
  
  const handleFade=()=>{
    setShowCreateNote(!showCreateNote);
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/getNotes?id=1');
            if (response.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            const table = response.data.map((note:Note[]) => ({
              ...note,
              tags: ''
            }));
            
            
            setNotes(table);

            // Handle the fetched data as needed
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchData();
}, []);
const handleCreateNote= async ()=>{
  try {
    const response = await axios.post('http://localhost:3000/api/createNote', {
      title,
      text,
      employeId:1
      
    });

    if (response.status !== 200) {
      throw new Error('Failed to save Note');
    }

    const result = response.data;
  
    
    console.log('Note saved successfully:', result);
    // Handle success (e.g., show a success message or redirect)
  } catch (error) {
    console.error('Error saving routine:', error);
    // Handle error (e.g., show an error message)
  }
}


  return (
    
<main>
  {
    showCreateNote && (
      <div className='bg-white relative  w-[474px] h-[403px] rounded-2xl shadow-2xl cursor-pointer'>
        <div className='w-full h-12 bg-[#FFD8E1] rounded-t-2xl flex  text-black font-bold text-[14px] p-3 '>
          <h1>11, july 2024</h1> <X onClick={handleFade} className='h-5 w-5 text-black ml-60 cursor-pointer'/>
        </div>
        <div id="main content">
              <input type="text" className='outline-none p-2 w-full border-b border-b-neutral-200 font-bold' placeholder='Note Title' onChange={(e) => setTitle(e.target.value)} />
               <textarea onChange={(e) => setText(e.target.value)} cols={30} rows={10} className='outline-none w-full p-2' placeholder='Note...'></textarea>
          </div>
        <div className='cursor-pointer bg-[#CCD7FF] text-[#808BFE] w-[61px] h-[36px] flex justify-center items-center rounded absolute bottom-[10px] left-[10px] mr-2'>Tags</div>
        <div className='cursor-pointer bg-[#CCD7FF] text-[#808BFE] w-[20px] h-[20px] flex justify-center items-center rounded absolute bottom-[18px] left-[80px] mr-2'><Plus className='h-4 w-4'/></div>
        <div className='relative left-[240px] w-[100px] h-10 pt-2 '><button className=' w-[100px] text-sm p-2 hover:bg-red-600 active:scale-95  bg-customred rounded-xl text-white' onClick={handleCreateNote}>Create note</button></div>
      </div>
    )
  }
<div className="flex overflow-y-auto max-h-[100vh] w-[330px h-full flex-col px-6 pt-3.5 pb-20 mx-auto  text-xs font-semibold bg-white border-b-0 border border-solid border-slate-200 max-w-[480px]">
    <div className=" mb-3 flex gap-5 justify-between items-start pb-2.5 w-full text-base font-medium whitespace-nowrap border-b border-solid border-slate-200 text-zinc-600">
      <div className="flex gap-1.5 justify-center">
      <NotebookPen className='w-5 h-5 mt-1' />
       <div className="flex justify-between w-full">
       <div className="underline">Notes</div> <div className=" ml-56 mt-2 w-4 h-4 bg-[#BBC9FF] flex justify-center items-center rounded cursor-pointer"><Plus onClick={handleFade}  className='h-3 w-3 click:scale-95 text-[#6180FF]'/></div>
       </div>
      </div>
     
    </div>
    {notesData.map(note => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          text={note.text}
          tags={note.tags}
          date={note.date}
        />
      ))}
      {notes.map(note => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          text={note.text}
          tags={note.tags}
          date={note.date}
        />
      ))}
   
    
    
  </div>
</main>
  )
}

export default Notes;
