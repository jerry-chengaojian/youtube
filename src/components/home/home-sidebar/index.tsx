import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { PersonalSection } from "./personal-section";
import { SubscriptionsSection } from "./subscriptions-section";
import { auth } from "@/auth";

export async function HomeSidebar() {
  const session = await auth();

  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
        <PersonalSection />
        <Separator />
        {session && <SubscriptionsSection />}
      </SidebarContent>
    </Sidebar>
  );
}
