import React, { useState } from 'react';
import { Notebook, Plus, StickyNote } from 'lucide-react';
import TroisPoins from './TroisPoins';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
interface NoteProps {
  id: number;
  title: string;
  text: string;
  tags: string;
  date: string;
  
}

const Note: React.FC<NoteProps> = ({ id, title, text, tags, date }) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const tagArray = tags.split(',').map(tag => tag.trim());

  const tagColors = [
    'text-pink-400 bg-pink-400 bg-opacity-30',
    'text-emerald-500 bg-emerald-500 bg-opacity-30',
    'text-indigo-400 bg-indigo-400 bg-opacity-30', // #828DFE
    'text-sky-400 bg-sky-400 bg-opacity-30',       // #70D6FA
  ];
  const handleDelete=async (id:number)=>{
    try {
      const response = await axios.delete(`http://localhost:3000/api/createNote?idNote=${id}`);
      if (response.status !== 200) {
        throw new Error('Failed delete note');
      }
       console.log("Note deleted successfully");

      // Handle the fetched data as needed
    } catch (error) {
      console.error('Error deleting note:', error);
    }

  }

  const displayedTags = showAllTags ? tagArray : tagArray.slice(0, 4);

  return (
    <div className="shadow-xl flex flex-col mb-4 px-4 py-3.5 text-xs font-semibold bg-white rounded-xl border border-solid border-slate-200 max-w-[306px]">
      <div className="flex gap-5 justify-between w-full text-neutral-400">
        <div className="flex gap-1.5">
          <StickyNote className='h-4 w-4 text-black' />
          <div>{date.slice(0,10)}</div>
        </div>

        <DropdownMenu>
      <DropdownMenuTrigger asChild>
      
      <Button variant="outline" className='outline-none pb-8 border-none m-0'><TroisPoins /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
      <DropdownMenuItem className='hover:bg-gray-500 cursor-pointer' onClick={()=>handleDelete(id)}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:bg-gray-500 cursor-pointer'>
            Edit
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        <div className="cursor-pointer "></div>
      </div>
      <div className="mt-2.5 text-sm text-neutral-600">{title}</div>
      <div className="mt-1.5 font-medium text-neutral-400">{text}</div>
      <div className="flex gap-2 mt-2.5 flex-wrap" id="tags">
        {displayedTags.map((tag, index) => (
          <div
            key={index}
            className={`justify-center px-2.5 py-1 rounded-[33px] ${
              index < tagColors.length ? tagColors[index] : 'text-neutral-500 bg-neutral-500 bg-opacity-30'
            }`}
          >
            {tag}
          </div>
        ))}
        {!showAllTags && tagArray.length > 4 && (
          <div
            className="justify-center px-2.5 py-1 text-neutral-500 bg-neutral-500 bg-opacity-30 rounded-[33px] cursor-pointer"
            onClick={() => setShowAllTags(true)}
          >
            +{tagArray.length - 4} more
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;
