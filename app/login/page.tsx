"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { readMenuState, writeMenuState, getCurrentRestaurantId, setCurrentRestaurantId, setAuthToken } from "@/lib/menu/store"
import { createId } from "@/lib/menu/utils"
import type { RestaurantId } from "@/lib/menu/types"
import { FormMessage } from "@/components/ui/form"

// Demo credentials - in production, this would be handled by a backend
const VALID_CREDENTIALS = {
  email: "admin@restaurant.com",
  password: "admin123",
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = (values: LoginValues) => {
    // Validate credentials
    if (
      values.email !== VALID_CREDENTIALS.email ||
      values.password !== VALID_CREDENTIALS.password
    ) {
      form.setError("root", {
        message: "Invalid email or password",
      })
      return
    }

    // Set auth token
    setAuthToken("authenticated")

    // Ensure restaurant exists and store ID
    const state = readMenuState()
    let restaurantId: RestaurantId | null = getCurrentRestaurantId()

    if (!restaurantId) {
      // Check if restaurant exists, otherwise create one
      const existingRestaurant = state.restaurants[0]
      if (existingRestaurant) {
        restaurantId = existingRestaurant.id
      } else {
        // Create a new restaurant for this login
        restaurantId = createId("rest")
        const slug = `restaurant-${restaurantId.slice(-6)}`
        const newRestaurant = {
          id: restaurantId,
          name: "My Restaurant",
          slug,
          themePresetId: "coffeePastel" as const,
          themeOverrides: {},
          menuIds: [],
          currency: "USD" as const,
        }
        writeMenuState({
          ...state,
          restaurants: [newRestaurant, ...state.restaurants],
        })
      }
      setCurrentRestaurantId(restaurantId)
    }

    router.push("/menus")
  }

  return (
    <div className="min-h-svh bg-background text-foreground flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Restaurant login</CardTitle>
          <CardDescription>Sign in to manage your menus and style.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@restaurant.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
              )}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing in..." : "Continue"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 pt-4 border-t">
            <div className="text-muted-foreground text-xs">
              Demo credentials:
              <br />
              Email: {VALID_CREDENTIALS.email}
              <br />
              Password: {VALID_CREDENTIALS.password}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


