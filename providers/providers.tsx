import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./convex-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignInUrl="/menu"
      afterSignUpUrl="/menu"
    >
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </ClerkProvider>
  );
}