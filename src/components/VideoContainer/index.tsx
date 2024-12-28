import { useContext, useEffect } from "react"
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
      const { _id, _username } = me

      const userData = {
        _id,
        _username,
      }
      console.log("userdata is", userData)
      // console.log(user)
      // ws.emit("join-room", { roomID: id, peers: me._username, peerId: me._id })
      ws.emit("join-room", { roomID: id, userData: userData })

      // setUserIcon(Object.keys(peers))
    }
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
