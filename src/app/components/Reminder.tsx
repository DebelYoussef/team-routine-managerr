import React, { useState, useEffect } from 'react';
import { X, User2, UserPlus, Search } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from 'axios';
import { title } from 'process';

interface Member {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    selected: boolean;
}

interface ReminderProps {
    setReminder: (visible: boolean) => void;
}

const Reminder: React.FC<ReminderProps> = ({ setReminder }) => {
    useEffect(() => {
        const fetchData = async () => {
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

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [time, setTime] = useState('02:00:00');
    const [assignee, setAssignee] = useState('For me');
    const [searchTerm, setSearchTerm] = useState("");
    const [showMembersList, setShowMembersList] = useState(false);
    const [initialMembers, setInitialMembers] = useState<Member[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [dateTime,setDateTime]=useState('');

    const createReminder= async()=>{
        const combinedDateTime = deadline + ' ' + time + ':00';
        console.log(dateTime);
        try {
            const response = await axios.post('http://localhost:3000/api/createReminder', {
                title:taskName,
                description,
                reminderTime:combinedDateTime,
              selectedMembers
            });
        
            if (response.status !== 200) {
              throw new Error('Failed to save reminder');
            }
            
        
            const result = response.data;
            
            
            console.log('Remindee saved successfully:', result);
            setReminder (false);
            // Handle success (e.g., show a success message or redirect)
          } catch (error:any) {
            console.error('Error saving reminder:', error);
           console.error({ error: 'Failed to create reminder and people to remind', details: error.message });
            // Handle error (e.g., show an error message)
          }


    }

    const toggleMembersList = () => {
        setShowMembersList(!showMembersList);
    };
    const filteredMembers = initialMembers.filter(member =>
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMemberSelect = (id: number) => {
        const updatedMembers = initialMembers.map(member => {
            if (member.id === id) {
                const updatedMember = { ...member, selected: !member.selected };
                if (updatedMember.selected) {
                    setSelectedMembers([...selectedMembers, updatedMember]);
                } else {
                    setSelectedMembers(selectedMembers.filter(m => m.id !== id));
                }
                return updatedMember;
            }
            return member;
        });
        setInitialMembers(updatedMembers);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="w-[703px] h-[667px] p-3 bg-white shadow-md overflow-hidden rounded-[12px] poppins-regular">
            <div className="md:flex">
                <div className="w-full p-4">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-semibold mb-4">Add Reminder</h2>
                        <X className="cursor-pointer" onClick={() => setReminder(false)} />
                    </div>
                    <hr className='mb-3' />
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskName">
                            Name Reminder
                        </label>
                        <input
                            className="shadow p-[10px] rounded-[12px] appearance-none border w-full h-[63px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="taskName"
                            type="text"
                            placeholder="Name the task"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            About Reminder
                        </label>
                        <textarea
                            className="shadow py-[19px] px-[27px] rounded-[12px] appearance-none border h-[169px] w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex mb-4">
                        <div className="mr-2 ">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
                                Deadline
                            </label>
                            <input
                                className="shadow appearance-none border px-[21px] rounded-[12px] w-[138px] cursor-pointer h-[57px] py-[18px] text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                                id="deadline"
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                        <div className="ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                                Time
                            </label>
                            <input
                                className="shadow appearance-none border px-[21px] rounded-[12px] w-[138px] cursor-pointer h-[57px] py-[18px] text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                                id="time"
                                type="time"
                                value={time}
                                placeholder='pickdate'
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignee">
                            Assignee
                        </label>
                        <div className="flex items-center relative">
                            <button className="bg-[#FFE6EC]  text-[#FF2D60]  px-[10px] py-[4px] mr-2 w-[103px] h-[33px] rounded-[6px]">+ For me</button>
                            <button className="bg-white border border-stone-300 text-black rounded-[10px] px-[10px] pt-[10px] pb-[12px] w-[190px] h-9" onClick={toggleMembersList}><div className="flex "><UserPlus className="w-5 h-5 mr-1" />Add person or Team</div></button>
                            {showMembersList && (
                                <div className='p-2 border rounded-xl absolute right-[90px] bottom-[0px] bg-white' id='MembersList'>
                                    <div className="relative w-auto max-w-[395px] mx-auto">
                                        <input
                                            id='search'
                                            type="text"
                                            placeholder="search"
                                            className="mt-2 outline-none p-2 h-[40px] bg-[#F4F7FC] border border-solid border-neutral-200 w-full rounded-[100px]"
                                            onChange={handleSearch}
                                        />
                                        <Search className="absolute top-4 right-4 text-gray-400 w-5 h-5 cursor-pointer hover:text-neutral-300" />
                                    </div>

                                    <ScrollArea className="h-72 w-full rounded-xl border mt-4">
                                        <div className="p-4">
                                            {filteredMembers.map((member) => (
                                                <div key={member.id} className="text-sm p-4 hover:bg-[#FF2D600A] hover:border-l-[#FF2D60] hover:border-l-4 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className='mr-4 h-4 w-4'
                                                        checked={member.selected}
                                                        onChange={() => handleMemberSelect(member.id)}
                                                    />
                                                    {member.firstName + " " + member.lastName}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>)}
                        </div>
                    </div>
                    <hr className='bg-gray-400 mb-2' />
                    <div className='flex justify-end'>
                        <button onClick={createReminder} className="bg-[#FF2D60] hover:bg-pink-700 text-white font-bold  rounded-[4px] focus:outline-none focus:shadow-outline w-[171px] h-12">
                            Create Reminder
                        </button>
                     
                    </div>
                </div>
            </div> 
            
        </div>
    );
};

export default Reminder;
