import { StudioLayout } from "@/components/studio/studio-layout";
import { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "YouTube Studio",
  description: "Manage your YouTube channel content and videos",
};

const Layout = ({ children }: LayoutProps) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
