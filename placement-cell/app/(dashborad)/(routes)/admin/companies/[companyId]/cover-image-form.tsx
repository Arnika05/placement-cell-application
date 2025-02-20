"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company, Job } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CoverImageFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  coverImage: z.string().min(1, { message: "Cover Image is required" }),
});

export const CoverImageForm = ({ initialData, companyId }: CoverImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: initialData?.coverImage || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: any) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-blue-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Cover Image
        <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {/* Display the image or placeholder */}
      {!isEditing ? (
        initialData?.coverImage ? (
          <div className="relative w-full h-60 aspect-video mt-2">
            <Image
              alt="Cover Image"
              fill
              className="w-full h-full object-contain"
              src={initialData.coverImage || "/default-image.png"} 
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        )
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!form.formState.isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
