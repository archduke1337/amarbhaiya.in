/**
 * @fileoverview Live session room — Stream Video + Chat.
 */
type Props = { params: Promise<{ sessionId: string }> }

export default async function LiveSessionPage({ params }: Props) {
  const { sessionId } = await params

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Live Session</h1>
      <p className="text-muted-foreground mb-4">Session: {sessionId}</p>
      {/* TODO: LiveRoom, LiveChat components with Stream SDK */}
    </div>
  )
}
