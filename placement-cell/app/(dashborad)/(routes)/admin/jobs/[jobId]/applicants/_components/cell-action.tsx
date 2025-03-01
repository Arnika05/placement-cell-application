"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import { MoreHorizontalIcon, Loader, BadgeCheck, Ban } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

interface CellActionProps {
    id: string
    fullName: string
    email: string
}

export const CellAction = ({ id, fullName, email }: CellActionProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [isRejected, setIsRejected] = useState(false)

    const sendSelected = async () => {
        setIsLoading(true)
        try {
            await axios.post(`/api/sendSelected`, { email, fullName })
            toast.success("Candidate Shortlisted")
            setIsSelected(true)
            setIsRejected(false) // Reset rejection state if previously rejected
        } catch (error) {
            toast.error("Something went wrong")
        }
        setIsLoading(false)
    }

    const sendRejection = async () => {
        setIsLoading(true)
        try {
            await axios.post(`/api/sendRejection`, { email, fullName })
            toast.success("Candidate Rejected")
            setIsRejected(true)
            setIsSelected(false) // Reset selection state if previously selected
        } catch (error) {
            toast.error("Something went wrong")
        }
        setIsLoading(false)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={sendSelected}
                    className={`flex items-center justify-center ${isSelected ? 'text-green-600' : ''}`}
                    disabled={isLoading || isSelected}
                >
                    {isLoading && !isRejected ? <Loader className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4 mr-2" />}
                    {isSelected ? "Shortlisted ✅" : "Shortlist"}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={sendRejection}
                    className={`flex items-center justify-center ${isRejected ? 'text-red-600' : ''}`}
                    disabled={isLoading || isRejected}
                >
                    {isLoading && !isSelected ? <Loader className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4 mr-2" />}
                    {isRejected ? "Rejected ❌" : "Reject"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}