/**
 * @fileoverview Register page — renders the RegisterForm component.
 */
import { RegisterForm } from "@/components/auth/RegisterForm"

type RegisterPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = searchParams ? await searchParams : {}
  const redirectToRaw = params.redirect
  const redirectTo = Array.isArray(redirectToRaw) ? redirectToRaw[0] : redirectToRaw

  return <RegisterForm redirectTo={redirectTo} />
}
