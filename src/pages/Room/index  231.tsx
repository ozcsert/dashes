import { useContext, useEffect, useRef, useState, useLayoutEffect } from "react"

import { useParams } from "react-router-dom"
import { RoomContext } from "../../context/RoomProvider"
import { VideoPlayer } from "../../components/VideoContainer/VideoPlayer"

import { GridStack, GridStackWidget, GridStackOptions } from "gridstack"
import Widget from "@/components/WIdget"
import "gridstack/dist/gridstack.min.css"
import "./styles.scss"

const ControlledStack = ({ items, addItem, changeItems }) => {
  const refs = useRef({})
  const gridRef = useRef()
  const gridContainerRef = useRef(null)
  refs.current = {}

  if (Object.keys(refs.current).length !== items.length) {
    items.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef()
    })
  }

  useLayoutEffect(() => {
    if (!gridRef.current) {
      // no need to init twice (would will return same grid) or register dup events
      const grid = (gridRef.current = GridStack.init(
        {
          float: false,
          acceptWidgets: true,
          column: 6,
          minRow: 1,
        },
        gridContainerRef.current
      )
        .on("added", (ev, gsItems) => {
          if (grid._ignoreCB) return
          // remove the new element as React will re-create it again (dup) once we add to the list or we get 2 of them with same ids but different DOM el!
          // TODO: this is really not ideal - we shouldn't mix React templating with GS making it own edits as those get out of sync! see comment below ~96.
          gsItems.forEach((n) => {
            grid.removeWidget(n.el, true, false) // true=remove DOM, false=don't call use back!
            // can't pass n directly even though similar structs as it has n.el.gridstackNode which gives JSON error for circular write.
            addItem({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h })
          })
        })
        .on("removed change", (ev, gsItems) => {
          // synch our version from GS....
          // Note: we could just update those few items passed but save() is fast and it's easier to just set an entire new list
          // and since we have the same ids, React will not re-create anything...
          const newItems = grid.save(false) // saveContent=false
          changeItems(newItems)
        }))
      // addEvents(grid, i);
    } else {
      //
      // update existing GS layout, which is optimized to updates only diffs and add new/delete items as well
      //
      const grid = gridRef.current
      const layout = items.map(
        (a) =>
          // use exiting nodes (which will skip diffs being the same) else new elements Widget but passing the React dom .el so we know what to makeWidget() on!
          refs.current[a.id].current.gridstackNode || {
            ...a,
            el: refs.current[a.id].current,
          }
      )
      grid._ignoreCB = true // hack: ignore added/removed since we're the one doing the update
      grid.load(layout)
      delete grid._ignoreCB
    }
  }, [items])

  return (
    // ********************
    // NOTE: constructing DOM grid items in template when gridstack is also allowed creating (dragging between grids, or adding/removing from say a toolbar)
    // is NOT A GOOD IDEA as you end up fighting between gridstack users' edits and your template items structure which are not in sync.
    // At best, you end up re-creating widgets DOM (from React template) and all their content & state after a widget was inserted/re-parented by the user.
    // a MUCH better way is to let GS create React components using it's API/user interactions, with only initial load() of a stored layout.
    // See the Angular component wrapper that does that: https://github.com/gridstack/gridstack.js/tree/master/angular/ (lib author uses Angular)
    // ...TBD creating React equivalent...
    //
    // Also templating forces you to spell out the 15+ GridStackWidget attributes (only x,y,w,h done below), instead of passing an option structure that
    // supports everything, is not robust as things get added and pollutes the DOM attr for default/missing entries, vs the optimized code in GS.
    // ********************
    <div style={{ width: "100%", marginRight: "10px" }}>
      <div className="grid-stack" ref={gridContainerRef}>
        {items.map((item, i) => {
          return (
            <div
              ref={refs.current[item.id]}
              key={item.id}
              className="grid-stack-item"
              gs-id={item.id}
              gs-w={item.w}
              gs-h={item.h}
              gs-x={item.x}
              gs-y={item.y}
            >
              <div className="grid-stack-item-content">
                <Item {...item} />
              </div>
            </div>
          )
        })}
      </div>
      <code>
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </code>
    </div>
  )
}

interface GridItem {
  _id: string
  x: number
  y: number
  w: number
  h: number
}
// import "gridstack/dist/gridstack-extra.min.css"

//LOCALSTORAGE A KAYDEDILEN ID ILE ITEMS IN ID SI ESLESMIYOR

//  let grids: GridStack[]
let grid: GridStack
// let gridPlayground: GridStack
type PeerState = Record<string, { stream: MediaStream }>

