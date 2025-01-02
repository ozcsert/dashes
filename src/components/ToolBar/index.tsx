import { useCanvasStore } from "@/Store/canvasStore"
import { useEffect } from "react"

type ToolBarProps = {
  // tool: React.Dispatch<React.SetStateAction<string>> // Replace `string` with the type of your state
}

export const ToolBar: React.FC = () => {
  const setTool = useCanvasStore((state) => state.setTool)

  return (
    <div>
      <button onClick={() => setTool("pencil")}>PEN</button>
      <button onClick={() => setTool("line")}>LINE</button>
      <button onClick={() => setTool("rectangle")}>RECTANGLE</button>
    </div>
  )
}
