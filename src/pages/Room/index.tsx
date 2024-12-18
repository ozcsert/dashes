import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { RoomContext } from "../../context/roomContext"
import { VideoPlayer } from "../../components/VideoPlayer"
import "gridstack/dist/gridstack.min.css"
import { GridStack } from "gridstack"
import Widget from "@/components/WIdget"

// SAYFA YENILENDIGINDE IKI ADET GELIYOR BIRI WIDGET OLARAK DIGERI DEFAULT VIDEO OLARAK

let grid: GridStack

type PeerState = Record<string, { stream: MediaStream }>

export const Room = () => {
  const { id } = useParams()

  const { ws, me, stream, peers } = useContext(RoomContext)
  const [items, setItems] = useState([0, 1, 2, 3])
  const [peerItems, setPeerItems] = useState<string[]>([])

  const itemsRef = useRef(new Map())
  const createdPeersRef = useRef<Set<string>>(new Set())

  const getMap = () => {
    return itemsRef.current
  }

  useEffect(() => {
    if (me) ws.emit("join-room", { roomID: id, peerId: me._id })
    grid = GridStack.init({ float: true })
  }, [id, me, ws])

  useEffect(() => {
    // Get new peer stream IDs that are not already created
    const peerStreams = Object.values(peers as PeerState).map(
      (peer) => peer.stream.id
    )
    const newPeerStreams = peerStreams.filter(
      (streamId) => !createdPeersRef.current.has(streamId)
    )

    // Add new peer streams
    newPeerStreams.forEach((count) => {
      setPeerItems((prev) => [...prev, count])

      setTimeout(() => {
        grid.makeWidget(getMap().get(count))
        // Mark this peer as created
        createdPeersRef.current.add(count)
      }, 5)
    })
  }, [peers])

  // const addWidget = () => {
  //   // Manual widget addition (if needed separately)
  //   if (peerItems.length > 0) {
  //     const count = peerItems[peerItems.length - 1]

  //     setPeerItems((prev) => [...prev, count])

  //     setTimeout(() => {
  //       grid.makeWidget(getMap().get(count))
  //       createdPeersRef.current.add(count)
  //     }, 5)
  //   }
  // }

  const test = (e) => {
    console.log(itemsRef.current)
  }

  return (
    <>
      <div>Room id = {id}</div>
      {/* <button onClick={addWidget}>Add Peer Widget</button> */}

      <div className="grid-stack" style={{ width: "100%" }}>
        {items.map((cat) => (
          <div
            className="grid-stack-item"
            gs-w="2"
            gs-h="1"
            onClick={(e) => test(e)}
            key={cat}
            ref={(node) => {
              const map = getMap()
              if (node) {
                map.set(cat, node)
              }
            }}
          >
            <div className="grid-stack-item-content">
              <Widget />
            </div>
          </div>
        ))}
        <div
          className="grid-stack-item"
          gs-w="2"
          gs-h="1"
          key={3321}
          ref={(node) => {
            const map = getMap()
            if (node) {
              map.set(3321, node)
            }
          }}
        >
          <div className="grid-stack-item-content">
            <VideoPlayer stream={stream} />
          </div>
        </div>
        {peerItems.map((peerStreamId) => {
          // Find the peer with the matching stream ID
          const peer = Object.values(peers as PeerState).find(
            (p) => p.stream.id === peerStreamId
          )
          return peer ? (
            <div
              className="grid-stack-item"
              onClick={(e) => test(e)}
              gs-w="4"
              gs-h="1"
              key={peerStreamId}
              ref={(node) => {
                const map = getMap()
                if (node) {
                  map.set(peerStreamId, node)
                }
              }}
            >
              <div className="grid-stack-item-content">
                <VideoPlayer stream={peer.stream} />
              </div>
            </div>
          ) : null
        })}
      </div>
    </>
  )
}
