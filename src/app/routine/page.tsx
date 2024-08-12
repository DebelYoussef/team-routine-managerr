"use client";
import React from 'react'
import Image from 'next/image';
import { BellIcon, MoveRight,Plus } from 'lucide-react';
import axios from 'axios';

interface Template {
  title: string;
  description: string;
  image: string;
}
interface Routine{
  id:number;
  routineName:string;
  description:string;
}
import Link from 'next/link';
import { useEffect,useState } from 'react';

const templates: Template[] = [
  {
    title: 'Daily Stand up',
    description: 'Keep your team in the loop by sharing what you are working on every day',
    image: 'coffee',
  },
  {
    title: 'Morning plan',
    description: 'Keep your team in the loop by sharing what you are working on every day',
    image: 'sun',
  },
  {
    title: 'Daily Recap',
    description: 'Keep your team in the loop by sharing what you are working on every day',
    image: 'calendar',
  },
];


export default function Routine() {
  useEffect(() => {
    const fetchData= async ()=> {
      try {
        const response = await axios.get('http://localhost:3000/api/detailRoutine');
        if (response.status !== 200) {
          throw new Error('Failed to fetch data');
        }
        setRoutines(response.data);
  
        // Handle the fetched data as needed
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  
  },[])
  const[routines,setRoutines]=useState<Routine[]>([]);
  
  
  return (
    <main className='p-6'>
        <div className=" flex justify-between ">
          <h1 className="text-black text-2xl font-bold font-['Poppins']">Template Routine</h1>
          <button  className=" btn mr-5  h-[50px] font-medium flex   bg-customred p-3 text-white rounded-xl  text-lg  font-['Poppins'] " ><Plus className='mt-1 mr-1'/><Link href={"routine/createRoutine"}>Create Routine</Link></button>
          </div>
          <div className="grid grid-cols-12 gap-4 p-4">
          
      {templates.map((template, index) => (
        
        <div key={index} className=" bg-white shadow-md col-span-4 rounded-2xl transition-transform duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer ">
          <Image src={"/images/Rectangle.png"} alt={template.title} width={500} height={500}  className="w-full h-32 object-cover rounded-t-xl" />
         <div className="p-4">
         <div className="mt-2 text-sm font-medium flex"><Image src={`/images/${template.image}.png`} alt={template.title} width={25} height={25}  className="mb-3 mr-2" />{template.title}</div>
          <div className="text-xs text-gray-700">{template.description}</div>
          <div className="flex justify-between px-2 mt-1">
          <button className="mt-2  text-[#FF5881] font-poppins flex ">View Responses <MoveRight className='ml-1 w-5' /></button>
          <Link className="mt-2  text-[#FF5881] font-poppins flex  " href={"routine/"}>View details </Link> 
          </div>
         </div>
        </div>
        
      ))}
       {routines.map((routine) => (
        
        <div key={routine.id} className=" bg-white shadow-md col-span-4 rounded-2xl transition-transform duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer ">
          <Image src={"/images/Rectangle.png"} alt={routine.routineName} width={500} height={500}  className="w-full h-32 object-cover rounded-t-xl" />
         <div className="p-4">
         <div className="mt-2 text-sm font-medium mb-1 flex">{routine.routineName}</div>
          <div className="text-xs text-gray-700">{routine.description}</div>
          <div className="flex justify-between px-2 mt-1">
          <button className="mt-2  text-[#FF5881] font-poppins flex "><Link className="  text-[#FF5881] font-poppins flex  " href={`routine/routine-responses/${routine.id}`}>View Responses </Link> <MoveRight className='ml-1 w-5' /></button>
          <Link className="mt-2  text-[#FF5881] font-poppins flex  " href={`routine/${routine.id}`}>View details </Link> 
          </div>
         </div>
        </div>
        
      ))}
    </div>

          
    </main>
  )
}
