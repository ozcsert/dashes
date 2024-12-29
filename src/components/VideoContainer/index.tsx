import { useContext, useEffect, useState } from "react"
import { RoomContext } from "../../context/roomContext"
import { VideoPlayer } from "./VideoPlayer"

type PeerState = Record<string, { stream: MediaStream }>

type Props = {
  id: string | undefined
}

export const VideoContainer = ({ id }: Props) => {
  const { ws, me, stream, peers, userName, getUsers } = useContext(RoomContext)
  const [initialized, setInitialized] = useState(false)
  const [reRender, setReRender] = useState(false)
  const [newUsername, setNewUsername] = useState(me?._username || "") // State to store the new username

  ws.on("get-users", getUsers)
  console.log("rerendered")

  useEffect(() => {
    // Force an initial render once peers object is populated
    if (Object.keys(peers).length > 0 && !initialized) {
      setInitialized(true)
    }
  }, [peers, initialized])

  useEffect(() => {
    if (me) {
      const { _id, _username } = me

      const userData = {
        _id,
        _username,
      }

      ws.emit("join-room", { roomID: id, userData: userData })
      console.log("join room emitted")
    }
  }, [id, me, ws])

  // Handler for button click to trigger re-render
  const handleClick = () => {
    setReRender((prev) => !prev) // Toggle the reRender state
  }

  // Handle username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value)
    if (me) {
      // Update _username in the 'me' object
      me._username = e.target.value
      ws.emit("update-username", { _id: me._id, _username: e.target.value }) // Emit updated username to server if needed
    }
  }

  return (
    <>
      <VideoPlayer stream={stream} />
      <button onClick={handleClick}>CLICK RENDER</button>
      {Object.values(peers as PeerState).map((peer, index) => (
        <VideoPlayer key={index} stream={peer.stream} />
      ))}

      {/* Input to change username */}
      <input
        type="text"
        value={newUsername}
        onChange={handleUsernameChange}
        placeholder="Enter new username"
      />
    </>
  )
}
