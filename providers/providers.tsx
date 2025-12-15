import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./convex-client";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignInUrl="/menu"
      afterSignUpUrl="/menu"
    >
      <ConvexClientProvider>
        {children}
        <Toaster position="top-center"/>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}