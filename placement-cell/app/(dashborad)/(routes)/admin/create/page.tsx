"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "Job Title cannot be empty" }),
});

const JobCreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.post("/api/jobs", values);
        router.push(`/admin/jobs/${response.data.id}`)
        toast.success("Job Created")
    } catch (error) {
        console.log((error as Error)?.message)
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-200">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Name Your Job</h1>
        <p className="text-sm text-neutral-500 mb-4">Write the job name below</p>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-600 font-semibold">Job Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Full Stack Developer'"
                      {...field}
                      className="border-blue-400 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400 text-xs">
                    Specify the role for this job.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-x-3">
              <Link href="/admin/jobs">
                <Button type="button" variant="outline" className="border border-red-500 text-red-500 hover:bg-red-100">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700 transition rounded-md shadow-md px-4 py-2"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JobCreatePage;
