import { RoomContext } from "../../context/roomContext"
import { useContext, useEffect, useLayoutEffect, useState, useRef } from "react"
import { useCanvasStore } from "@/Store/canvasStore"
import rough from "roughjs"
import { encode, decode } from "@msgpack/msgpack"
import "./styles.scss"

type PathItem = { offsetX: number; offsetY: number } | [number, number][]

type DrawingObject = {
  type: string
  stroke: string
  path: PathItem[]
  offsetX: number
  offsetY: number
  height: number
  width: number
}

const roughGenerator = rough.generator()

export const WhiteBoard: React.FC = () => {
  const { ws, me, stream, peers, userName } = useContext(RoomContext)

  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [elements, setElements] = useState<DrawingObject[]>([])
  const [elements2, setElements2] = useState<DrawingObject[]>([])

  const tool = useCanvasStore((state) => state.tool)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null) // Mutable ref

  useEffect(() => {
    const canvas = canvasRef.current
    canvas!.height = window.innerHeight * 2
    canvas!.width = window.innerWidth * 2

    const ctx = canvas!.getContext("2d")
    ctxRef.current = ctx
  }, [])

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current!)
    if (elements.length > 0) {
      ctxRef.current!.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      )
    }

    elements.forEach((element) => {
      if (element.type === "pencil") {
        const points = element.path.map((item) =>
          Array.isArray(item) ? item : [item.offsetX, item.offsetY]
        ) as [number, number][]

        roughCanvas.linearPath(points)
      } else if (element.type === "line") {
        roughCanvas.draw(
          roughGenerator.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height
          )
        )
      } else if (element.type === "rectangle") {
        roughCanvas.draw(
          roughGenerator.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height
          )
        )
      }
    })

    const encodedElements: Uint8Array = encode(elements)
    // const decodedElementReturn: any = (decode(encodedElements), elements)
    // console.log(decodedElementReturn)

    ws.emit("canvas-data", encodedElements)
    // const encodedElements: Uint8Array = encode(elements)

    ws.on("canvas-data-return", (data: Uint8Array) => {
      const decodedElementReturn: any = (decode(data), elements)
      console.log(decodedElementReturn)
      setElements((prev) => [...prev, ...decodedElementReturn])
    })
  }, [elements])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY }: { offsetX: number; offsetY: number } =
      e.nativeEvent

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [{ offsetX, offsetY }],
          stroke: "black",
        } as DrawingObject,
      ])
    } else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: "black",
        } as DrawingObject,
      ])
    } else if (tool === "rectangle") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "rectangle",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: "black",
        } as DrawingObject,
      ])
    }

    setIsDrawing(true)
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY }: { offsetX: number; offsetY: number } =
      e.nativeEvent
    setIsDrawing(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY }: { offsetX: number; offsetY: number } =
      e.nativeEvent
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1]
        const newPath = [...path, [offsetX, offsetY]]

        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                path: newPath,
              } as DrawingObject
            } else {
              return ele
            }
          })
        )
      } else if (tool === "line") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX,
                height: offsetY,
              }
            } else {
              return ele
            }
          })
        )
      } else if (tool === "rectangle") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              }
            } else {
              return ele
            }
          })
        )
      }
    }
  }

  useEffect(() => {})

  return (
    <>
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        className="canvas-container"
      >
        <canvas ref={canvasRef} />
      </div>
    </>
  )
}
