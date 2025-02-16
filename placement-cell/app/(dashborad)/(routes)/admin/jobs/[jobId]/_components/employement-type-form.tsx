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

interface EmploymentTypeFormProps {
  initialData: Job;
  jobId: string;
}

const employmentOptions = [
  { label: "2M (2 Months", value: "2M" },
  { label: "6M (6 Months)", value: "6M" },
  { label: "FTE (Full Time Employment)", value: "FTE" },
  { label: "6M+FTE (6 Months + Full Time Employment)", value: "6M+FTE" },
];

const formSchema = z.object({
  employmentType: z.string().min(1, "Employment type is required"),
});

export const EmploymentTypeForm = ({ initialData, jobId }: EmploymentTypeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employmentType: initialData?.employmentType || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

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

  const selectedOption = employmentOptions.find((option) => option.value === initialData?.employmentType);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Employment Type
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : (<><Pencil className="w-4 h-4 mr-2" /> Edit</>)}
        </Button>
      </div>

      {!isEditing ? (
        <p className={cn("text-sm mt-2", !initialData?.employmentType && "text-neutral-500 italic")}>
          {selectedOption?.label || "No Employment Type Set"}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox heading="Employment Type" options={employmentOptions} {...field} />
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
