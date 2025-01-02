import { useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { VideoPlayer } from "../../components/VideoContainer/VideoPlayer"
import { useContext, useEffect } from "react"
import { RoomContext } from "../../context/roomContext"
import "./styles.scss"
import avatar from "@/public/Avatar.svg"
import { AppBar } from "@/components/AppBar"
import { VideoContainer } from "@/components/VideoContainer"
import { WhiteBoard } from "@/components/WhiteBoard"
import { ToolBar } from "@/components/ToolBar"
// SAYFA YENILENDIGINDE IKI ADET GELIYOR BIRI WIDGET OLARAK DIGERI DEFAULT VIDEO OLARAK
type PeerState = Record<string, { stream: MediaStream }>

type Props = {
  id: string | undefined
}
export const Room = () => {
  const { id } = useParams()
  const [userIcon, setUserIcon] = useState<string[]>(["1", "2"])
  // const { ws, me, stream, peers, userName } = useContext(RoomContext)

  // useEffect(() => {
  //   if (me) {
  //     // if (!stream) return

  //     const { _id, _username } = me

  //     const userData = {
  //       _id,
  //       _username,
  //     }

  //     ws.emit("join-room", { roomID: id, userData: userData })
  //     console.log("join room emitted")
  //   }
  // }, [id, me, ws])

  return (
    <>
      <div className="room">
        <AppBar />
        <div>Room id = {id}</div>

        <div className="room__info-container">
          {userIcon &&
            userIcon.map((icon, index) => {
              return (
                <div key={index}>
                  <img src={avatar} alt="Avatar" />
                </div>
              )
            })}
        </div>
        <div className="room__video-stack-container">
          <VideoContainer id={id} />
          {/* <VideoPlayer stream={stream} />

          {Object.values(peers as PeerState).map((peer, index) => (
            <VideoPlayer key={index} stream={peer.stream} />
          ))} */}
        </div>
        <div>
          <ToolBar />
        </div>
        <div className="room__canvas-container">
          <WhiteBoard />
        </div>
      </div>
    </>
  )
}
