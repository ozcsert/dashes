import { create } from "zustand"

export type canvasState = {
  tool: string
  setTool: (newTool: string) => void
}

export const useCanvasStore = create<canvasState>((set) => ({
  tool: "pencil",
  setTool: (newTool) => set({ tool: newTool }),
}))
