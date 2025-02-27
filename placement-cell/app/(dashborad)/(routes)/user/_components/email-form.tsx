"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Mail, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface EmailFormProps {
  initialData: UserProfile | null;
  userId: string;
}

// Email Validation Schema
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const EmailForm = ({ initialData, userId }: EmailFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/user/${userId}`, values);
      toast.success("Email updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Box>
      {!isEditing && (
        <div className={cn(
          "text-lg mt-2 flex items-center gap-2",
          !initialData?.email && "text-neutral-500 italic"
        )}>
          <Mail className="w-5 h-5" />
          {initialData?.email ? initialData.email : "No email provided"}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="email"
                      placeholder="e.g. sample@domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!form.formState.isValid || isSubmitting} type="submit">
              Save
            </Button>
          </form>
        </Form>
      )}

      <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
        {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
      </Button>
    </Box>
  );
};
