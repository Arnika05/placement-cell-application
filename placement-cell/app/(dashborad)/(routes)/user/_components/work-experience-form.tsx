"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Briefcase, Pencil } from "lucide-react";

interface WorkExperienceFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  workExperience: z.string().min(10, "Work experience must be at least 10 characters").optional(),
});

export const WorkExperienceForm = ({ initialData, userId }: WorkExperienceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workExperience: initialData?.workExperience ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/user/${userId}`, values);
      toast.success("Work experience updated successfully");
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
        <div className="text-lg mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-900" />
            {" "}
            {initialData?.workExperience ? (
              <span className="text-gray-700">{initialData.workExperience}</span>
            ) : (
              <span className="text-gray-500">Not provided</span>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Work Experience:</label>
              <FormField
                control={form.control}
                name="workExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Describe your work experience..."
                        {...field}
                        className="w-full max-w-2xl p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
              <Button onClick={toggleEditing} variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isEditing && (
        <Button onClick={toggleEditing} variant="ghost">
          <Pencil className="w-4 h-4 mr-2" /> Edit
        </Button>
      )}
    </Box>
  );
};
