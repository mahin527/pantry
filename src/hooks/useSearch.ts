"use client"

import { useState, useEffect, useCallback, useRef, startTransition } from "react"
import type { SearchSuggestion } from "@/app/api/search/suggestions/route"
import type { ApiResponse } from "@/types/common"

const RECENT_SEARCHES_KEY = "pantry:recent-searches"
const MAX_RECENT = 8
const DEBOUNCE_MS = 350

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

function readRecent(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : []
  } catch {
    return []
  }
}

function writeRecent(items: string[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(items.slice(0, MAX_RECENT)),
    )
  } catch {
    // localStorage may be unavailable (private mode) — fail silently
  }
}

export function useSearch() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Lazy-initialize from localStorage (SSR-safe: returns [] on server)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readRecent())
  const [activeIndex, setActiveIndex] = useState(-1)

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)
  const abortRef = useRef<AbortController | null>(null)

  // Fetch logic lives in a callback so the effect body itself does not call
  // setState synchronously (avoids react-hooks/set-state-in-effect warning).
  const runSearch = useCallback((rawQuery: string) => {
    const trimmed = rawQuery.trim()

    if (!trimmed || trimmed.length < 2) {
      setSuggestions([])
      setLoading(false)
      setError(null)
      setActiveIndex(-1)
      abortRef.current?.abort()
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    fetch(
      `/api/search/suggestions?q=${encodeURIComponent(trimmed)}&limit=5`,
      { signal: controller.signal },
    )
      .then((res) => res.json())
      .then((body: ApiResponse<SearchSuggestion[]>) => {
        if (body.success && Array.isArray(body.data)) {
          setSuggestions(body.data)
        } else {
          setSuggestions([])
        }
        setActiveIndex(-1)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        setError("Failed to load suggestions")
        setSuggestions([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
  }, [])

  // Trigger a search whenever the debounced query changes.
  // Wrapped in startTransition to avoid cascading renders (matches the
  // established pattern used by WishlistProvider in this codebase).
  useEffect(() => {
    startTransition(() => {
      runSearch(debouncedQuery)
    })
    return () => abortRef.current?.abort()
  }, [debouncedQuery, runSearch])

  const addRecentSearch = useCallback((term: string) => {
    const trimmed = term.trim()
    if (!trimmed) return
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())
      const next = [trimmed, ...filtered].slice(0, MAX_RECENT)
      writeRecent(next)
      return next
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    writeRecent([])
  }, [])

  const removeRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s.toLowerCase() !== term.toLowerCase())
      writeRecent(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setQuery("")
    setSuggestions([])
    setLoading(false)
    setError(null)
    setActiveIndex(-1)
  }, [])

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    recentSearches,
    activeIndex,
    setActiveIndex,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
    reset,
  }
}
