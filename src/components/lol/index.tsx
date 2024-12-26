import {
  useContext,
  useEffect,
  useRef,
  useState,
  createRef,
  useLayoutEffect,
} from "react"

import { useParams } from "react-router-dom"
import { RoomContext } from "../../context/roomContext"
import { VideoPlayer } from "../VideoContainer/VideoPlayer"
import { GridStack, GridStackWidget, GridStackOptions } from "gridstack"
import Widget from "@/components/WIdget"
import "gridstack/dist/gridstack.min.css"
import { ControlledStackGrid } from "@/components/ControlledStack"

import "gridstack/dist/gridstack-all.js"

export const ControlledExample = () => {
  const [items1, setItems1] = useState([
    { id: "item-1-1", x: 0, y: 0, w: 2, h: 2 },
    { id: "item-1-2", x: 2, y: 0, w: 2, h: 2 },
  ])
  const [items2, setItems2] = useState([
    { id: "item-2-1", x: 0, y: 0 },
    { id: "item-2-2", x: 0, y: 1 },
    { id: "item-2-3", x: 1, y: 0 },
  ])

  return (
    <div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <div></div>
      </div>

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
          <ControlledStackGrid
            items={items1}
            addItem={(item) => {
              setItems1((items) => [...items, item])
            }}
            changeItems={(items) => setItems1(items)}
          />
        </div>
        <div style={{ display: "flex", width: "50%" }}>
          <ControlledStackGrid
            items={items2}
            addItem={(item) => {
              setItems2((items) => [...items, item])
            }}
            changeItems={(items) => setItems2(items)}
          />
        </div>
      </div>
    </div>
  )
}
