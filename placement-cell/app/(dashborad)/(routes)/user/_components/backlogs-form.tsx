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
import { ClipboardList, Pencil } from "lucide-react";

interface BacklogFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  activeBacklogs: z.number().min(0, "Active backlogs cannot be negative"),
  totalBacklogs: z.number().min(0, "Total backlogs cannot be negative"),
});

export const BacklogStatusForm = ({ initialData, userId }: BacklogFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activeBacklogs: initialData?.activeBacklogs ?? 0,
      totalBacklogs: initialData?.totalBacklogs ?? 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/user/${userId}`, values);
      toast.success("Backlog details updated successfully");
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
        <div className="text-lg mt-2 flex items-start gap-2">
          <ClipboardList className="w-5 h-5 mr-2" />
          <div>
            <p>
              Active Backlogs: {initialData?.activeBacklogs ?? <span className="text-gray-500">Not specified</span>}
            </p>
            <p>
              Total Backlogs: {initialData?.totalBacklogs ?? <span className="text-gray-500">Not specified</span>}
            </p>
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold">Active Backlogs:</label>
              <FormField
                control={form.control}
                name="activeBacklogs"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold">Total Backlogs:</label>
              <FormField
                control={form.control}
                name="totalBacklogs"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
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
