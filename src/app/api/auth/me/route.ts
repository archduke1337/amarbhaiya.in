import { NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await getLoggedInUser()

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user })
}
