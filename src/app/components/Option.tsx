"use client";
import React, { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, parse } from 'date-fns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import Image from 'next/image';
  import Switch2 from '../components/Switch2';

const daysOfWeek: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const generateTimes = (start: number, end: number, interval: number) => {
  const times: { label: string; value: string }[] = [];
  for (let hour = start; hour <= end; hour++) {
    const amPm = hour < 12 ? 'AM' : 'PM';
    const adjustedHour = hour % 12 || 12; // Converts 0 to 12 for 12 AM/PM
    const hourString = adjustedHour < 10 ? `0${adjustedHour}` : adjustedHour.toString();

    for (let minutes = 0; minutes < 60; minutes += interval) {
      const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
      const label = `${hourString}:${minutesString} ${amPm}`;
      const value = `${hour < 10 ? `0${hour}` : hour}:${minutesString}:00`;
      times.push({ label, value });
    }
  }
  return times;
};


const times = generateTimes(8, 18, 60);

interface OptionsData {
  email: boolean;
  frequency: string;
  schedule: string;
  reminder: string;
  visibility: string;
}

interface OptionProps {
  onUpdate: (data: OptionsData) => void;
 
}

export default function Option({ onUpdate }: OptionProps) {


  function convertToDatetime(weekday: string, timeStr: string): string {
    // Map days of the week to their corresponding index (0: Monday, 4: Friday)
    const days: { [key: string]: number } = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
    };
  
    // Handle empty weekday or timeStr
    if (!weekday || !timeStr) {
      return '';
    }
  
    // Check if the weekday is valid
    if (!(weekday in days)) {
      throw new Error("Invalid weekday. Must be between 'Monday' and 'Friday'.");
    }
  
    // Parse the time string to a Date object
    const timeObj = parse(timeStr, 'HH:mm:ss', new Date());
    if (isNaN(timeObj.getTime())) {
      throw new Error("Invalid time format. Must be 'HH:mm:ss'.");
    }
  
    // Get today's date and the current week's Monday date
    const today = new Date();
    const currentWeekMonday = startOfWeek(today, { weekStartsOn: 1 });
  
    // Calculate the date for the given weekday
    const targetDate = addDays(currentWeekMonday, days[weekday]);
  
    // Combine the target date with the time
    const combinedDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      timeObj.getHours(),
      timeObj.getMinutes(),
      0
    );
  
    // Return the formatted datetime string
    return format(combinedDate, 'yyyy-MM-dd HH:mm:ss');
  }
  

    
  const [enabled, setEnabled] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [reminder, setReminder] = useState<string>("1");
  const [reminderUnit, setReminderUnit] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");

  useEffect(() => {
    onUpdate({
      email: enabled,
      frequency,
      schedule: convertToDatetime(day,time),
      reminder: reminder && reminderUnit ? `${reminder} ${reminderUnit}` : "",
      visibility,
    });
  }, [enabled, frequency, day, time, reminder, reminderUnit, visibility]);

  return (
    <div className='w-full h-full text-[#4F4F4F]'>
      <h1 className="mb-2 text-md font-medium font-['Poppins']">How should participants be notified when it’s time to respond ?</h1>
      <div className="flex mb-3 flex-col justify-center self-stretch px-2.5 py-3 text-sm font-medium text-black whitespace-nowrap rounded-xl border border-solid bg-zinc-50 border-stone-300 max-w-[311px]">
        <div className="flex gap-2 relative">
          <Image src={"/images/email.png"} alt={"image"} width={500} height={500}  className="w-6 h-6 mt-1" />
          <h1 className='mt-1 ml-2'>Email</h1>
          <div className='absolute right-[10px]'><Switch2 enabled={enabled} setEnabled={setEnabled}  /></div>
        </div>
      </div>

      <div className="w-full">
        <h1 className="text-md font-medium font-['Poppins'] ">How often would you run this?</h1>
        <Select onValueChange={setFrequency}>
          <SelectTrigger className="w-full mt-2 rounded-xl text-black">
            <SelectValue placeholder="Daily/Weekly/Monthly/Yearly" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value="Daily" className=' hover:border-l-[#FF2D60] hover:border-l-4'>Daily</SelectItem>
            <SelectItem value="Monthly" className=' hover:border-l-[#FF2D60] hover:border-l-4'>Monthly</SelectItem>
            <SelectItem value="Weekly" className=' hover:border-l-[#FF2D60] hover:border-l-4'>Weekly</SelectItem>
            <SelectItem value="Yearly" className=' hover:border-l-[#FF2D60] hover:border-l-4'>Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full mt-4">
        <h1 className="text-md font-medium font-['Poppins'] ">When should we ask participants to respond?</h1>
        <div className="flex">
          <Select onValueChange={setDay} >
            <SelectTrigger className="w-full mt-2 mr-2 rounded-xl text-black">
              <SelectValue placeholder="Day of the week" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {daysOfWeek.map((day) => (
                <SelectItem
                  key={day}
                  value={day}
                  className="hover:border-l-[#FF2D60] hover:border-l-4"
                >
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setTime}>
            <SelectTrigger className="w-full mt-2 mr-2 rounded-xl text-black">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {times.map((time) => (
                <SelectItem
                  key={time.value}
                  value={time.value}
                  className="hover:border-l-[#FF2D60] hover:border-l-4"
                >
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full mt-4">
        <h1 className="text-md font-medium font-['Poppins'] ">Send Reminder to non-responders after</h1>
        <div className="flex mb-2">
          <input type="number" value={reminder} onChange={(e) => setReminder(e.target.value)} className=' mt-2 p-2 border border-black w-[100px] outline-none rounded-xl' />
          <Select onValueChange={setReminderUnit}>
            <SelectTrigger className="w-full mt-2 ml-2 rounded-xl text-black">
              <SelectValue placeholder="Hour(s)/Minute(s)" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="hour" className="hover:border-l-[#FF2D60] hover:border-l-4">Hour</SelectItem>
              <SelectItem value="minute" className="hover:border-l-[#FF2D60] hover:border-l-4">Minute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-md font-medium font-['Poppins'] ">Who should see responses?</h1>
        <Select onValueChange={setVisibility} value={'only me'} >
          <SelectTrigger className="w-full mt-2 rounded-xl text-black">
            <SelectValue placeholder="Only me/Public" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value="only me" className="hover:border-l-[#FF2D60] hover:border-l-4">Only me</SelectItem>
            <SelectItem value="public" className="hover:border-l-[#FF2D60] hover:border-l-4">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

  );
}
