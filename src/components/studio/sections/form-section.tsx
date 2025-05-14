"use client";

import { useState } from "react";
import {
  MoreVerticalIcon,
  CopyIcon,
  CopyCheckIcon,
  ImagePlusIcon,
  SparklesIcon,
  RotateCcwIcon,
  Globe2Icon,
  LockIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVideo, useUpdateVideo, useDeleteVideo } from "@/hooks/use-videos";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { ThumbnailUploader } from "@/components/studio/thumbnail-uploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const { data: video, isLoading, error } = useVideo(videoId);
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { mutate: updateVideo } = useUpdateVideo(videoId);
  const { mutate: deleteVideo } = useDeleteVideo(videoId);
  const [copied, setCopied] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateVideo(
      {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        categoryId: formData.get("categoryId") as string,
        visibility: formData.get("visibility") as "public" | "private",
      },
      {
        onSuccess: () => {
          toast.success("Changes saved successfully");
        },
        onError: () => {
          toast.error("Failed to save changes");
        },
      }
    );
  };

  const onCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/videos/${videoId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleThumbnailUpload = (thumbnailUrl: string) => {
    updateVideo(
      {
        thumbnailUrl,
      },
      {
        onSuccess: () => {
          toast.success("Thumbnail updated successfully");
        },
        onError: () => {
          toast.error("Failed to update thumbnail");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteVideo(undefined, {
      onSuccess: () => {
        toast.success("Video deleted successfully");
        router.push("/studio");
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toast.error("Failed to delete video");
      },
    });
  };

  if (isLoading || isCategoriesLoading) {
    return <FormSectionSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to fetch video information. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Video details</h1>
            <p className="text-xs text-muted-foreground">
              Manage your video details
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button type="submit">Save</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete}>
                  <RotateCcwIcon className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-3">
            <div>
              <label className="block mb-2">
                <div className="flex items-center gap-x-2">
                  Title
                  <Button
                    size="icon"
                    variant="outline"
                    type="button"
                    className="rounded-full size-6 [&_svg]:size-3"
                  >
                    <SparklesIcon />
                  </Button>
                </div>
              </label>
              <Input
                name="title"
                defaultValue={video?.title}
                placeholder="Add a title to your video"
              />
            </div>

            <div>
              <label className="block mb-2">
                <div className="flex items-center gap-x-2">
                  Description
                  <Button
                    size="icon"
                    variant="outline"
                    type="button"
                    className="rounded-full size-6 [&_svg]:size-3"
                  >
                    <SparklesIcon />
                  </Button>
                </div>
              </label>
              <Textarea
                name="description"
                defaultValue={video?.description || ""}
                rows={10}
                className="resize-none pr-10"
                placeholder="Add a description to your video"
              />
            </div>

            <div>
              <label className="block mb-2">Thumbnail</label>
              <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                <Image
                  src={video?.thumbnailUrl || "/placeholder.svg"}
                  className="object-cover"
                  fill
                  alt="Thumbnail"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                    >
                      <MoreVerticalIcon className="text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="right">
                    <DropdownMenuItem
                      onClick={() => setIsUploadModalOpen(true)}
                    >
                      <ImagePlusIcon className="size-4 mr-1" />
                      Change
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div>
              <label className="block mb-2">Category</label>
              <Select name="categoryId" defaultValue={video?.categoryId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-y-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
              <div className="aspect-video overflow-hidden relative bg-gray-100">
                {video?.videoUrl && (
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                  />
                )}
              </div>
              <div className="p-4 flex flex-col gap-y-6">
                <div className="flex justify-between items-center gap-x-2">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">Video link</p>
                    <div className="flex items-center gap-x-2">
                      <Link
                        href={`/videos/${videoId}`}
                        className="line-clamp-1 text-sm text-blue-500"
                      >
                        {`${window.location.origin}/videos/${videoId}`}
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={onCopy}
                      >
                        {copied ? <CopyCheckIcon /> : <CopyIcon />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2">Visibility</label>
              <Select
                name="visibility"
                defaultValue={video?.visibility || "private"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center">
                      <Globe2Icon className="size-4 mr-2" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center">
                      <LockIcon className="size-4 mr-2" />
                      Private
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </form>

      <ResponsiveModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        title="Upload Thumbnail"
      >
        <ThumbnailUploader
          onSuccess={handleThumbnailUpload}
          onClose={() => setIsUploadModalOpen(false)}
        />
      </ResponsiveModal>
    </>
  );
};

export const FormSectionSkeleton = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[220px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[84px] w-[153px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="px-4 py-4 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
