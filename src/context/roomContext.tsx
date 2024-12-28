import { createContext, ReactNode, useEffect, useState } from "react"
import socketIOClient from "socket.io-client"
import { useNavigate } from "react-router-dom"
import Peer from "peerjs"
import { v4 as uuidV4 } from "uuid"
// import { peersReducer } from "./peerReducer"
import { usePeerStore } from "../Store/peerStore"
// import { addPeerAction, removePeerAction } from "./peerActions"
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
  const [stream, setStream] = useState<MediaStream>()
  const [userName, setUserName] = useState<string>("")
  // const [peers, dispatch] = useReducer(peersReducer, {})
  const { peers, addPeer, removePeer } = usePeerStore()
  console.log("me is", userName)

  console.log("me is", me)
  const enterRoom = ({ roomID }: { roomID: string }) => {
    navigate(`/room/${roomID}`)
    console.log("enter room")
  }

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log(participants)
  }
  const removePeerHandler = (peerId: string) => {
    removePeer(peerId)
    // dispatch(removePeerAction(peerId))
  }

  const peerData = () => {
    const meID = uuidV4()
    const peer = new Peer(meID)
    peer._username = userName
    setMe(peer)
  }

  useEffect(() => {
    peerData()
  }, [userName])

  useEffect(() => {
    peerData()
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream)
        })
    } catch (error) {
      console.error(error)
    }

    ws.on("room-created", enterRoom)
    ws.on("get-users", getUsers)
    ws.on("user-disconnected", removePeerHandler)
  }, [])

  useEffect(() => {
    if (!me) return
    if (!stream) return

    ws.on("user-joined", ({ peerId }) => {
      const call = me.call(peerId, stream)
      call.on("stream", (peerStream) => {
        addPeer(peerId, peerStream)
        // dispatch(addPeerAction(peerId, peerStream))
        // state should reflect the peer removal
      })
    })

    me.on("call", (call) => {
      call.answer(stream)
      call.on("stream", (peerStream) => {
        addPeer(call.peer, peerStream)

        // dispatch(addPeerAction(call.peer, peerStream))
      })
    })
  }, [me, stream])

  console.log({ peers })

  return (
    <RoomContext.Provider
      value={{ ws, me, stream, peers, userName, setUserName }}
    >
      {children}
    </RoomContext.Provider>
  )
}
