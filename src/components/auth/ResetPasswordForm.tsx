/**
 * @fileoverview ResetPasswordForm — completes Appwrite password recovery.
 */
"use client"

import { useState } from "react"
import Link from "next/link"
import { completePasswordRecovery } from "@/lib/appwrite/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/config/routes"

type ResetPasswordFormProps = {
  userId?: string
  secret?: string
}

export function ResetPasswordForm({ userId, secret }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const linkInvalid = !userId || !secret

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (linkInvalid) return

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("userId", userId)
    formData.set("secret", secret)

    const result = await completePasswordRecovery(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>Set a new password for your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {linkInvalid && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              Invalid or expired reset link.
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              disabled={loading || linkInvalid}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              disabled={loading || linkInvalid}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={loading || linkInvalid}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Back to{" "}
            <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
