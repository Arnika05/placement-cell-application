"use client"

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";


interface JobPublishActionProps {
    disabled : boolean;
    jobId: string;
    isPublished: boolean;
}
const JobPushLishActions = ({
    disabled,
    jobId,
    isPublished,
} : JobPublishActionProps) => {

    const [isLoading, setisLoading] = useState(false);

    const onClick = () => {}
    const onDelete = () => {}

    return ( 
    <div className="flex items-center gap-x-3">
        <Button variant={"outline"} onClick={onClick} disabled={disabled || isLoading} size={"sm"}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
            {isPublished ? "Unpublish" : "Publish"}
        </Button>

        <Button variant={"destructive"} size={"icon"} disabled={isLoading} onClick={onDelete}>
            <Trash className="w-4 h-4"/>
        </Button>

    </div> );
}
 
export default JobPushLishActions;