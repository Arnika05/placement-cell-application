"use client";

import { FilePlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}

export const AttachmentsUploads = ({
  disabled,
  onChange,
  value,
}: AttachmentsUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled) return;

    const files: File[] = Array.from(e.target.files);
    setIsLoading(true);

    const newUrls: { url: string; name: string }[] = [];
    let completedFiles = 0;

    files.forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "job-attachment-upload"); // Cloudinary upload preset
      formData.append("folder", "JobAttachment"); // Cloudinary folder
      formData.append("public_id", `${Date.now()}-${file.name}`); // Unique filename

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dwdwjk4dd/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          newUrls.push({ url: data.secure_url, name: file.name });

          completedFiles++;

          if (completedFiles === files.length) {
            setIsLoading(false);
            onChange([...value, ...newUrls]);
            toast.success("Files uploaded successfully!");
          }
        } else {
          throw new Error("Invalid response from server.");
        }
      } catch (error) {
        toast.error("Upload failed. Please try again.");
        console.error("Upload error:", error);
      }
    });
  };

  const onRemove = (fileToRemove: { url: string; name: string }) => {
    onChange(value.filter((file) => file.url !== fileToRemove.url));
    toast.success("File removed.");
  };

  return (
    <div>
      <div className="w-full h-40 bg-purple-100 p-2 flex flex-col items-center justify-center">
        {isLoading ? (
          <p>{`${progress.toFixed(2)}% Uploading...`}</p>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <div className="flex gap-2 items-center justify-center">
              <FilePlus className="w-5 h-5 mr-2" />
              <p>Add a file</p>
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
              multiple
              className="hidden"
              onChange={onUpload}
            />
          </label>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {value.map((file) => (
          <div
            key={file.url}
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <p className="truncate">{file.name}</p>
            <button
              type="button"
              onClick={() => onRemove(file)}
              className="text-red-500"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
