"use client";

import { SignedIn, SignedOut, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Coffee01Icon,
  Restaurant01Icon,
  Menu01Icon,
  PlateIcon,
  DrinkIcon,
  CafeIcon,
} from "@hugeicons/core-free-icons";

export default function HomePage() {
  return (
    <>
      <SignedOut>
        <SignInContent />
      </SignedOut>
      <SignedIn>
        <RedirectToMenus />
      </SignedIn>
    </>
  );
}

function SignInContent() {
  const { signIn } = useSignIn();

  const handleGoogleSignIn = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/menus",
      redirectUrlComplete: "/menus",
    });
  };

  const floatingIcons = [
    { icon: Coffee01Icon, top: "8%", left: "5%", size: "w-8 h-8", delay: "0s" },
    { icon: Restaurant01Icon, top: "15%", right: "8%", size: "w-10 h-10", delay: "0.5s" },
    { icon: Menu01Icon, top: "25%", left: "12%", size: "w-7 h-7", delay: "1s" },
    { icon: PlateIcon, top: "35%", right: "15%", size: "w-9 h-9", delay: "1.5s" },
    { icon: Coffee01Icon, bottom: "30%", left: "8%", size: "w-8 h-8", delay: "0.3s" },
    { icon: Restaurant01Icon, bottom: "25%", right: "12%", size: "w-10 h-10", delay: "0.8s" },
    { icon: DrinkIcon, top: "45%", left: "3%", size: "w-7 h-7", delay: "1.2s" },
    { icon: CafeIcon, top: "55%", right: "5%", size: "w-9 h-9", delay: "0.6s" },
    { icon: DrinkIcon, bottom: "40%", left: "18%", size: "w-8 h-8", delay: "1.4s" },
    { icon: CafeIcon, top: "20%", left: "25%", size: "w-9 h-9", delay: "0.4s" },
    { icon: PlateIcon, bottom: "15%", right: "20%", size: "w-10 h-10", delay: "1.1s" },
    { icon: Coffee01Icon, top: "60%", left: "7%", size: "w-8 h-8", delay: "0.7s" },
    { icon: Menu01Icon, bottom: "50%", right: "8%", size: "w-9 h-9", delay: "1.3s" },
    { icon: Restaurant01Icon, top: "70%", right: "25%", size: "w-8 h-8", delay: "0.9s" },
    { icon: DrinkIcon, bottom: "10%", left: "15%", size: "w-7 h-7", delay: "0.2s" },
    { icon: Coffee01Icon, top: "12%", left: "30%", size: "w-6 h-6", delay: "0.1s" },
    { icon: Menu01Icon, top: "40%", left: "22%", size: "w-8 h-8", delay: "0.8s" },
    { icon: PlateIcon, top: "50%", right: "30%", size: "w-7 h-7", delay: "1.6s" },
    { icon: CafeIcon, bottom: "35%", left: "28%", size: "w-9 h-9", delay: "0.5s" },
    { icon: DrinkIcon, top: "65%", left: "20%", size: "w-8 h-8", delay: "1.1s" },
    { icon: Restaurant01Icon, bottom: "45%", right: "35%", size: "w-7 h-7", delay: "0.3s" },
    { icon: Coffee01Icon, top: "30%", left: "40%", size: "w-6 h-6", delay: "0.9s" },
    { icon: Menu01Icon, bottom: "20%", left: "35%", size: "w-8 h-8", delay: "1.4s" },
    { icon: PlateIcon, top: "75%", right: "12%", size: "w-9 h-9", delay: "0.6s" },
    { icon: CafeIcon, bottom: "60%", left: "12%", size: "w-7 h-7", delay: "1.2s" },
    { icon: DrinkIcon, top: "18%", right: "35%", size: "w-8 h-8", delay: "0.4s" },
    { icon: Coffee01Icon, bottom: "55%", right: "28%", size: "w-6 h-6", delay: "1.0s" },
    { icon: Restaurant01Icon, top: "48%", left: "35%", size: "w-9 h-9", delay: "0.7s" },
    { icon: Menu01Icon, bottom: "30%", left: "42%", size: "w-7 h-7", delay: "1.3s" },
    { icon: PlateIcon, top: "85%", left: "25%", size: "w-8 h-8", delay: "0.2s" },
    { icon: CafeIcon, bottom: "5%", right: "15%", size: "w-9 h-9", delay: "1.5s" },
    { icon: DrinkIcon, top: "38%", right: "40%", size: "w-7 h-7", delay: "0.8s" },
    { icon: Coffee01Icon, bottom: "18%", left: "50%", size: "w-6 h-6", delay: "1.1s" },
    { icon: Restaurant01Icon, top: "52%", left: "50%", size: "w-8 h-8", delay: "0.5s" },
    { icon: Menu01Icon, bottom: "65%", right: "45%", size: "w-9 h-9", delay: "0.3s" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden relative bg-linear-to-br from-background via-background to-muted/30">
      {/* Decorative floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-primary/10 blur-xl animate-float-delayed" />
        <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-primary/10 blur-xl animate-float" />
        <div className="absolute bottom-32 left-1/4 w-14 h-14 rounded-full bg-primary/10 blur-xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/3 w-12 h-12 rounded-full bg-primary/10 blur-xl animate-float-delayed" />
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        
        {/* Floating food and coffee icons */}
        {floatingIcons.map((item, index) => {
          const IconComponent = item.icon;
          const style: React.CSSProperties = {
            animationDelay: item.delay,
            ...(item.top ? { top: item.top } : {}),
            ...(item.bottom ? { bottom: item.bottom } : {}),
            ...(item.left ? { left: item.left } : {}),
            ...(item.right ? { right: item.right } : {}),
          };
          
          return (
            <div
              key={index}
              className={`absolute ${item.size} text-muted-foreground/15 animate-float`}
              style={style}
            >
              <HugeiconsIcon icon={IconComponent} className="w-full h-full" />
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center animate-fade-in">
        {/* Logo */}
        <div className="relative animate-scale-in">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full animate-pulse-slow" />
          <div className="relative">
            <Image
              src="/cp-brown.svg"
              alt="Core Point Logo"
              width={120}
              height={120}
              className="drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 animate-slide-up">
          <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Core Point Menu
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Manage your restaurant menus with ease
          </p>
        </div>

        {/* Sign in button */}
        <div className="animate-slide-up-delayed">
          <Button
            onClick={handleGoogleSignIn}
            className="px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

function RedirectToMenus() {
  const router = useRouter();
  useEffect(() => {
    router.push("/menus");
  }, [router]);
  return null;
}