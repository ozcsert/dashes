import { create } from "zustand"

export type PeerState = {
  peers: Record<string, { stream: MediaStream }>
  addPeer: (peerId: string, stream: MediaStream) => void
  removePeer: (peerId: string) => void
}

export const usePeerStore = create<PeerState>((set) => ({
  peers: {},

  addPeer: (peerId, stream) =>
    set((state) => ({
      peers: {
        ...state.peers,
        [peerId]: { stream },
      },
    })),

  removePeer: (peerId) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [peerId]: _, ...rest } = state.peers
      return { peers: rest }
    }),
}))
