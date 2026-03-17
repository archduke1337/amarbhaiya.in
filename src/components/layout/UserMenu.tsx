/**
 * @fileoverview UserMenu — dropdown for account settings and logout.
 */
"use client"
import { useAuth } from "@/hooks/useAuth"
import { signOut } from "@/lib/appwrite/auth"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Settings, ShieldCheck } from "lucide-react"

export function UserMenu() {
  const { user, role } = useAuth()

  if (!user) return null

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none mb-1">{user.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">
              {role}
            </p>
          </div>
          <Avatar className="h-8 w-8 border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2" asChild>
          <Link href={`/app/profile/${user.$id}`}>
            <User className="h-4 w-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2" asChild>
          <Link href="/app/settings">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        {role === "admin" && (
          <DropdownMenuItem className="cursor-pointer gap-2 font-semibold text-primary" asChild>
            <Link href="/admin">
              <ShieldCheck className="h-4 w-4" /> Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
