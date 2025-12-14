"use client";

import { SignInButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome to Core Point Menu</CardTitle>
              <CardDescription>
                Sign in to manage your restaurant menus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton mode="modal" fallbackRedirectUrl="/menus">
                <Button className="w-full" size="lg">
                  Sign in with Google
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </SignedOut>
      <SignedIn>
        <RedirectToMenus />
      </SignedIn>
    </>
  );
}

function RedirectToMenus() {
  const router = useRouter();
  useEffect(() => {
    router.push("/menus");
  }, [router]);
  return null;
}