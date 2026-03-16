/**
 * @fileoverview Login page — renders the LoginForm component.
 */
import { LoginForm } from "@/components/auth/LoginForm"

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {}
  const redirectToRaw = params.redirect
  const redirectTo = Array.isArray(redirectToRaw) ? redirectToRaw[0] : redirectToRaw

  return <LoginForm redirectTo={redirectTo} />
}
