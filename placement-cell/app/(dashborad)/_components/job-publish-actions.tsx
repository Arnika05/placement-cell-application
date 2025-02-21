"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

const JobPublishActions = ({ disabled, jobId, isPublished }: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [publishedState, setPublishedState] = useState(isPublished);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (publishedState) {
        await axios.patch(`/api/jobs/${jobId}/unpublish`);
        toast.success("Job Unpublished");
      } else {
        await axios.patch(`/api/jobs/${jobId}/publish`);
        toast.success("Job Published");
      }
      setPublishedState(!publishedState); // Update local state
      router.refresh(); // Refresh the page
    } catch (error) {
      toast.error("Something went wrong");
      console.log((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async() => {
    try {
        setIsLoading(true);
        await axios.delete(`/api/jobs/${jobId}`)
        toast.success("Job Deleted")
        router.refresh()
        return router.push("/admin/jobs")
      } catch (error) {
        toast.error("Something went wrong");
        console.log((error as Error)?.message);
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading || disabled}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        {publishedState ? "Unpublish" : "Publish"}
      </Button>

      <Button variant="destructive" size="icon" disabled={isLoading} onClick={onDelete}>
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default JobPublishActions;
