import { useCanvasStore } from "@/Store/canvasStore"
import "./styles.scss"
import pen from "@/public/pen.svg"
import square from "@/public/square.svg"

import undo from "@/public/undo.svg"
import redo from "@/public/redo.svg"

type ToolBarProps = {
  // tool: React.Dispatch<React.SetStateAction<string>> // Replace `string` with the type of your state
}

export const ToolBar: React.FC = () => {
  const setTool = useCanvasStore((state) => state.setTool)

  return (
    <div className="toolbar-container">
      <div className="toolbar-container__icon-wrapper">
        <img onClick={() => setTool("pencil")} src={pen} alt="pencil" />
        {/* <button onClick={() => setTool("pencil")}>PEN</button> */}
      </div>
      <div className="toolbar-container__icon-wrapper">
        <img onClick={() => setTool("line")} src={pen} alt="line" />
      </div>
      <div className="toolbar-container__icon-wrapper">
        <img onClick={() => setTool("rectangle")} src={square} alt="square" />
      </div>
      <div className="toolbar-container__icon-wrapper">
        <img onClick={() => setTool("undo")} src={undo} alt="undo" />
      </div>
      <div className="toolbar-container__icon-wrapper">
        <img onClick={() => setTool("redo")} src={redo} alt="redo" />
      </div>
    </div>
  )
}
