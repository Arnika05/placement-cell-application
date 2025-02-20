"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface WhyJoinUsFormProps{
    initialData : Company
    companyId: string
}

const formSchema = z.object({
    whyJoinUs: z.string().min(1, {message : "Why Join Us is required"}),
})
export const WhyJoinUsForm = ({initialData, companyId} : WhyJoinUsFormProps) => {
    const [isEditing, setisEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
          whyJoinUs : initialData?.whyJoinUs || ""
        }
    })

    const { isSubmitting, isValid} = form.formState

    const onSubmit = async (values: any) => {
        try {
          const response = await axios.patch(`/api/companies/${companyId}`, values);
          toast.success("Company Updated");
          toggleEditing();
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
        }
      };

    const toggleEditing = () => setisEditing((current: any) => !current)

  return (
    <div className="mt-6 border bg-blue-50 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Why Join Us?
            <Button onClick={toggleEditing} variant={"ghost"}>
                {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2" />
                Edit 
                </>)}
            </Button>
        </div>

        {/* display the name if not editing */}
        {!isEditing && 
        <p 
        className={cn("text-sm mt-2", !initialData.description && "text-neutral-500 italic")}>
          {initialData.whyJoinUs || "No Text"}
          </p>}

        {/* on editing mode disply the input */}
        {isEditing && (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="whyJoinUs"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea disabled={isSubmitting} placeholder="Write here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      
              <div className="flex items-center gap-x-2">
                <Button disabled={!form.formState.isValid || isSubmitting} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        )}
    </div>
  )
}
