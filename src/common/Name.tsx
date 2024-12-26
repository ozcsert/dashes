import { RoomContext } from "@/context/roomContext"
import { useContext } from "react"

export const NameInput: React.FC = ({}) => {
  const { userName, setUserName } = useContext(RoomContext)

  console.log(userName)
  return (
    <input
      placeholder="Pick a name"
      onChange={(e) => setUserName(e.target.value)}
      value={userName}
    />
  )
}
