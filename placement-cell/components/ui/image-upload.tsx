"use client";

import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
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

    const file = e.target.files[0];
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "job-cover-upload"); // Cloudinary upload preset
    formData.append("folder", "JobCoverImage"); // Cloudinary folder
    formData.append("public_id", `${Date.now()}-${file.name}`); // Unique filename

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwdwjk4dd/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        onChange(data.secure_url); // Update the parent component
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-60 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
      {value ? (
        <div className="relative w-full h-full">
          <Image 
            src={value} 
            alt="Uploaded Image" 
            fill 
            className="rounded-md object-cover"
          />
          <button 
            type="button" 
            onClick={() => onRemove(value)} 
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs">
            ✕
          </button>
        </div>
      ) : (
        <>
          {isLoading ? (
            <p className="text-lg font-medium text-gray-600">{`${progress.toFixed(2)}% Uploading...`}</p>
          ) : (
            <label className="flex flex-col items-center gap-2">
              <ImagePlus className="w-12 h-12 text-gray-600" />
              <p className="text-md font-semibold text-gray-700">Click to Upload</p>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={onUpload} 
              />
            </label>
          )}
        </>
      )}
    </div>
  );
}
