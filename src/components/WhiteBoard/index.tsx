import { useEffect, useLayoutEffect, useState } from "react"
import { useCanvasStore } from "@/Store/canvasStore"
import rough from "roughjs"
import "./styles.scss"
type WhiteBoardProps = {
  ctxRef: React.RefObject<HTMLCanvasElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  // elements: any
  // setElements: any
}

const roughGenerator = rough.generator()

export const WhiteBoard: React.FC<WhiteBoardProps> = ({
  ctxRef,
  canvasRef,
}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [elements, setElements] = useState<any>([])
  const tool = useCanvasStore((state) => state.tool)
  useEffect(() => {
    const canvas = canvasRef.current

    canvas.height = window.innerHeight * 2
    canvas.width = window.innerWidth * 2

    const ctx = canvas.getContext("2d")
    ctxRef.current = ctx
  }, [])

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current)
    if (elements.length > 0) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )
    }

    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path)
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
        },
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
        },
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
        },
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
              }
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