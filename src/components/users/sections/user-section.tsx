import { Separator } from "@/components/ui/separator";
import { UserPageBanner } from "../components/user-page-banner";
import { UserPageInfo } from "../components/user-page-info";

interface UserSectionProps {
  userId: string;
}

export const UserSection = ({ userId }: UserSectionProps) => {
  return (
    <div className="flex flex-col">
      <UserPageBanner />
      <UserPageInfo />
      <Separator />
    </div>
  );
};
