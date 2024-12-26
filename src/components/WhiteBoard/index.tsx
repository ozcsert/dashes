import { useEffect, useState } from "react"
import rough from "roughjs"

type WhiteBoardProps = {
  ctxRef: React.RefObject<HTMLCanvasElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  elements: any
  setElements: any
}

const roughGenerator = rough.generator()

export const WhiteBoard: React.FC<WhiteBoardProps> = ({
  ctxRef,
  canvasRef,
}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [elements, setElements] = useState<any>([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctxRef.current = ctx
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY }: { offsetX: number; offsetY: number } =
      e.nativeEvent
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
    console.log(elements)

    setIsDrawing(true)
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY }: { offsetX: number; offsetY: number } =
      e.nativeEvent
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY }: { offsetX: number; offsetY: number } =
      e.nativeEvent
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isDrawing && console.log(offsetX, offsetY)
  }

  return (
    <canvas
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      ref={canvasRef}
    ></canvas>
  )
}
