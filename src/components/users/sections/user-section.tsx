import { Separator } from "@/components/ui/separator";
import { UserPageBanner } from "../components/user-page-banner";

interface UserSectionProps {
  userId: string;
}

export const UserSection = ({ userId }: UserSectionProps) => {
  return (
    <div className="flex flex-col">
      <UserPageBanner />
      <Separator />
    </div>
  );
};

export const UserSectionSkeleton = () => {
  return (
    <div className="flex flex-col">
      <Separator />
    </div>
  );
};
