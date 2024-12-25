import { useRef, useLayoutEffect, createRef } from "react"
import { GridStack } from "gridstack"
import "gridstack/dist/gridstack.min.css"
import "gridstack/dist/gridstack-extra.css"
import "gridstack/dist/gridstack-all.js"

interface GridItem {
  id: string
  x: number
  y: number
  w: number
  h: number
}

interface ControlledStackGridProps {
  items: GridItem[]
  addItem: (item: GridItem) => void
  changeItems: (items: GridItem[]) => void
  onItemTransfer?: (item: GridItem) => void
  gridId: string
}

const Item: React.FC<{ id: string }> = ({ id }) => <div>{id}</div>

export const ControlledStackGrid = ({
  items,
  addItem,
  changeItems,
  onItemTransfer,
  gridId,
}: ControlledStackGridProps) => {
  const refs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({})
  const gridRef = useRef<GridStack>()
  const gridContainerRef = useRef<HTMLDivElement>(null)
  refs.current = {}

  if (Object.keys(refs.current).length !== items.length) {
    items.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef()
    })
  }

  useLayoutEffect(() => {
    if (!gridRef.current) {
      const grid = GridStack.init(
        {
          float: false,
          acceptWidgets: true,
          column: 6,
          minRow: 1,
          dragIn: ".grid-stack-item",
          dragInOptions: { revert: "invalid", scroll: false },
        },
        gridContainerRef.current
      )

      grid.on("added removed change", (event, items) => {
        const newItems = grid.save(false)
        changeItems(newItems)
      })

      grid.on("dragstart", (event, el) => {
        el.dataset.sourceGrid = gridId
      })

      grid.on("dropped", (event, previousWidget, newWidget) => {
        const sourceGridId = previousWidget.el.dataset.sourceGrid
        if (sourceGridId && sourceGridId !== gridId) {
          const transferredItem = {
            id: previousWidget.id,
            x: newWidget.x,
            y: newWidget.y,
            w: newWidget.w || 2,
            h: newWidget.h || 2,
          }
          onItemTransfer?.(transferredItem)
        }
      })

      gridRef.current = grid
    }

    // Update layout
    const grid = gridRef.current
    const layout = items.map((item) => ({
      ...item,
      el: refs.current[item.id]?.current,
    }))
    grid.load(layout)

    return () => {
      if (gridRef.current) {
        gridRef.current.destroy()
        gridRef.current = undefined
      }
    }
  }, [items, gridId])

  return (
    <div style={{ width: "100%", marginRight: "10px" }}>
      <div className="grid-stack" ref={gridContainerRef}>
        {items.map((item) => (
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
        ))}
      </div>
    </div>
  )
}
