/**
 * @fileoverview LiveSessionClient — Initializes Stream Video and mounts the Room layout.
 */
"use client"

import { useEffect, useState } from "react"
import { StreamVideoClient, StreamVideo, Call, StreamTheme, SpeakerLayout, CallControls, StreamCall } from "@stream-io/video-react-sdk"
import { StreamChat, Channel as StreamChannel } from "stream-chat"
import { Chat, Channel, Window, MessageList, MessageInput, MessageInputFlat } from "stream-chat-react"
import "@stream-io/video-react-sdk/dist/css/styles.css"
import "stream-chat-react/dist/css/v2/index.css"
import { useAuth } from "@/hooks/useAuth"

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string

export function LiveSessionClient({ sessionId }: { sessionId: string }) {
  const { user } = useAuth()
  const [videoClient, setVideoClient] = useState<StreamVideoClient>()
  const [chatClient, setChatClient] = useState<StreamChat>()
  const [call, setCall] = useState<Call>()
  const [channel, setChannel] = useState<StreamChannel>()
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let _vClient: StreamVideoClient | undefined
    let _cClient: StreamChat | undefined
    let _call: Call | undefined

    const tokenProvider = async () => {
      const res = await fetch("/api/stream/token")
      const { token } = await res.json()
      return token as string
    }

    const initStream = async () => {
      if (!user) return
      try {
        const userData = {
          id: user.$id,
          name: user.name,
          image: `https://ui-avatars.com/api/?name=${user.name}`,
        }

        // 1. Initialize Video with tokenProvider for auto-refresh
        _vClient = new StreamVideoClient({ 
          apiKey, 
          user: userData, 
          tokenProvider 
        })
        const callInstance = _vClient.call("default", sessionId)
        await callInstance.join({ create: true })
        _call = callInstance
        
        setVideoClient(_vClient)
        setCall(callInstance)

        // 2. Initialize Chat with token provider
        _cClient = StreamChat.getInstance(apiKey)
        await _cClient.connectUser(userData, tokenProvider)
        const chatChannel = _cClient.channel("messaging", sessionId)
        await chatChannel.watch()
        
        setChatClient(_cClient)
        setChannel(chatChannel)

      } catch (err: any) {
        console.error("Failed to initialize Stream", err)
        setError("Could not connect to the live session.")
      }
    }

    initStream()

    return () => {
      _call?.leave().catch(console.error)
      _vClient?.disconnectUser().catch(console.error)
      _cClient?.disconnectUser().catch(console.error)
    }
  }, [user, sessionId])

  if (error) {
    return <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl font-bold">{error}</div>
  }

  if (!videoClient || !call || !chatClient || !channel) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Holo-Stream...</p>
      </div>
    )
  }

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <StreamTheme>
          <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] gap-6">
            {/* Main Video Area */}
            <div className="flex-1 rounded-[2rem] overflow-hidden border border-white/5 bg-black relative shadow-2xl group">
              <StreamCall call={call}>
                <SpeakerLayout />
                
                {/* Controls Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <div className="flex justify-between items-start pointer-events-auto">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                         <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live
                      </div>
                   </div>
                   
                   <div className="flex justify-center pointer-events-auto">
                      <div className="bg-background/80 backdrop-blur-2xl rounded-full p-2 border border-white/10 shadow-2xl">
                         <CallControls onLeave={() => window.history.back()} />
                      </div>
                   </div>
                </div>
              </StreamCall>
            </div>
            
            {/* Chat Sidebar */}
            <div className="w-full lg:w-[400px] shrink-0 flex flex-col rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-border/20 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest">Live Discussion</h3>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Connected</span>
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <Channel channel={channel}>
                  <Window>
                    <MessageList />
                    <div className="p-4 bg-muted/20 border-t border-border/10">
                       <MessageInput Input={MessageInputFlat} />
                    </div>
                  </Window>
                </Channel>
              </div>
            </div>
          </div>
        </StreamTheme>
      </Chat>
    </StreamVideo>
  )
}

