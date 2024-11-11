import { createContext, ReactNode, useEffect, useState } from "react"
import socketIOClient from "socket.io-client"
import { useNavigate } from "react-router-dom"
import Peer from "peerjs"
import { v4 as uuidV4 } from "uuid"

const WS = "http://localhost:8080"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RoomContext = createContext<null | any>(null)

const ws = socketIOClient(WS)

interface RoomProviderProps {
  children: ReactNode
}

export const RoomProvider: React.FunctionComponent<RoomProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate()
  const [me, setMe] = useState<Peer>()

  const enterRoom = ({ roomID }: { roomID: string }) => {
    navigate(`/room/${roomID}`)
  }

  useEffect(() => {
    const meID = uuidV4()
    const peer = new Peer(meID)
    // console.log(peer)
    setMe(peer)
    ws.on("room-created", enterRoom)
  }, [])

  return (
    <RoomContext.Provider value={{ ws, me }}>{children}</RoomContext.Provider>
  )
}
