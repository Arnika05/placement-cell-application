"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Pen, Pencil, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface fullNameFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
});

export const FullNameForm = ({ initialData, userId }: fullNameFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/user/${userId}`, values); // Fixed API endpoint
      toast.success("Profile updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleEditing = () => setIsEditing((current: any) => !current)

  return (
    <Box>
        {!isEditing && (
            <div className={cn("text-lg mt-2 flex items-center gap-2",
                !initialData?.fullName && "text-neutral-500 italic"
            )}>
                <UserCircle className="w-5 h-5 mr-2"/>
                {initialData?.fullName ? initialData.fullName : "No full name"}
            </div>
        )}

{isEditing && (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
            className="flex items-center gap-2 flex-1">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input disabled={isSubmitting} placeholder="Enter full name" {...field} />
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

        <Button onClick={toggleEditing} variant={"ghost"}>
        {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
    </Box>
  );
};
