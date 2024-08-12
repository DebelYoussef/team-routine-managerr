"use client";

import React, { useState, useEffect } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Member {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    selected: boolean;
}
interface oldMember {
    id: number;
    employeeId: number;
    routineId: number;
}

interface ParticipantsProps {
    initialMembers: Member[];
    oldMembers: oldMember[];
    onParticipantsUpdate: (participants: Member[]) => void;
}

const Participants2: React.FC<ParticipantsProps> = ({ initialMembers, oldMembers, onParticipantsUpdate }) => {
    const [showMembersList, setShowMembersList] = useState(false);
    const [employees, setEmployees] = useState<Member[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Initialize employees with the selection based on oldMembers
        const updatedMembers = initialMembers.map(member => ({
            ...member,
            selected: oldMembers.some(oldMember => oldMember.employeeId === member.id) // Use employeeId instead of id
        }));
        setEmployees(updatedMembers);
    }, [initialMembers, oldMembers]);

    useEffect(() => {
        // Update selected participants in the parent component
        onParticipantsUpdate(employees.filter(member => member.selected));
    }, [employees]);

    const toggleMembersList = () => {
        setShowMembersList(!showMembersList);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.checked;
        const updatedEmployees = employees.map(member => ({ ...member, selected }));
        setEmployees(updatedEmployees);
    };

    const handleMemberSelect = (id: number) => {
        const updatedEmployees = employees.map(member => member.id === id ? { ...member, selected: !member.selected } : member);
        setEmployees(updatedEmployees);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredMembers = employees.filter(member =>
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='w-full h-full'>
            <div className='flex relative bg-purple-50 border border-solid border-slate-200 mb-3 rounded-xl max-w-[306px]'>
                <div className="mb-3 active:scale-95 cursor-pointer flex flex-col py-3 pr-2.5 pl-6 text-base font-medium text-black bg-purple-50">
                    <div className='inline-block  mt-1'>Aftercode workspace</div>
                </div>
                <input
                    id='all'
                    type="checkbox"
                    className='mr-4 h-5 w-5 absolute top-[20px] right-[5px]'
                    onChange={handleSelectAll}
                />
            </div>
            <div
                className="active:scale-95 cursor-pointer flex flex-col justify-center px-2.5 py-3 text-sm font-medium text-black rounded-xl border border-solid bg-zinc-50 border-stone-300 max-w-[306px]"
                onClick={toggleMembersList}
            >
                <div className="flex gap-1.5">
                    <UserPlus />
                    <div>add person or Team</div>
                </div>
            </div>

            {showMembersList && (
                <div className='p-2 border rounded-xl' id='MembersList'>
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
                </div>
            )}
        </div>
    );
};

export default Participants2;
