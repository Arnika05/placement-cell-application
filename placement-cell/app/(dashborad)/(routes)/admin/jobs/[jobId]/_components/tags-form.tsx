"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import getGenerativeAIResponse from "@/scripts/aistudio";

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

// Form schema
const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

export const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  
  // Ensure jobTags is initialized properly
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags ? initialData.tags.split(",") : []);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: jobTags },
  });

  const { isSubmitting, isValid } = form.formState;

  // Ensure form updates when jobTags change
  useEffect(() => {
    form.setValue("tags", jobTags);
  }, [jobTags, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updatedTags = values.tags.join(",");  
      const response = await axios.patch(`/api/jobs/${jobId}`, { tags: updatedTags });
  
      toast.success("Tags updated successfully");
  
      setJobTags(values.tags);
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update tags. Check console for details.");
    }
  };
  

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handlePromptGeneration = async () => {
    try {
      if (!prompt.trim()) return;
      setIsPrompting(true);
  
      const customPrompt = `Generate an array of top 15 skills required related to the job profession "${prompt}". 
        Your output should be a valid JSON array of strings.
        Example output: ["React", "JavaScript", "Node.js"]`;
  
      const response = await getGenerativeAIResponse(customPrompt);
      console.log("Raw AI Response:", response); // Debugging
  
      let generatedTags: string[] = [];
  
      // Extract JSON array from response using regex
      const jsonMatch = response.match(/\[[\s\S]*\]/); // ✅ Matches newlines without '/s'
 // Matches anything inside square brackets
      if (jsonMatch) {
        try {
          generatedTags = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          toast.error("AI returned invalid JSON data.");
          setIsPrompting(false);
          return;
        }
      } else {
        console.error("No JSON array found in AI response.");
        toast.error("AI did not return a valid JSON array.");
        setIsPrompting(false);
        return;
      }
  
      console.log("Parsed Tags:", generatedTags); // Debugging
  
      if (!Array.isArray(generatedTags) || generatedTags.length === 0) {
        toast.error("AI failed to generate tags.");
        setIsPrompting(false);
        return;
      }
  
      setJobTags([...generatedTags]); // Update state
      form.setValue("tags", [...generatedTags]); // Update form state
      setIsPrompting(false);
    } catch (error) {
      console.error("Error fetching AI-generated tags:", error);
      toast.error("Something went wrong!");
      setIsPrompting(false);
    }
  };
  

  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setJobTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  return (
    <div className="mt-6 border bg-blue-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-neutral-500">
          {jobTags.length > 0 ? jobTags.join(", ") : "No Tags"}
        </p>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g. 'Full Stack Developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md border"
            />
            {isPrompting ? (
              <Button disabled><Loader2 className="w-4 h-4 animate-spin" /></Button>
            ) : (
              <Button onClick={handlePromptGeneration}><Lightbulb className="w-4 h-4" /></Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-right">
            *Enter a profession name to generate relevant job tags.
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-blue-600 text-white"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-white"
                    onClick={() => handleTagRemove(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No Tags Generated</p>
            )}
          </div>

          <div className="flex items-center gap-x-2">
                <Button disabled={isSubmitting} type="submit" onClick={form.handleSubmit(onSubmit)}
                className="animate spin mt-2">
                  Save
                </Button>
              </div>
        </>
      )}
    </div>
  );
};
