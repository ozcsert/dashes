import { useState } from "react"
import { useParams } from "react-router-dom"

import "./styles.scss"
import avatar from "@/public/Avatar.svg"
import { AppBar } from "@/components/AppBar"
import { VideoContainer } from "@/components/VideoContainer"
// SAYFA YENILENDIGINDE IKI ADET GELIYOR BIRI WIDGET OLARAK DIGERI DEFAULT VIDEO OLARAK

export const Room = () => {
  const { id } = useParams()
  const [userIcon, setUserIcon] = useState<string[]>(["1", "2"])

  return (
    <>
      <div className="room">
        <AppBar />
        <div>Room id = {id}</div>

        <div className="room__info-container">
          {userIcon &&
            userIcon.map((icon) => {
              return (
                <div>
                  <img src={avatar} alt="Avatar" />
                </div>
              )
            })}
        </div>
        <div className="room__video-stack-container">
          <VideoContainer id={id} />
        </div>
      </div>
    </>
  )
}
