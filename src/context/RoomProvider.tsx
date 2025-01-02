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
    console.warn("remoed from state", peerId._id)
    removePeer(peerId._id)
  }

  const peerData = () => {
    if (!me) {
      const meID = uuidV4()
      console.log(meID)
      const peer: PopulatedPeer = new Peer(meID)
      peer._username = userName
      setMe(peer)
      console.warn("meee", me)
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
        console.log("User joined context")
        // If this call needs the delay as well

        try {
          const call = me.call(peerId, stream)
          console.log("Call object created:", call)

          if (call) {
            call.on("stream", (peerStream) => {
              try {
                console.log("user call atildi context")
                console.log("Received peer stream:", peerStream)

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
        console.log("Stream answered with:", stream)

        call.on("stream", (peerStream) => {
          try {
            console.log("Call answered successfully, emitting ready")
            ws.emit("ready")
            console.log("Received peer stream:", peerStream)
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

  return (
    <RoomContext.Provider
      value={{ ws, me, stream, peers, userName, setUserName, getUsers }}
    >
      {children}
    </RoomContext.Provider>
  )
}

// import { createContext, ReactNode, useEffect, useState } from "react"
// import socketIOClient from "socket.io-client"
// import { useNavigate } from "react-router-dom"
// import Peer from "peerjs"
// import { v4 as uuidV4 } from "uuid"
// // import { peersReducer } from "./peerReducer"
// import { usePeerStore } from "../Store/peerStore"
// // import { addPeerAction, removePeerAction } from "./peerActions"
// const WS = "http://localhost:8080"

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const RoomContext = createContext<null | any>(null)

// const ws = socketIOClient(WS)

// interface RoomProviderProps {
//   children: ReactNode
// }

// export const RoomProvider: React.FunctionComponent<RoomProviderProps> = ({
//   children,
// }) => {
//   const navigate = useNavigate()
//   const [me, setMe] = useState<Peer>()
//   const [stream, setStream] = useState<MediaStream>()
//   const [userName, setUserName] = useState<string>("")
//   const { peers, addPeer, removePeer } = usePeerStore()

//   const enterRoom = ({ roomID }: { roomID: string }) => {
//     navigate(`/room/${roomID}`)
//   }

//   const getUsers = ({ participants }: { participants: string[] }) => {
//     console.log(participants)
//   }
//   const removePeerHandler = (peerId: string) => {
//     removePeer(peerId)
//   }

//   const peerData = () => {
//     const meID = uuidV4()
//     const peer = new Peer(meID)
//     peer._username = userName
//     setMe(peer)
//   }

//   useEffect(() => {
//     peerData()
//   }, [userName])

//   useEffect(() => {
//     peerData()
//     try {
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           setStream(stream)
//         })
//     } catch (error) {
//       console.error(error)
//     }

//     ws.on("room-created", enterRoom)
//     ws.on("get-users", getUsers)
//     ws.on("user-disconnected", removePeerHandler)
//   }, [])

//   useEffect(() => {
//     if (!me) return
//     if (!stream) return

//     ws.on("user-joined", (peerId) => {
//       console.log("User joined context")

//       try {
//         const call = me.call(peerId, stream)
//         console.log("Call object created:", call)

//         if (call) {
//           call.on("stream", (peerStream) => {
//             try {
//               console.log("user call atildi context")
//               console.log("Received peer stream:", peerStream)
//               addPeer(peerId, peerStream)
//             } catch (error) {
//               console.error("Error handling stream:", error)
//             }
//           })
//         } else {
//           console.error("Call object is undefined or failed to initialize.")
//         }
//       } catch (error) {
//         console.error("Error creating call:", error)
//       }
//     })

//     me.on("call", (call) => {
//       try {
//         // Answer the call with the stream
//         call.answer(stream)
//         console.log("Stream answered with:", stream)

//         // Attach stream event handler
//         call.on("stream", (peerStream) => {
//           try {
//             console.log("Received peer stream:", peerStream)
//             addPeer(call.peer, peerStream)

//             // dispatch(addPeerAction(call.peer, peerStream))
//           } catch (error) {
//             console.error("Error handling incoming stream:", error)
//           }
//         })
//       } catch (error) {
//         console.error("Error handling incoming call:", error)
//       }
//     })
//   }, [me, stream])

//   return (
//     <RoomContext.Provider
//       value={{ ws, me, stream, peers, userName, setUserName, getUsers }}
//     >
//       {children}
//     </RoomContext.Provider>
//   )
// }
