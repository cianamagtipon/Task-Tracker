import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import type { Task, TaskFilter, TaskID, UserID } from '@/types'
import { useBoardsStore } from './boards'

interface State {
  tasks: Task[]
  filter: TaskFilter
}

export const useTasksStore = defineStore('tasks', {
  state: (): State => ({
    tasks: storage.get<Task[]>('tasks', []),
    filter: 'all',
  }),

  getters: {
    currentBoardTasks(): Task[] {
      const boardId = useBoardsStore().currentBoard?.id
      return this.tasks.filter((t) => t.boardId === boardId)
    },
    filtered(): Task[] {
      const list = this.currentBoardTasks
      if (this.filter === 'active') return list.filter((t) => !t.completed)
      if (this.filter === 'completed') return list.filter((t) => t.completed)
      return list
    },
  },

  actions: {
    persist() {
      storage.set('tasks', this.tasks)
    },

    addTask(title: string, assigneeId?: UserID | null) {
      const board = useBoardsStore().currentBoard
      if (!board) return
      const task: Task = {
        id: crypto.randomUUID(),
        boardId: board.id,
        title: title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        assigneeId: assigneeId ?? null,
        status: 'todo',
      }
      if (!task.title) return
      this.tasks.unshift(task)
      this.persist()
    },

    toggle(taskId: TaskID) {
      const t = this.tasks.find((t) => t.id === taskId)
      if (!t) return
      t.completed = !t.completed
      this.persist()
    },

    updateStatus(taskId: TaskID, status: 'todo' | 'in-progress' | 'completed') {
      const t = this.tasks.find((t) => t.id === taskId)
      if (!t) return
      t.status = status
      this.persist()
    },

    remove(taskId: TaskID) {
      this.tasks = this.tasks.filter((t) => t.id !== taskId)
      this.persist()
    },

    setFilter(f: TaskFilter) {
      this.filter = f
    },
  },
})
