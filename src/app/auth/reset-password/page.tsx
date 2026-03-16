/**
 * @fileoverview Reset password page — set a new password from email link.
 */
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

type ResetPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = searchParams ? await searchParams : {}
  const userIdRaw = params.userId
  const secretRaw = params.secret

  const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw
  const secret = Array.isArray(secretRaw) ? secretRaw[0] : secretRaw

  return <ResetPasswordForm userId={userId} secret={secret} />
}
