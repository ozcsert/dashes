import { useEffect, useRef } from "react"
import "./styles.scss"

export const VideoPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream
  }, [stream])

  return <video ref={videoRef} autoPlay muted={true} />
}
