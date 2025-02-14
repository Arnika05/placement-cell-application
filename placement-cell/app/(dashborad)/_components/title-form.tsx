"use client"

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TitleFormProps{
    initialData : {
        title : string
    };
    jobId: string
}

const formSchema = z.object({
    title: z.string().min(1, {message : "Title is required"}),
})
export const TitleForm = ({initialData, jobId} : TitleFormProps) => {
    const [isEditing, setisEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: initialData,
    })

    const { isSubmitting, isValid} = form.formState

    const onSubmit = async( values: z.infer<typeof formSchema>) => {};

    const toggleEditing = () => setisEditing((current: any) => !current)

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Job Title
            <Button onClick={toggleEditing} variant={"ghost"}>
                {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2" />
                Edit Title 
                </>)}
            </Button>
        </div>
    </div>
  )
}
