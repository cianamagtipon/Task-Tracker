import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import type { Board, BoardID, UserID } from '@/types'
import { useAuthStore } from './auth'

interface State {
  boards: Board[]
  currentBoardId: BoardID | null
}

export const useBoardsStore = defineStore('boards', {
  state: (): State => ({
    boards: storage.get<Board[]>('boards', []),
    currentBoardId: storage.get<BoardID | null>('currentBoardId', null),
  }),
  getters: {
    currentBoard: (s): Board | null =>
      s.boards.find((b) => b.id === s.currentBoardId) ?? null,
    members(): UserID[] {
      return this.currentBoard?.memberIds ?? []
    },
  },
  actions: {
    persist() {
      storage.set('boards', this.boards)
      storage.set('currentBoardId', this.currentBoardId)
    },
    ensureDefaultBoard() {
      const auth = useAuthStore()
      if (!auth.me) return
      if (!this.currentBoardId) {
        const b: Board = {
          id: crypto.randomUUID(),
          name: `${auth.me.username}'s Board`,
          ownerId: auth.me.id,
          memberIds: [auth.me.id],
          createdAt: new Date().toISOString(),
        }
        this.boards.push(b)
        this.currentBoardId = b.id
        this.persist()
      }
    },
    addMember(userId: UserID) {
      const board = this.currentBoard
      if (!board) return
      if (!board.memberIds.includes(userId)) {
        board.memberIds.push(userId)
        this.persist()
      }
    },
    removeMember(userId: UserID) {
      const board = this.currentBoard
      if (!board) return
      if (userId === board.ownerId) return
      board.memberIds = board.memberIds.filter((id) => id !== userId)
      this.persist()
    },
  },
})
