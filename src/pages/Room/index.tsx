import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { RoomContext } from "../../context/roomContext"

export const Room = () => {
  const { id } = useParams()

  const { ws, me } = useContext(RoomContext)

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
      {/* <button onClick={disconnectRoom}>Disconnect</button> */}
    </>
  )
}
