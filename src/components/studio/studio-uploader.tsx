"use client";

import { UploadIcon, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSaveVideo } from "@/hooks/use-videos";

export const StudioUploader = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { mutate: saveVideo } = useSaveVideo();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      const file = files[0];
      setIsUploading(true);
      setProgress(0);

      try {
        const duration = await new Promise<number>((resolve) => {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            resolve(Math.round(video.duration));
            window.URL.revokeObjectURL(video.src);
          };
          video.src = URL.createObjectURL(file);
        });

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

        const uploadPromise = new Promise<{ url: string }>(
          (resolve, reject) => {
            xhr.onload = () => {
              if (xhr.status === 200) {
                const response = JSON.parse(xhr.response);
                resolve(response);
              } else {
                reject(new Error("Upload failed"));
              }
            };
            xhr.onerror = () => reject(new Error("Upload failed"));
          }
        );

        xhr.open("POST", "/api/upload");
        xhr.send(formData);

        const response = await uploadPromise;

        saveVideo(
          { videoUrl: response.url, duration: duration },
          {
            onSuccess: () => {
              toast.success("Video uploaded successfully!");
              setProgress(100);
              setIsUploading(false);
              onSuccess();
            },
            onError: (error) => {
              console.error("Upload error:", error);
              setIsUploading(false);
              setProgress(0);
              toast.error("Failed to upload video");
            },
          }
        );
      } catch (error) {
        console.error("Upload error:", error);
        setIsUploading(false);
        setProgress(0);
        toast.error("Failed to upload video");
      }
    },
    [saveVideo, onSuccess]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      await handleUpload(files);
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      await handleUpload(files);
    },
    [handleUpload]
  );

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
              : "Drag and drop video file to upload"}
          </p>
          <p className="text-xs text-muted-foreground">
            Your videos will be private until you publish them
          </p>
        </div>

        <label htmlFor="file-upload" className="cursor-pointer">
          <Button
            type="button"
            className="rounded-full"
            disabled={isUploading}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Select file
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="video/*"
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
