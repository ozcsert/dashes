import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { RoomContext } from "../../context/roomContext"

export const Room = () => {
  const { id } = useParams()

  const { ws, me } = useContext(RoomContext)

  useEffect(() => {
    if (me) ws.emit("join-room", { roomID: id, peerId: me._id })
  }, [id, me, ws])

  return <>Room id = {id}</>
}
