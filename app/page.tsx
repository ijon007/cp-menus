import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-svh bg-background text-foreground flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">cp-menus</CardTitle>
          <CardDescription>
            Restaurants create menus in admin, customers view them on a public route.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="w-full">
            <Link href="/login">Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
