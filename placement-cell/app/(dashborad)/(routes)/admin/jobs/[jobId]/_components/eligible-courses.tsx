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

interface CoursesEligibleFormProps {
  initialData: Job;
  jobId: string;
}

// Updated eligible courses with specializations
const eligibleCoursesOptions = [
  { label: "B.Tech - Computer Science and Engineering", value: "B.Tech - Computer Science and Engineering" },
  { label: "B.Tech - Electrical Engineering", value: "B.Tech - Electrical Engineering" },
  { label: "B.Tech - Mechanical Engineering", value: "B.Tech - Mechanical Engineering" },
  { label: "B.Tech - Civil Engineering", value: "B.Tech - Civil Engineering" },
  { label: "B.Tech - Electronics and Communication Engineering", value: "B.Tech - Electronics and Communication Engineering" },
  { label: "B.Tech - Chemical Engineering", value: "B.Tech - Chemical Engineering" },
  { label: "B.Tech - Materials and Metallurgical Engineering", value: "B.Tech - Materials and Metallurgical Engineering" },
  { label: "B.Tech + M. Tech - Mathematics and Data Science Engineering", value: "B.Tech + M. Tech - Mathematics and Data Science Engineering" },
  { label: "B.Arch", value: "B.Arch" },
  { label: "B.Planning", value: "B.Planning" },
  { label: "M.Tech - Artificial Intelligence", value: "M.Tech - Artificial Intelligence" },
  { label: "M.Tech - Information Security", value: "M.Tech - Information Security" },
  { label: "M.Tech - Structural Engineering", value: "M.Tech - Structural Engineering" },
  { label: "M.Tech - Thermal Engineering", value: "M.Tech - Thermal Engineering" },
  { label: "M.Tech - Power Systems", value: "M.Tech - Power Systems" },
  { label: "M.Tech - Renewable Energy", value: "M.Tech - Renewable Energy" },
  { label: "M.Tech - VLSI and Embedded Systems", value: "M.Tech - VLSI and Embedded Systems" },
  { label: "M.Tech - Environmental Engineering", value: "M.Tech - Environmental Engineering" },
  { label: "MCA", value: "MCA" },
];

// Updated form schema to accept multiple courses
const formSchema = z.object({
  eligibleCourses: z.array(z.string()).min(1, "At least one course must be selected"),
});

export const CoursesEligibleForm = ({ initialData, jobId }: CoursesEligibleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eligibleCourses: initialData?.eligibleCourses || [], // ✅ Fix: No need for JSON.parse()
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { watch } = form;
  const selectedCourses = watch("eligibleCourses");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, {
        ...values,
        eligibleCourses: values.eligibleCourses, // ✅ Fix: Send as an array, not a JSON string
      });
      toast.success("Eligibility updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Eligible Courses
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : (<><Pencil className="w-4 h-4 mr-2" /> Edit</>)}
        </Button>
      </div>

      {!isEditing ? (
        <div className="text-sm mt-2">
          {selectedCourses.length > 0 ? (
            <ul>
              {selectedCourses.map((course, index) => (
                <li key={index}>{course}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500 italic">No Eligible Courses Set</p>
          )}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Multi-Select Dropdown */}
            <FormField
              control={form.control}
              name="eligibleCourses"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      heading="Eligible Courses"
                      multiple
                      options={eligibleCoursesOptions}
                      value={field.value} // Ensure it's controlled
                      onChange={field.onChange} // Handle changes properly
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
