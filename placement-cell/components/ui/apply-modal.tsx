"use client";

import { Resumes, UserProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import Box from "../box";
import Link from "next/link";
import { Button } from "./button";
import { FaFileAlt, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

export const ApplyModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userProfile,
}: ApplyModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Confirm Your Application"
      description="Please review your details before proceeding."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box className="p-4 bg-gray-50 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex items-center gap-2 p-3 border rounded-md bg-white shadow-sm">
            <FaUser className="text-blue-600" />
            <span>{userProfile?.fullName || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 p-3 border rounded-md bg-white shadow-sm">
            <FaPhone className="text-green-600" />
            <span>{userProfile?.contact || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 p-3 border rounded-md bg-white shadow-sm col-span-2">
            <FaEnvelope className="text-red-600" />
            <span>{userProfile?.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 p-3 border rounded-md bg-white shadow-sm col-span-2">
            <FaFileAlt className="text-purple-600" />
            <span className="font-semibold">Your Active Resume:</span>
            <span className="text-blue-700 truncate">
              {userProfile?.resumes.find(
                (resume) => resume.id === userProfile?.activeResumeId
              )?.name || "Not Selected"}
            </span>
          </div>

          <div className="col-span-2 text-sm text-muted-foreground flex justify-between">
            <span>Need to update your details?</span>
            <Link href="/user" className="text-blue-600 font-semibold hover:underline">
              Edit Profile
            </Link>
          </div>
        </div>
      </Box>

      <div className="pt-6 flex justify-end gap-3">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md shadow-md transition-all"
          onClick={onConfirm}
        >
          Confirm & Apply
        </Button>
      </div>
    </Modal>
  );
};
