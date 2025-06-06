"use client";

import { UploadIcon, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ThumbnailUploaderProps {
  onSuccess: (thumbnailUrl: string) => void;
  onClose: () => void;
}

export const ThumbnailUploader = ({
  onSuccess,
  onClose,
}: ThumbnailUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await handleUpload(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleUpload(files);
  };

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;

    const file = files[0]; // Only take the first file

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percentComplete);
        }
      };

      const uploadPromise = new Promise<{ url: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.response);
            resolve(response);
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
      });

      xhr.open("POST", "/api/upload");
      xhr.send(formData);

      const response = await uploadPromise;

      onSuccess(response.url);
      onClose();
      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setProgress(0);
      toast.error("Failed to upload thumbnail");
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-all",
        isDragging && "border-primary/50 bg-muted/50"
      )}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center rounded-full bg-muted h-32 w-32">
          {isUploading ? (
            <Loader2 className="size-10 text-muted-foreground animate-spin" />
          ) : (
            <UploadIcon
              className={cn(
                "size-10 text-muted-foreground transition-all duration-300",
                isDragging && "animate-bounce"
              )}
            />
          )}
        </div>

        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm">
            {isUploading
              ? "Uploading..."
              : "Drag and drop image file to upload"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPG, PNG, GIF
          </p>
        </div>

        <label htmlFor="thumbnail-upload" className="cursor-pointer">
          <Button
            type="button"
            className="rounded-full"
            disabled={isUploading}
            onClick={() => document.getElementById("thumbnail-upload")?.click()}
          >
            Select file
          </Button>
          <input
            id="thumbnail-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>

        {isUploading && (
          <div className="w-full space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};
