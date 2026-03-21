/**
 * @fileoverview Settings page — user account settings.
 */
"use client"

import { useAuth } from "@/hooks/useAuth"
import { PanelLayout } from "@/components/layout/PanelLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, User, Mail, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { signOut } from "@/lib/appwrite/auth"

export default function SettingsPage() {
  const { user, role } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <PanelLayout panel={role || "student"}>
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        {/* Profile */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" /> Profile
            </CardTitle>
            <CardDescription>Your public information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Name</Label>
              <Input
                id="settings-name"
                defaultValue={user?.name || ""}
                placeholder="Your name"
                disabled
                className="opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="settings-email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="opacity-60"
                />
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Profile updates are managed through your Appwrite account settings.
            </p>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />} Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="gap-2"
              >
                <Sun className="w-4 h-4" /> Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="gap-2"
              >
                <Moon className="w-4 h-4" /> Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
              >
                System
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5" /> Security
            </CardTitle>
            <CardDescription>Session and authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background">
              <div>
                <p className="text-sm font-semibold">Current Session</p>
                <p className="text-xs text-muted-foreground">
                  Logged in as {user?.email}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
