"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { StudioUploader } from "./studio-uploader";

export const StudioUploadModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <StudioUploader />
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => setIsModalOpen(true)}
        disabled={false}
      >
        <PlusIcon />
        Create
      </Button>
    </>
  );
};
