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
import { Link, Pencil } from "lucide-react";

interface SocialLinksFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  linkedIn: z.string().url("Enter a valid LinkedIn URL").optional(),
  github: z.string().url("Enter a valid GitHub URL").optional(),
  portfolio: z.string().url("Enter a valid Portfolio URL").optional(),
});

export const SocialLinksForm = ({ initialData, userId }: SocialLinksFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedIn: initialData?.linkedIn ?? "",
      github: initialData?.github ?? "",
      portfolio: initialData?.portfolio ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/user/${userId}`, values);
      toast.success("Social links updated successfully");
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
            <Link className="w-5 h-5 text-blue-600" />
            <strong>LinkedIn:</strong>{" "}
            {initialData?.linkedIn ? (
              <a href={initialData.linkedIn} target="_blank" className="text-blue-500 underline">
                {initialData.linkedIn}
              </a>
            ) : (
              <span className="text-gray-500">Not provided</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-gray-900" />
            <strong>GitHub:</strong>{" "}
            {initialData?.github ? (
              <a href={initialData.github} target="_blank" className="text-blue-500 underline">
                {initialData.github}
              </a>
            ) : (
              <span className="text-gray-500">Not provided</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-green-600" />
            <strong>Portfolio:</strong>{" "}
            {initialData?.portfolio ? (
              <a href={initialData.portfolio} target="_blank" className="text-blue-500 underline">
                {initialData.portfolio}
              </a>
            ) : (
              <span className="text-gray-500">Not provided</span>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">LinkedIn:</label>
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input type="url" placeholder="https://linkedin.com/in/your-profile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">GitHub:</label>
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input type="url" placeholder="https://github.com/your-username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Portfolio:</label>
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input className="w-full" type="url" placeholder="https://your-portfolio.com" {...field} />
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
