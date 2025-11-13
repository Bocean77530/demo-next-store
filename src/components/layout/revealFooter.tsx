import type { ReactNode } from "react";
import Footer from "./footer";

export default function RevealFooter({ children }: { children: ReactNode }) {
  return (
    // inside ChanelFooterShell, just above the content block

    <div className="relative min-h-screen bg-black text-white">
      {/* Fixed footer at the bottom, behind content */}
      <div className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>    

      {/* Content that scrolls over the footer */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-32 bg-lean-to-t from-black to-transparent" />
      <div className="relative z-10 bg-black">
        {children}

        {/* This spacer controls how “slowly” the footer is revealed */}
        <div className="h-[120vh]" />
      </div>
    </div>
  );
}