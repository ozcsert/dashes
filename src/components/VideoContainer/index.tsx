import { useContext, useEffect, useState } from "react"
import { RoomContext } from "../../context/roomContext"
import { VideoPlayer } from "./VideoPlayer"

type PeerState = Record<string, { stream: MediaStream }>

type Props = {
  id: string | undefined
}

export const VideoContainer = ({ id }: Props) => {
  const { ws, me, stream, peers, userName } = useContext(RoomContext)

  useEffect(() => {
    if (me) {
      // if (!stream) return

      const { _id, _username } = me

      const userData = {
        _id,
        _username,
      }

      ws.emit("join-room", { roomID: id, userData: userData })
      console.log("join room emitted")
    }
  }, [id, me, ws])

  return (
    <>
      <VideoPlayer stream={stream} />
      {Object.values(peers as PeerState).map((peer, index) => (
        <VideoPlayer key={index} stream={peer.stream} />
      ))}
    </>
  )
}
