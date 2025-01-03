// src/context/RoomProvider.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import socketIOClient from "socket.io-client"
import Peer from "peerjs"
import { v4 as uuidV4 } from "uuid"
import { RoomContext } from "./roomContext"
import { usePeerStore } from "../Store/peerStore"

const WS = "http://localhost:8080"

interface PopulatedPeer extends Peer {
  _username?: string
}

const ws = socketIOClient(WS)

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [me, setMe] = useState<Peer>()
  const [stream, setStream] = useState<MediaStream>()
  const [userName, setUserName] = useState<string>("")
  const { peers, addPeer, removePeer } = usePeerStore()

  const enterRoom = ({ roomID }: { roomID: string }) => {
    navigate(`/room/${roomID}`)
  }

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log(participants)
  }

  const removePeerHandler = (peerId: Record<string, string>) => {
    removePeer(peerId._id)
  }

  const peerData = () => {
    if (!me) {
      const meID = uuidV4()
      console.log(meID)
      const peer: PopulatedPeer = new Peer(meID)
      peer._username = userName
      setMe(peer)
    }
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

    ws.on("user-joined", (peerId) => {
      setTimeout(() => {
        // If this call needs the delay as well

        try {
          const call = me.call(peerId, stream)

          if (call) {
            call.on("stream", (peerStream) => {
              try {
                addPeer(peerId, peerStream)
              } catch (error) {
                console.error("Error handling stream:", error)
              }
            })
          } else {
            console.error("Call object is undefined or failed to initialize.")
          }
        } catch (error) {
          console.error("Error creating call:", error)
        }
      }, 1300)
    })

    me.on("call", (call) => {
      try {
        call.answer(stream)

        call.on("stream", (peerStream) => {
          try {
            ws.emit("ready")
            addPeer(call.peer, peerStream)
          } catch (error) {
            console.error("Error handling incoming stream:", error)
          }
        })
      } catch (error) {
        console.error("Error handling incoming call:", error)
      }
    })
  }, [me, stream])

  console.warn("provider is rendered")

  return (
    <RoomContext.Provider
      value={{ ws, me, stream, peers, userName, setUserName, getUsers }}
    >
      {children}
    </RoomContext.Provider>
  )
}
