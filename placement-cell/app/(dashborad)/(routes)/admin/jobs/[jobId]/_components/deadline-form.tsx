"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Job } from "@prisma/client";
import { z } from "zod";
import { Loader2, Pencil } from "lucide-react";

interface DeadlineFormProps {
  initialData : Job
  jobId : string // Receive initialData
}

const formSchema = z.object({
  deadline: z.string().min(1, "Deadline is required"),
});

export const DeadlineForm = ({ jobId, initialData }: DeadlineFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Convert initialData.deadline to YYYY-MM-DD format for the input field
  const formattedDeadline = initialData.deadline
    ? new Date(initialData.deadline).toISOString().split("T")[0]
    : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { deadline: formattedDeadline },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("📌 Submitting values:", values);
  
      // Convert to ISO 8601 format
      const formattedDeadline = new Date(values.deadline).toISOString();
  
      console.log("🛠️ Sending formatted deadline:", formattedDeadline);
  
      await axios.patch(`/api/jobs/${jobId}`, {
        deadline: formattedDeadline, // Send as ISO 8601 format
      });
  
      toast.success("Deadline updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating deadline:", error);
      toast.error("Failed to update deadline");
    }
  };
  

  return (
    <div className="mt-6 border bg-blue-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Deadline
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {!isEditing ? (
        <p className="text-neutral-500">
          {initialData.deadline ? new Date(initialData.deadline).toDateString() : "No Deadline Set"}
        </p>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3">
          <input
            type="date"
            {...form.register("deadline")}
            className="w-full p-2 rounded-md border"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </form>
      )}
    </div>
  );
};
function toggleEditing() {
    throw new Error("Function not implemented.");
}

