/**
 * @fileoverview Stream Video + Chat client-side initialization.
 * Uses @stream-io/video-react-sdk and stream-chat-react.
 */

// TODO: Install packages: @stream-io/video-react-sdk stream-chat stream-chat-react

/**
 * Initialize Stream Video client (call in a React component/provider)
 *
 * Usage:
 *   const client = useStreamVideoClient(apiKey, user, token)
 */
export function createStreamVideoConfig() {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
  if (!apiKey) throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not set")
  return { apiKey }
}

/**
 * Initialize Stream Chat client
 */
export function createStreamChatConfig() {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
  if (!apiKey) throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not set")
  return { apiKey }
}
