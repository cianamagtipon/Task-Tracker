export type UserID = string
export type BoardID = string
export type TaskID = string

export interface User {
  id: UserID
  email: string
  username: string
  passwordHash: string
  createdAt: string
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed'

export interface Task {
  id: TaskID
  boardId: BoardID
  title: string
  completed: boolean
  createdAt: string
  assigneeId?: UserID | null
  status: TaskStatus
}

export interface Board {
  id: BoardID
  name: string
  ownerId: UserID
  memberIds: UserID[]
  createdAt: string
}

export type TaskFilter = 'all' | 'active' | 'completed'
