"use client";

import React, { useState } from 'react';
import Image from 'next/image';

import { Search, NotepadText, Clock, BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Reminder from './Reminder';
interface Notification {
  id: number;
  title: string;
  description: string;
  read: boolean;
}

const notificationsData: Notification[] = [
  {
    id: 1,
    title: "Meeting Reminder",
    description: "Your meeting with the team starts in 30 minutes.",
    read: false
  },
  {
    id: 2,
    title: "Project Deadline",
    description: "The deadline for the project is tomorrow. Please ensure all tasks are completed.",
    read: false
  },
  {
    id: 3,
    title: "New Task Assigned",
    description: "You have been assigned a new task. Check your task list for details.",
    read: false
  },
  {
    id: 4,
    title: "System Update",
    description: "A system update will be performed tonight at midnight. Expect downtime.",
    read: true
  },
  {
    id: 5,
    title: "Overdue Task",
    description: "You have an overdue task. Please address it as soon as possible.",
    read: true
  },
  {
    id: 6,
    title: "Meeting Rescheduled",
    description: "The meeting scheduled for tomorrow has been rescheduled to next week.",
    read: true
  },
  {
    id: 7,
    title: "Project Milestone",
    description: "Congratulations! You have reached a major milestone in your project.",
    read: true
  }
];


const TopBar: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
    const [notesVisible, setNotesVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [reminder, setReminder] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const toggleNotes = () => {
        const notesElement = document.getElementById('notes');
        const children = document.getElementById('children');
        if (notesElement) {
            if (notesVisible) {
                notesElement.classList.add('hidden');
                if (children) {
                    children.classList.add('col-span-12');
                    children.classList.remove('col-span-9');
                }
            } else {
                notesElement.classList.remove('hidden');
                if (children) {
                    children.classList.remove('col-span-12');
                    children.classList.add('col-span-9');
                }
            }
        }
        handleClick();
        setNotesVisible(!notesVisible);
    };

    const toggleReminder = () => {
        setReminder(!reminder);
    };

    const handleNotificationClick = (id: number) => {
      setNotifications((prevNotifications:Notification[]) =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    };
    
   

    return (
        <div className="relative top-0 right-0 w-full p-1 border border-solid border-neutral-200 flex justify-start">
            <input
                type="text"
                placeholder="search"
                className="mb-1 font-bold ml-4 p-3 bg-white border border-solid border-neutral-200 max-w-[295px] min-h-[47px] rounded-[100px]"
            />
            <Search className="relative top-[15px] right-[33px] text-gray-400 w-5 h-5 cursor-pointer hover:text-neutral-300" />
            <div className="ml-auto mr-10 flex">
                <Button
                    onClick={toggleReminder}
                    variant="outline"
                    className={`p-2 mr-2 bg-[#F9F9F9] w-auto h-[36px] rounded-xl mt-2 hover:bg-[#ffbfd0] ${
                      reminder ? 'bg-[#FFDCE4] text-[#FF2D60]' : 'bg-[#F9F9F9]'
                  } `}
                >
                    <Clock className="w-4 font-bold h-4 mr-1" />
                    <h1 className=" font-bold">Reminder</h1>
                </Button>
                <Button
                    onClick={toggleNotes}
                    variant="outline"
                    className={`p-2 w-[93px] h-[36px] ${
                        isClicked ? 'bg-[#FFDCE4] text-[#FF2D60]' : 'bg-[#F9F9F9]'
                    } rounded-xl mt-2 flex items-center active:bg-[#ff9eb1] transition-all duration-200 ease-in-out`}
                >
                    <NotepadText className="w-4 font-bold h-4 mr-1" />
                    <h1 className="font-bold">Note</h1>
                </Button>
            
            <DropdownMenu>
      <DropdownMenuTrigger className="ml-3 text-neutral-500 hover:text-neutral-400" >
        <div className="border-neutral-600 rounded-full p-2 relative " >
          <BellIcon  />
          <div
            className={`absolute w-2 ${notifications.some(n => !n.read) ? 'h-2' : 'h-0'} bg-[#FF2D60] rounded-full bottom-[24px] left-[24px]`}
          ></div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white w-[500px] max-h-[400px] overflow-y-auto p-2 rounded-xl">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="cursor-pointer transition ease-in-out border-b border-b-neutral-200 hover:bg-gray-100 p-2 w-full flex justify-between rounded-r-none rounded-l-xl hover:border-r-4 hover:border-r-[#FF2D60]"
            onClick={() => handleNotificationClick(notification.id)}
          >
            <div className='w-3/4'>
              <div className='font-bold'>{notification.title}</div>
              <div>{notification.description}</div>
            </div>
            <div
              className={`rounded-full w-4 h-4 mt-6 ${
                notification.read ? 'bg-neutral-300' : 'bg-[#FF2D60]'
              }`}
              id="circle"
            ></div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
      
                <Image
                    src={"/images/Ellipse.png"}
                    alt={"avatar"}
                    width={40}
                    height={30}
                    className="ml-3 h-[40px] w-[40px] mt-2 rounded-full"
                />
                <div className="ml-2 mt-3">
                    <h1 className="text-zinc-800 text-sm font-bold font-['Poppins']">AvantarWAr</h1>
                    <h2 className="text-zinc-800 text-xs font-bold font-['Poppins']">ux designer</h2>
                </div>
            </div>

            {reminder && (
                <div style={{ zIndex: 99 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Reminder setReminder={setReminder} />
                </div>
            )}
        </div>
    );
}

export default TopBar;
