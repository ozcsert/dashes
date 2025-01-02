import { useContext } from "react"
import { RoomContext } from "../../context/roomContext"
import { NameInput } from "@/common/Name"

const CreateRoomButton: React.FC = () => {
  const { ws } = useContext(RoomContext)
  const { userName, setUserName } = useContext(RoomContext)

  const createRoom = () => {
    console.log("create rom")
    ws.emit("create-room")
  }
  return (
    <>
      <input
        placeholder="Pick a name"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
      />

      <button onClick={createRoom}>Create Room</button>
    </>
  )
}

export default CreateRoomButton
