import { useEffect, useRef, useState, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as Slider from "@radix-ui/react-slider"
import { motion, AnimatePresence } from "framer-motion"

interface VideoPlayerProps {
  url: string
  title?: string
  onEnded?: () => void
  onProgress?: (currentTime: number, duration: number) => void
}

export function VideoPlayer({ url, title, onEnded, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null)

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause()
      else videoRef.current.play()
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted
      videoRef.current.muted = newMuted
      setIsMuted(newMuted)
      if (newMuted) setVolume(0)
      else setVolume(videoRef.current.volume || 1)
    }
  }, [isMuted])

  const handleVolumeChange = (values: number[]) => {
    const newVol = values[0]
    setVolume(newVol)
    if (videoRef.current) {
      videoRef.current.volume = newVol
      videoRef.current.muted = newVol === 0
      setIsMuted(newVol === 0)
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setDuration(video.duration)
      onProgress?.(video.currentTime, video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return
      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay() }
      if (e.key === "m") toggleMute()
      if (e.key === "ArrowRight") skip(10)
      if (e.key === "ArrowLeft") skip(-10)
      if (e.key === "f") toggleFullScreen()
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [togglePlay, toggleMute, onEnded, onProgress])

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) document.exitFullscreen()
      else containerRef.current.requestFullscreen()
    }
  }

  const progress = (currentTime / duration) * 100 || 0

  return (
    <div 
      ref={containerRef}
      className="relative group rounded-2xl overflow-hidden bg-black aspect-video shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Cinematic Overlays */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] transition-transform"
            >
              <Play className="w-10 h-10 ml-1 fill-current" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Container */}
      <div className={cn(
        "absolute inset-0 flex flex-col justify-end transition-opacity duration-500",
        showControls ? "opacity-100" : "opacity-0 cursor-none"
      )}>
        {/* Top Gradient */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Top Content */}
        {title && (
          <div className="absolute top-8 left-8 right-8 z-10">
            <h3 className="text-white font-bold text-xl tracking-tight drop-shadow-2xl opacity-90">{title}</h3>
          </div>
        )}

        {/* Main Controls Area */}
        <div className="relative z-10 p-6 lg:p-8 space-y-4">
          
          {/* Progress Bar */}
          <div className="relative group/progress h-1.5 w-full bg-white/10 rounded-full cursor-pointer overflow-hidden transition-all hover:h-2" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            if (videoRef.current) videoRef.current.currentTime = (x / rect.width) * duration
          }}>
            <motion.div 
              className="absolute left-0 top-0 h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button onClick={() => skip(-10)} className="p-2 text-white/70 hover:text-white transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={togglePlay} className="p-2 text-white hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </button>
                <button onClick={() => skip(10)} className="p-2 text-white/70 hover:text-white transition-colors">
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3 group/volume">
                <button onClick={toggleMute} className="p-2 text-white/70 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="w-0 group-hover/volume:w-24 transition-all duration-300 overflow-hidden">
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-24 h-5"
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                  >
                    <Slider.Track className="bg-white/20 relative grow rounded-full h-[3px]">
                      <Slider.Range className="absolute bg-white rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-3 h-3 bg-white rounded-full shadow-lg focus:outline-none" />
                  </Slider.Root>
                </div>
              </div>

              <div className="text-sm font-bold text-white/80 tabular-nums">
                {formatTime(currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/80 hover:bg-white/10 transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                    {playbackRate}x
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900/90 text-white border-white/5 backdrop-blur-xl min-w-[120px]">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <DropdownMenuItem 
                      key={rate} 
                      onClick={() => {
                        if (videoRef.current) videoRef.current.playbackRate = rate
                        setPlaybackRate(rate)
                      }}
                      className={cn("text-xs font-bold py-2 px-4 cursor-pointer focus:bg-white/10", playbackRate === rate && "text-primary")}
                    >
                      {rate === 1 ? "Normal" : `${rate}x`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button onClick={toggleFullScreen} className="p-2 text-white/70 hover:text-white transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
