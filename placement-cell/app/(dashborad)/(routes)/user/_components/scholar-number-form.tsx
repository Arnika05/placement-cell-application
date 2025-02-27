"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { NotebookText, Pencil } from "lucide-react";

interface ScholarNumberFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  scholarNumber: z.string().min(6, "Scholar Number must be at least 6 characters").max(20, "Scholar Number must be at most 20 characters"),
});

export const ScholarNumberForm = ({ initialData, userId }: ScholarNumberFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scholarNumber: initialData?.scholarNumber || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/user/${userId}`, values);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <Box>
      {!isEditing && (
        <div className={cn("text-lg mt-2 flex items-center gap-2", !initialData?.scholarNumber && "text-neutral-500 italic")}>
          <NotebookText className="w-5 h-5 mr-2" />
          {initialData?.scholarNumber ? initialData.scholarNumber : "Not specified"}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 flex-1">
            <FormField
              control={form.control}
              name="scholarNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="Enter your Scholar Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting} type="submit">
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
