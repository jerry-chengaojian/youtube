"use client";

import { UploadIcon, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StudioUploaderProps {
  endpoint?: string;
  onSuccess: () => void;
}

export const StudioUploader = ({
  endpoint = "/api/upload",
  onSuccess,
}: StudioUploaderProps) => {
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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await handleUpload(files);
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      await handleUpload(files);
    },
    []
  );

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;

    const file = files[0]; // 只取第一个文件
    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      // 处理上传进度
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percentComplete);
        }
      };

      // 创建 Promise 来处理上传完成或失败
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

      // 开始上传
      xhr.open("POST", "/api/upload");
      xhr.send(formData);

      // 等待上传完成
      const response = await uploadPromise;
      console.log("Uploaded file URL:", response.url); // 打印返回的 URL

      setProgress(100);
      setIsUploading(false);
      onSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setProgress(0);
      // 这里可以添加错误提示 UI
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
              : "Drag and drop video files to upload"}
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
            Select files
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
