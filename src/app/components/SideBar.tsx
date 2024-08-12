import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {  Package2, Home, Users2, ShoppingCart, LineChart, Package, Clock } from 'lucide-react';
import Link from 'next/link';
interface SidebarProps {
  className?: string;
}
import Image from 'next/image';

const SideBar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={`${className} h-full`}>
      <TooltipProvider>
      
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5  h-full ">
        <Link
          href="#"
          className="group flex h-9 w-9 hover:bg-[#F0F0F0] shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Image src={"/images/4points.png"} alt={"image"} width={50} height={50} className="w-[24px] h-[24px]  " />
          <span className="sr-only">Home</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex hover:bg-[#F0F0F0]  h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
               <Image src={"/images/tick.png"} alt={"image"} width={50} height={50} className="w-[24px] h-[24px]  " />
              <span className="sr-only ">Dashboard</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Dashboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex hover:bg-[#F0F0F0] h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Clock className="h-5 w-5 text-[#717476]" />
              <span className="sr-only">Reminders</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className='bg-white'>Reminders</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex hover:bg-[#F0F0F0] h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
                <Image src={"/images/calendar.png"} alt={"image"} width={50} height={50} className="w-[24px] h-[24px]  " />
              <span className="sr-only">Calendar</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className='bg-white'>Calendar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex hover:bg-[#F0F0F0] h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
                <Image src={"/images/star.png"} alt={"image"} width={50} height={50} className="w-[24px] h-[24px]  " />
              <span className="sr-only">Customers</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Customers</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex hover:bg-[#F0F0F0] h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
             <Image src={"/images/chat.png"} alt={"image"} width={50} height={50} className="w-[24px] h-[24px]  " />
              <span className="sr-only">Chat</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Chat</TooltipContent>
        </Tooltip>
      </nav>
    
  </TooltipProvider>
    </div>
  );
}
export default SideBar;
