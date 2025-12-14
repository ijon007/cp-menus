import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./convex-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignInUrl="/menus"
      afterSignUpUrl="/menus"
    >
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </ClerkProvider>
  );
}