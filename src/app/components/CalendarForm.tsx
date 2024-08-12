import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

interface CalendarFormProps {
  onDateChange: (date: string) => void;
}

export function CalendarForm({ onDateChange }: CalendarFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    onDateChange(newDate);
    change();
  };
  const change=()=>{
    if(selectedDate==""){
      return "Today";
    }
    else{
      return selectedDate;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="rounded-xl p-4 border border-neutral-200 mx-3">
        <Button><Calendar className="w-4 h-4 mr-2"/>{change()}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl p-4  border border-neutral-200">
        <label htmlFor="response-date">Choose response date</label>
        <input
          type="date"
          id="response-date"
          className="m-2 border border-neutral-200 rounded-xl cursor-pointer p-2"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </DialogContent>
    </Dialog>
  );
}
