"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Combobox } from "@/components/ui/combo-box";

interface CompanyFormProps{
    initialData : Job
    jobId : string
    options : {label : string, value : string}[]
}

const formSchema = z.object({
    companyId: z.string().min(1),
})
export const CompanyForm = ({initialData, jobId, options} : CompanyFormProps) => {
    const [isEditing, setisEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            companyId : initialData?.companyId || ""
        }
    })

    const { isSubmitting, isValid} = form.formState

    const onSubmit = async (values: any) => {
        try {
          const response = await axios.patch(`/api/jobs/${jobId}`, values);
          toast.success("Job updated");
          toggleEditing();
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
        }
      };

    const toggleEditing = () => setisEditing((current: any) => !current)

    const selectedOption = options.find( 
        option =>  option.value === initialData.companyId
    )

  return (
    <div className="mt-6 border bg-blue-50 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Job Created By
            <Button onClick={toggleEditing} variant={"ghost"}>
                {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2" />
                Edit 
                </>)}
            </Button>
        </div>

        {/* display the companyId if not editing */}
        {!isEditing && <p className={cn("text-sm mt-2",
            !initialData?.companyId && "text-neutral-500 italic"
        )}>{selectedOption?.label || "No Company"}</p>}

        {/* on editing mode disply the input */}
        {isEditing && (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                      multiple={false} 
                      heading = "Companies"
                      options = {options}
                      value={field.value ? [field.value] : []} onChange={(selected) => field.onChange(selected[0] || "")}/>
                         
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
