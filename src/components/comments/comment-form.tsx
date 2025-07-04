import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UserAvatar } from "../ui/user-avatar";
import { toast } from "sonner";
import { useCreateComment } from "@/hooks/use-comments";
import { useSession } from "next-auth/react";

const commentSchema = z.object({
  parentId: z.string().optional(),
  videoId: z.string(),
  value: z.string().min(1, "Comment cannot be empty"),
});

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "comment" | "reply";
}

export const CommentForm = ({
  videoId,
  parentId,
  onCancel,
  onSuccess,
  variant = "comment",
}: CommentFormProps) => {
  const { mutate: createComment, isPending } = useCreateComment();
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      parentId: parentId,
      videoId: videoId,
      value: "",
    },
  });

  const { data: session } = useSession();

  const handleSubmit = (values: z.infer<typeof commentSchema>) => {
    createComment(values, {
      onSuccess: () => {
        form.reset();
        toast.success(variant === "reply" ? "Reply posted" : "Comment posted");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to post comment");
      },
    });
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <UserAvatar
          size="lg"
          imageUrl={session?.user?.image || "/avatar.svg"}
          name={session?.user?.name || "User"}
          className="mt-2"
        />
        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "reply"
                        ? "Reply to this comment..."
                        : "Add a comment..."
                    }
                    className="resize-none bg-transparent overflow-hidden"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit" size="sm">
              {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
