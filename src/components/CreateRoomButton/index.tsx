import { useContext } from "react"
import { RoomContext } from "../../context/roomContext"

const CreateRoomButton: React.FC = () => {
  const { ws } = useContext(RoomContext)

  const createRoom = () => {
    console.log("create rom")
    ws.emit("create-room")
  }
  return <button onClick={createRoom}>Create Room</button>
}

export default CreateRoomButton
