/**
 * @fileoverview Live session room — Stream Video + Chat.
 */
import { LiveSessionClient } from "@/components/live/LiveSessionClient"

type Props = { params: Promise<{ sessionId: string }> }

export default async function LiveSessionPage({ params }: Props) {
  const { sessionId } = await params

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Live Session</h1>
          <p className="text-muted-foreground text-sm font-mono bg-muted/50 px-3 py-1 rounded inline-flex">
            Room Code: {sessionId}
          </p>
        </div>
      </div>
      <LiveSessionClient sessionId={sessionId} />
    </div>
  )
}

