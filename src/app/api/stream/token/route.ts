/**
 * @fileoverview Stream token generation endpoint.
 * Returns a signed JWT for Stream Video/Chat client authentication.
 */

import { NextRequest, NextResponse } from "next/server"
import { generateStreamToken } from "@/lib/stream/server"
import { getLoggedInUser } from "@/lib/appwrite/server"

export async function GET(req: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = await generateStreamToken(user.$id)

    return NextResponse.json({ token, userId: user.$id })
  } catch (error) {
    console.error("[Stream Token]", error)
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    )
  }
}
