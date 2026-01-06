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
  // Protect regular routes
  if (isProtectedRoute(req)) {
    await auth.protect();
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