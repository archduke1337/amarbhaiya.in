/**
 * @fileoverview Certificates page — list of earned certificates.
 */
import { Query } from "node-appwrite"
import { certificatesDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

export default async function CertificatesPage() {
  const user = await getLoggedInUser()
  if (!user) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const certificates = await certificatesDb.list({ queries: [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")], limit: 50 })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>
      <p className="text-muted-foreground mb-8">Download your earned certificates.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {certificates.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No certificates issued yet.</p>
        ) : (
          certificates.documents.map((cert: any) => (
            <div key={cert.$id} className="rounded-lg border p-4">
              <p className="font-medium">{cert.title || cert.courseId || "Certificate"}</p>
              <p className="text-xs text-muted-foreground">Issued {new Date(cert.$createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
