import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
// import "./index.css"
import { RoomProvider } from "./context/RoomProvider.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home/index.tsx"
import { Room } from "./pages/Room/index.tsx"
import Dashboard from "@/pages/Dashboard"
import "@/styles/_styles.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Room />} />

          {/* <Route path="/room/:id" element={<Room />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  </StrictMode>
)
