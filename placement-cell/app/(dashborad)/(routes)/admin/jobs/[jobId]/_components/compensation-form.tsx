"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface CompensationFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  type: z.enum(["CTC", "Stipend"], { required_error: "Select CTC or Stipend" }),
  compensation: z
    .string()
    .min(1, "Compensation is required")
    .regex(/^\d+$/, "Must be a number"), // Ensures only numeric input
});

export const CompensationForm = ({ initialData, jobId }: CompensationFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.compensation ? "CTC" : "Stipend", // Default based on existing data
      compensation: initialData?.compensation?.toString() || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { watch } = form; // 
  const selectedType = watch("type"); // Get current selection (CTC or Stipend)

  const onSubmit = async (values: any) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, {
        compensation: values.compensation, // Store as a number
        type: values.type,
      });
      toast.success(`${values.type} updated`);
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-blue-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        CTC/Stipend
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {/* Display compensation value if not in edit mode */}
      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData?.compensation && "text-neutral-500 italic")}>
          {initialData?.compensation
            ? `${initialData.compensation} ${initialData?.type === "CTC" ? "LPA" : "per month"}`
            : "No Data"}
        </p>
      )}

      {/* Edit mode: Input fields */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Select CTC or Stipend */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select CTC or Stipend" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CTC">CTC (LPA)</SelectItem>
                        <SelectItem value="Stipend">Stipend (per month)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Compensation Input */}
            <FormField
              control={form.control}
              name="compensation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`Enter ${selectedType === "CTC" ? "CTC in LPA" : "Stipend per month"}`}
                      {...field}
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
