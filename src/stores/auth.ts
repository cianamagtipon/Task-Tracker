import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import type { User } from '@/types'

interface State {
  users: User[]
  currentUserId: string | null
}

function hash(pw: string) {
  return 'demo_hash__' + btoa(pw)
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    users: storage.get<User[]>('users', []),
    currentUserId: storage.get<string | null>('currentUserId', null),
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.currentUserId),
    me: (s): User | null =>
      s.users.find((u) => u.id === s.currentUserId) ?? null,
    allUsers: (s): User[] => s.users,
  },
  actions: {
    persist() {
      storage.set('users', this.users)
      storage.set('currentUserId', this.currentUserId)
    },
    signup(email: string, username: string, password: string) {
      if (
        this.users.some((u) => u.email.toLowerCase() === email.toLowerCase())
      ) {
        throw new Error('Email already in use.')
      }
      if (
        this.users.some(
          (u) => u.username.toLowerCase() === username.toLowerCase(),
        )
      ) {
        throw new Error('Username already in use.')
      }
      const user: User = {
        id: crypto.randomUUID(),
        email,
        username,
        passwordHash: hash(password),
        createdAt: new Date().toISOString(),
      }
      this.users.push(user)
      this.currentUserId = user.id
      this.persist()
    },
    login(identifier: string, password: string) {
      const byName = this.users.find(
        (u) => u.username.toLowerCase() === identifier.toLowerCase(),
      )
      const byEmail = this.users.find(
        (u) => u.email.toLowerCase() === identifier.toLowerCase(),
      )
      const user = byName ?? byEmail
      if (!user) throw new Error('User not found.')
      if (user.passwordHash !== hash(password))
        throw new Error('Incorrect password.')
      this.currentUserId = user.id
      this.persist()
    },
    logout() {
      this.currentUserId = null
      this.persist()
    },
  },
})
