import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RoomProvider } from "./context/roomContext.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home/index.tsx"
import { Room } from "./pages/Room/index.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  </StrictMode>
)
