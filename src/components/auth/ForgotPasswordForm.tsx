/**
 * @fileoverview ForgotPasswordForm — sends Appwrite recovery email.
 */
"use client"

import { useState } from "react"
import Link from "next/link"
import { requestPasswordRecovery } from "@/lib/appwrite/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/config/routes"

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await requestPasswordRecovery(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess("If this email exists, a password reset link has been sent.")
    setLoading(false)
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a password reset link</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              {success}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Remembered your password?{" "}
            <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
