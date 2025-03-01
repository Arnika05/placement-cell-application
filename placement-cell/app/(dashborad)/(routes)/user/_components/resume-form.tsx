"use client";

import { AttachmentsUploads } from "@/components/attachments-uploads";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resumes, UserProfile } from "@prisma/client";
import axios from "axios";
import { File, Loader2, PlusCircle, ShieldCheck, ShieldX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ResumeFormProps {
  initialData: (UserProfile & { resumes: Resumes[] }) | null;
  userId: string;
}

const formSchema = z.object({
  resumes: z.array(z.object({
    url: z.string().url(),
    name: z.string().min(1, "Resume name is required"),
  })),
});

export const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActiveResumeId, setIsActiveResumeId] = useState<string | null>(null);
  const router = useRouter();

  const initialResumes = initialData?.resumes || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { resumes: initialResumes },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/user/${userId}/resumes`, values);
      toast.success("Resume updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onDelete = async (resumeId: string) => {
    setDeletingId(resumeId);
    try {
      if (initialData?.activeResumeId === resumeId) {
        toast.error("Can't delete the active resume");
        return;
      }
      await axios.delete(`/api/user/${userId}/resumes/${resumeId}`);
      toast.success("Resume Removed");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const setActiveResume = async (resumeId: string) => {
    setIsActiveResumeId(resumeId);
    try {
      await axios.patch(`/api/user/${userId}`, { activeResumeId: resumeId });
      toast.success("Resume Activated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsActiveResumeId(null);
    }
  };

  return (
    <div className="mt-6 border flex-1 w-full rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Your Resumes
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : <><PlusCircle className="w-4 h-4 mr-2" /> Add a file</>}
        </Button>
      </div>
      {!isEditing ? (
        <div className="space-y-2">
          {initialResumes.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2">
              <div className="p-3 w-full bg-blue-100 border-blue-200 border text-blue-700 rounded-md flex items-center col-span-10">
                <File className="w-4 h-4 mr-2" />
                <p className="text-xs w-full truncate">{item.name}</p>
                {deletingId === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1"
                    onClick={() => onDelete(item.id)}
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                {isActiveResumeId === item.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-center",
                      initialData?.activeResumeId === item.id ? "text-emerald-500" : "text-red-500"
                    )}
                    onClick={() => setActiveResume(item.id)}
                  >
                    {initialData?.activeResumeId === item.id ? "Live" : "Activate"}
                    {initialData?.activeResumeId === item.id ? (
                      <ShieldCheck className="w-4 h-4 ml-2" />
                    ) : (
                      <ShieldX className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(resumes) => form.setValue("resumes", resumes)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
