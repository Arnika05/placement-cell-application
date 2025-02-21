"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Combobox } from "@/components/ui/combo-box";
import { Job } from "@prisma/client";

interface JobModeFormProps {
  initialData: Job;
  jobId: string;
}

const jobModeOptions = [
  { label: "Office", value: "Office" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];

const formSchema = z.object({
  jobMode: z.string().min(1, "Job mode is required"),
  location: z.string().optional(), // Accept multiple locations as a string
});

export const JobModeForm = ({ initialData, jobId }: JobModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobMode: initialData?.jobMode || "",
      location: initialData?.location || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { watch, setValue } = form;
  const selectedJobMode = watch("jobMode");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const selectedOption = jobModeOptions.find((option) => option.value === initialData?.jobMode);

  return (
    <div className="mt-6 border bg-blue-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Mode
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : (<><Pencil className="w-4 h-4 mr-2" /> Edit</>)}
        </Button>
      </div>

      {!isEditing ? (
        <div className="text-sm mt-2">
          <p className={cn(!initialData?.jobMode && "text-neutral-500 italic")}> 
            {selectedOption?.label || "No Job Mode Set"}
          </p>
          {(initialData?.jobMode === "Office" || initialData?.jobMode === "Hybrid") && initialData?.location && (
            <p className="text-sm mt-1">
              <strong>Location(s):</strong> {initialData.location.split(",").join(", ")}
            </p>
          )}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="jobMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      heading="Job Mode"
                      options={jobModeOptions}
                      multiple={false}
                      value={field.value ? [field.value] : []} // Convert string to array
                      onChange={(val) => {
                        field.onChange(val[0]); // Extract single value from array
                        if (val[0] === "Remote") {
                          setValue("location", ""); // Clear location for remote jobs
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(selectedJobMode === "Office" || selectedJobMode === "Hybrid") && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="Enter location(s) separated by commas"
                        className="w-full p-2 border rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
