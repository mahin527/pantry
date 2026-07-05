"use client"

import { useState, useEffect, useCallback } from "react"

export type User = {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
}

let globalUser: User | null | undefined = undefined
let globalListeners: Array<(u: User | null) => void> = []

function notifyListeners(user: User | null) {
  globalUser = user
  for (const fn of globalListeners) fn(user)
}

export function getCachedUser(): User | null | undefined {
  return globalUser
}

export function setCachedUser(user: User | null) {
  notifyListeners(user)
}

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(globalUser)
  const [loading, setLoading] = useState(!globalUser)

  useEffect(() => {
    const listener = (u: User | null) => setUser(u)
    globalListeners.push(listener)
    return () => {
      globalListeners = globalListeners.filter((l) => l !== listener)
    }
  }, [])

  const fetchUser = useCallback(async () => {
    if (globalUser !== undefined) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch("/api/users/me", { credentials: "include" })
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          notifyListeners(json.data)
        } else {
          notifyListeners(null)
        }
      } else {
        notifyListeners(null)
      }
    } catch {
      notifyListeners(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (globalUser === undefined) {
      const timer = setTimeout(() => fetchUser(), 0)
      return () => clearTimeout(timer)
    }
  }, [fetchUser])

  return { user, loading, refresh: fetchUser }
}
