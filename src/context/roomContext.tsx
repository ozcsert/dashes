// src/context/RoomContext.ts
import { createContext, ReactNode } from "react"

// Create the context type
// interface RoomContextType {
//   ws: any
//   me: Peer | undefined
//   stream: MediaStream | undefined
//   peers: any
//   userName: string
//   setUserName: (userName: string) => void
//   getUsers: ({ participants }: { participants: string[] }) => void
// }

export const RoomContext = createContext<null | any>(null)

export interface RoomProviderProps {
  children: ReactNode
}
