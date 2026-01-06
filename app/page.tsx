"use client";

/* Next */
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

/* Components */
import { SignedIn, SignedOut, useSignIn, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";

/* Constants */
import { FLOATING_ICONS } from "@/constants/home-page";
import { DEFAULT_IMAGES } from "@/constants/images";

export default function HomePage() {
  const { isSignedIn, userId, sessionId } = useAuth();
  // #region agent log
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = searchParams.has('code') || searchParams.has('state') || searchParams.has('error');
    fetch('http://127.0.0.1:7242/ingest/d7e793c3-bec0-41ea-bfdb-7378ab0af892',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:17',message:'HomePage rendered',data:{currentUrl,hasOAuthParams,code:searchParams.get('code')||null,state:searchParams.get('state')||null,error:searchParams.get('error')||null,isSignedIn,userId:userId||null,sessionId:sessionId||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }
  // #endregion
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
    // #region agent log
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'server';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectUrl = typeof window !== 'undefined' ? `${origin}/menu` : "/menu";
    const redirectUrlComplete = typeof window !== 'undefined' ? `${origin}/menu` : "/menu";
    fetch('http://127.0.0.1:7242/ingest/d7e793c3-bec0-41ea-bfdb-7378ab0af892',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:41',message:'OAuth sign-in initiated',data:{currentUrl,origin,redirectUrl,redirectUrlComplete,strategy:'oauth_google'},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: redirectUrl,
      redirectUrlComplete: redirectUrlComplete,
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d7e793c3-bec0-41ea-bfdb-7378ab0af892',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:52',message:'authenticateWithRedirect called',data:{signInExists:!!signIn,redirectUrl,redirectUrlComplete},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  };


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
        {FLOATING_ICONS.map((item, index) => {
          const IconComponent = item.icon;
          const style: React.CSSProperties = {
            animationDelay: item.delay,
            ...("top" in item ? { top: item.top } : {}),
            ...("bottom" in item ? { bottom: item.bottom } : {}),
            ...("left" in item ? { left: item.left } : {}),
            ...("right" in item ? { right: item.right } : {}),
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

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center animate-fade-in">
        <div className="relative animate-scale-in">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full animate-pulse-slow" />
          <div className="relative">
            <Image
              src={DEFAULT_IMAGES.BANNER}
              alt="Core Point Logo"
              width={120}
              height={120}
              className="drop-shadow-lg"
              priority
            />
          </div>
        </div>

        <div className="space-y-2 animate-slide-up">
          <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Core Point Menu
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Manage your restaurant menus with ease
          </p>
        </div>

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
    // #region agent log
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'server';
    fetch('http://127.0.0.1:7242/ingest/d7e793c3-bec0-41ea-bfdb-7378ab0af892',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:115',message:'RedirectToMenus - user signed in, redirecting to /menu',data:{currentUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    router.push("/menu");
  }, [router]);
  return null;
}