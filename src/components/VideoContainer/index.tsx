import { useContext, useEffect } from "react"
import { RoomContext } from "../../context/roomContext"

import { VideoPlayer } from "./VideoPlayer"

type PeerState = Record<string, { stream: MediaStream }>

type Props = {
  id: string | undefined
}
export const VideoContainer = ({ id }: Props) => {
  const { ws, me, stream, peers } = useContext(RoomContext)

  useEffect(() => {
    if (me) ws.emit("join-room", { roomID: id, peerId: me._id })
    // setUserIcon(Object.keys(peers))
  }, [id, me, ws])

  return (
    <>
      <VideoPlayer stream={stream} />

      {Object.values(peers as PeerState).map((peer) => (
        <VideoPlayer stream={peer.stream} />
      ))}
    </>
  )
}
