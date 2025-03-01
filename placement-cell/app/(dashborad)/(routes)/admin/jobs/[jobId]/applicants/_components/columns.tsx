"use client"

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, File, MoreHorizontalIcon, Pencil } from "lucide-react";
import Link from "next/link";
import { CellAction } from "./cell-action";
  

export type ApplicantsColumns = {
  id: string;
  fullName: string;
  email: string;
  contact: string;
  appliedAt: string;
  resume: string;
  resumeName: string
}

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Contact
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "resume",
    header: "Resume",
    cell :({row}) =>{
      const { resume, resumeName} = row.original;
      return (
        <Link  target="_blank" href={resume} className="flex items-center text-blue-500">
          <File className="w-4 h-4 mr-2" />
          <p className="w-44 truncate">{resumeName}</p>
        </Link>
      )
    } 
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    id: "actions",
    cell: ({row}) => {
      const { id, fullName, email } = row.original;
        return <CellAction fullName={fullName} email={email} id={id} />

    }
  }
]