export const Room = () => {
  const { id } = useParams()

  const { ws, me, stream, peers } = useContext(RoomContext)
  // const defaultItems: GridItem[] = [
  //   { _id: "0", x: 0, y: 0, w: 6, h: 1 },
  //   { _id: "1", x: 6, y: 0, w: 6, h: 1 },
  // ]

  // const [items, setItems] = useState<GridItem[]>(() => {
  //   try {
  //     const item = window.localStorage.getItem("gridItems")
  //     return item ? JSON.parse(item) : defaultItems
  //   } catch (error) {
  //     console.warn("Error reading localStorage:", error)
  //     return defaultItems
  //   }
  // })

  // const [peerItems, setPeerItems] = useState<Set<string>>(new Set())

  // const itemsRef = useRef(new Map())
  // const createdPeersRef = useRef<Set<string>>(new Set())

  const [items1, setItems1] = useState([
    { id: "item-1-1", x: 0, y: 0, w: 2, h: 2 },
    { id: "item-1-2", x: 2, y: 0, w: 2, h: 2 },
  ])
  const [items2, setItems2] = useState([
    { id: "item-2-1", x: 0, y: 0 },
    { id: "item-2-2", x: 0, y: 1 },
    { id: "item-2-3", x: 1, y: 0 },
  ])

  // const getMap = () => {
  //   return itemsRef.current
  // }

  const options: GridStackOptions = {
    column: 40,
    minRow: 40,
    cellHeight: 150,
    float: true,
    removable: ".trash",
  }

  useEffect(() => {
    if (me) ws.emit("join-room", { roomID: id, peerId: me._id })
    grid = GridStack.init(options)
  }, [id, me, ws])

  useEffect(() => {
    const peerStreams = Object.values(peers as PeerState).map(
      (peer) => peer.stream.id
    )

    // Filter out streams that are already created
    const newPeerStreams = peerStreams.filter(
      (streamId) => !createdPeersRef.current.has(streamId)
    )

    // Add new peer streams
    if (newPeerStreams.length > 0) {
      setPeerItems((prevSet) => {
        const newSet = new Set(prevSet)
        newPeerStreams.forEach((streamId) => {
          newSet.add(streamId)
          // Create widget after a short delay
          setTimeout(() => {
            grid.makeWidget(getMap().get(streamId))

            createdPeersRef.current.add(streamId)
          }, 5)
        })
        return newSet
      })
    }
  }, [peers])
  console.log("peers" + { peers })

  console.log("peerItems" + Array.from(peerItems))

  return (
    <>
      <div>Room id = {id}</div>
      {/* <button onClick={addWidget}>Add Peer Widget</button> */}

      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <button
          onClick={() =>
            setItems1((items) => [
              ...items,
              { id: `item-1-${Date.now()}`, x: 2, y: 0, w: 2, h: 2 },
            ])
          }
        >
          Add Item to 1 grid
        </button>
        <button
          onClick={() =>
            setItems2((items) => [
              ...items,
              { id: `item-2-${Date.now()}`, x: 2, y: 0, w: 2, h: 2 },
            ])
          }
        >
          Add Item to 2 grid
        </button>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", width: "50%" }}>
          <ControlledStack
            items={items1}
            addItem={(item) => {
              setItems1((items) => [...items, item])
            }}
            changeItems={(items) => setItems1(items)}
          />
        </div>
        <div style={{ display: "flex", width: "50%" }}>
          <ControlledStack
            items={items2}
            addItem={(item) => {
              setItems2((items) => [...items, item])
            }}
            changeItems={(items) => setItems2(items)}
          />
        </div>
      </div>

      {/* <div
        className="grid-stack gs-20"
        style={{ width: "100%", height: "100vh" }}
      >
        <div
          className="grid-stack-item "
          // gs-w="20"
          // gs-h="4"
          gs-x="10"
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
        {Array.from(peerItems).map((peerStreamId) => {
          // Find the peer with the matching stream ID
          const peer = Object.values(peers as PeerState).find(
            (p) => p.stream.id === peerStreamId
          )
          return peer ? (
            <div
              className="grid-stack-item video"
              // gs-w="20"
              // gs-h="4"
              gs-x="2"
              gs-y="10"
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
        {items.map((cat) => (
          <div
            className="grid-stack-item"
            gs-w={cat.w}
            gs-h={cat.h}
            gs-x={cat.x}
            gs-y={cat.y}
            key={cat._id}
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
      </div> */}
    </>
  )
}
