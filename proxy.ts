import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/menu(.*)",
  "/settings(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // #region agent log
  const url = req.url;
  const pathname = new URL(url).pathname;
  const searchParams = new URL(url).searchParams.toString();
  const isOAuthCallback = pathname.includes('oauth') || pathname.includes('callback') || searchParams.includes('code=') || searchParams.includes('state=');
  const authResult = await auth();
  const { userId, sessionId } = authResult;
  fetch('http://127.0.0.1:7242/ingest/d7e793c3-bec0-41ea-bfdb-7378ab0af892',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'proxy.ts:14',message:'Middleware request',data:{url,pathname,searchParams,isOAuthCallback,userId:userId||null,sessionId:sessionId||null,isProtected:isProtectedRoute(req),isAdmin:isAdminRoute(req)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  // Protect regular routes
  if (isProtectedRoute(req)) {
    // #region agent log
    const beforeProtect = {userId:authResult.userId||null,sessionId:authResult.sessionId||null};
    fetch('http://127.0.0.1:7242/ingest/d7e793c3-bec0-41ea-bfdb-7378ab0af892',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'proxy.ts:28',message:'Before auth.protect()',data:{pathname,...beforeProtect},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    await auth.protect();
    // #region agent log
    const afterAuth = await auth();
    fetch('http://127.0.0.1:7242/ingest/d7e793c3-bec0-41ea-bfdb-7378ab0af892',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'proxy.ts:34',message:'After auth.protect()',data:{pathname,userId:afterAuth.userId||null,sessionId:afterAuth.sessionId||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
  }

  // Protect admin route
  if (isAdminRoute(req)) {
    await auth.protect();
    
    const { userId } = await auth();
    
    if (!userId) {
      console.log('[Admin Route] No userId found');
      return NextResponse.redirect(new URL('/menu', req.url));
    }

    // Check if user is admin
    const adminUserIds = process.env.ADMIN_USER_IDS;
    console.log('[Admin Route] Checking admin access:', {
      userId,
      adminUserIds: adminUserIds ? 'SET' : 'NOT SET',
      adminIds: adminUserIds ? adminUserIds.split(',').map((id) => id.trim()) : [],
    });
    
    if (!adminUserIds) {
      // If no admin IDs configured, deny access
      console.log('[Admin Route] ADMIN_USER_IDS not configured');
      return NextResponse.redirect(new URL('/menu', req.url));
    }

    const adminIds = adminUserIds.split(',').map((id) => id.trim());
    if (!adminIds.includes(userId)) {
      // User is not an admin, redirect to menu
      console.log('[Admin Route] User not in admin list:', userId);
      return NextResponse.redirect(new URL('/menu', req.url));
    }
    
    console.log('[Admin Route] Admin access granted');
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};