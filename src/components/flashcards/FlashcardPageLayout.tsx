
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FlashcardPageLayoutProps {
  children: React.ReactNode;
  isMobile: boolean;
}

export default function FlashcardPageLayout({ children, isMobile }: FlashcardPageLayoutProps) {
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col h-full w-full overflow-hidden ios-viewport-fix">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
