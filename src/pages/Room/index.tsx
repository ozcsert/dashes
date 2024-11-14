import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { RoomContext } from "../../context/roomContext"
import { VideoPlayer } from "../../components/VideoPlayer"

type PeerState = Record<string, { stream: MediaStream }>

export const Room = () => {
  const { id } = useParams()

  const { ws, me, stream, peers } = useContext(RoomContext)

  // const disconnectRoom = () => {
  //   console.log(`${me._id} + is disconnect from room + ${id}`)
  //   ws.emit("disconnect-room")
  // }

  useEffect(() => {
    if (me) ws.emit("join-room", { roomID: id, peerId: me._id })
    // ws.emit("disconnect-room")
  }, [id, me, ws])

  return (
    <>
      Room id = {id}
      <div>
        <VideoPlayer stream={stream} />

        {Object.values(peers as PeerState).map((peer, index) => (
          <VideoPlayer key={index} stream={peer.stream} />
        ))}
      </div>
    </>
  )
}
