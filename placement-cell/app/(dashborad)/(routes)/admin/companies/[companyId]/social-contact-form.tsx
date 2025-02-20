"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Globe, Linkedin, Mail, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanySocialContactsFormProps{
    initialData : Company
    companyId: string
}

const formSchema = z.object({
    email: z.string().min(1, {message : "Email is required"}),
    website: z.string().min(1, {message : "Website is required"}),
    linkedIn: z.string().min(1, {message : "LinkedIn is required"}),
})
export const CompanySocialContactsForm = ({initialData, companyId} : CompanySocialContactsFormProps) => {
    const [isEditing, setisEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
          email : initialData?.email || "",
          website : initialData?.website|| "",
          linkedIn : initialData?.linkedIn || ""
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
            Company Social Contacts
            <Button onClick={toggleEditing} variant={"ghost"}>
                {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2" />
                Edit 
                </>)}
            </Button>
        </div>

        {/* display the name if not editing */}
        {!isEditing && 
        <>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3">
            {initialData.email && (
              <div className="text-neutral-500 flex items-center w-full truncate">
                <Mail className="w-3 h-3 mr-2"/>
                {initialData.email}
              </div>
            )}
            {initialData.website && (
              <Link 
              href={initialData.website}
              className="text-neutral-500 flex items-center w-full truncate">
                <Globe className="w-3 h-3 mr-2"/>
                {initialData.website}
              </Link>
            )}
            {initialData.linkedIn && (
              <Link 
              href={initialData.linkedIn}
              className="text-neutral-500 flex items-center w-full truncate">
                <Linkedin className="w-3 h-3 mr-2"/>
                {initialData.linkedIn}
              </Link>
            )}
          </div>
        </div>
        </>}

        {/* on editing mode disply the input */}
        {isEditing && (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={isSubmitting} placeholder="Mail: sample@maildomain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={isSubmitting} placeholder="Website Link: 'https://copmanylive.live" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={isSubmitting} placeholder="LinkedIn Link: 'https://linked.in/@yourname" {...field} />
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
