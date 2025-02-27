"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { GraduationCap, Pencil } from "lucide-react";
import { initial } from "lodash";

interface EducationFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  tenthPercentage: z.number().min(0, "Invalid percentage").max(100, "Invalid percentage"),
  twelfthPercentage: z.number().min(0, "Invalid percentage").max(100, "Invalid percentage"),
  cgpa: z.number().min(0, "Invalid CGPA").max(10, "CGPA must be between 0 and 10"),
  educationLevel: z.enum(["UG", "PG"]),
  branch: z.string().min(2, "Branch is required"),
  graduationYear: z.number().min(1900, "Invalid year").max(2100, "Invalid year"),
  minorSpecialization: z.string().optional(),
});

export const EducationForm = ({ initialData, userId }: EducationFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenthPercentage: initialData?.tenthPercentage ? initialData?.tenthPercentage : 0 , // Ensure it's always a number
      twelfthPercentage: initialData?.twelfthPercentage ?? 0,
      cgpa: initialData?.cgpa ?? 0,
      educationLevel: (initialData?.educationLevel as "UG" | "PG") || "UG",
      branch: initialData?.branch || "",
      graduationYear: initialData?.graduationYear ?? new Date().getFullYear(),
      minorSpecialization: initialData?.minorSpecialization || "",
    },
  });
  

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/user/${userId}`, values);
      toast.success("Education details updated successfully");
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
        <div className={cn("text-lg mt-2 flex items-start gap-2", !initialData && "text-neutral-500 italic")}>
          <GraduationCap className="w-5 h-5 mr-2" />
          <div>
          <p><strong>10th Percentage:</strong> {initialData?.tenthPercentage ?? <span className="text-gray-500">Not specified</span>}</p>
            <p><strong>12th Percentage:</strong> {initialData?.twelfthPercentage ?? <span className="text-gray-500">Not specified</span>}</p>
            <p><strong>CGPA:</strong> {initialData?.cgpa ?? <span className="text-gray-500">Not specified</span>}</p>
            <p><strong>Education Level:</strong> {initialData?.educationLevel ?? <span className="text-gray-500">Not specified</span>}</p>
            <p><strong>Branch:</strong> {initialData?.branch ?? <span className="text-gray-500">Not specified</span>}</p>
            <p><strong>Graduation Year:</strong> {initialData?.graduationYear ?? <span className="text-gray-500">Not specified</span>}</p>
            <p><strong>Minor Specialization:</strong> {initialData?.minorSpecialization ?? <span className="text-gray-500">Not specified</span>}</p>
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {["tenthPercentage", "twelfthPercentage", "cgpa", "graduationYear"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as "tenthPercentage" | "twelfthPercentage" | "cgpa" | "graduationYear"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={fieldName.replace(/([A-Z])/g, " $1")}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Education Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                      <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Branch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
  control={form.control}
  name="minorSpecialization"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input
          placeholder="Minor Specialization (Optional)"
          {...field}
          onChange={(e) => field.onChange(e.target.value || "No Minor")}
        />
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
