/**
 * @fileoverview Platform settings — site config, features, integrations.
 */
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLES } from "@/config/roles"
import { getLoggedInUser } from "@/lib/appwrite/server"

function status(value: string | undefined) {
  return value && value.trim().length > 0
}

export default async function AdminSettingsPage() {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const checks = [
    { label: "Appwrite", ok: status(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) && status(process.env.APPWRITE_DATABASE_ID) },
    { label: "Razorpay", ok: status(process.env.RAZORPAY_KEY_ID) && status(process.env.RAZORPAY_WEBHOOK_SECRET) },
    { label: "PhonePe", ok: status(process.env.PHONEPE_MERCHANT_ID) && status(process.env.PHONEPE_SALT_KEY) },
    { label: "Stream", ok: status(process.env.NEXT_PUBLIC_STREAM_API_KEY) && status(process.env.STREAM_API_SECRET) },
    { label: "Webhook App Secrets", ok: status(process.env.RAZORPAY_WEBHOOK_APP_SECRET) && status(process.env.PHONEPE_WEBHOOK_APP_SECRET) },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between rounded-md border p-3">
              <p className="font-medium">{check.label}</p>
              <Badge variant={check.ok ? "secondary" : "destructive"}>
                {check.ok ? "Configured" : "Missing"}
              </Badge>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Update values in Vercel Project Settings and re-run deployment checks after changes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
