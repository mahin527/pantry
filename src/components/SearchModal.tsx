"use client"

import { useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearch } from "@/hooks/useSearch"
import { formatPrice, hasDiscount, getEffectivePrice } from "@/lib/utils"
import { IoSearchOutline, IoClose, IoTimeOutline } from "react-icons/io5"
import { FiX } from "react-icons/fi"
import { FaArrowTrendUp } from "react-icons/fa6"

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const {
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
  } = useSearch()

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const trimmedQuery = query.trim()
  const hasQuery = trimmedQuery.length >= 2
  const showRecent = !hasQuery && recentSearches.length > 0
  const showNoRecent = !hasQuery && recentSearches.length === 0
  const hasResults = hasQuery && !loading && suggestions.length > 0
  const showNoResults = hasQuery && !loading && !error && suggestions.length === 0
  const showError = hasQuery && !loading && !!error

  // The navigable items for keyboard navigation
  const navigableCount = hasQuery ? suggestions.length : recentSearches.length

  // Autofocus and body scroll lock
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        clearTimeout(t)
        document.body.style.overflow = prevOverflow
      }
    }
  }, [open])

  // Reset search when modal closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => reset(), 200)
      return () => clearTimeout(t)
    }
  }, [open, reset])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !scrollRef.current) return
    const el = scrollRef.current.querySelector<HTMLElement>(
      `[data-search-index="${activeIndex}"]`,
    )
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const navigateToProduct = useCallback(
    (slug: string, title: string) => {
      addRecentSearch(title)
      reset()
      onClose()
      router.push(`/product/${slug}`)
    },
    [addRecentSearch, reset, onClose, router],
  )

  const navigateToSearch = useCallback(
    (term: string) => {
      const t = term.trim()
      if (!t) return
      addRecentSearch(t)
      reset()
      onClose()
      router.push(`/products?search=${encodeURIComponent(t)}`)
    },
    [addRecentSearch, reset, onClose, router],
  )

  const selectActive = useCallback(() => {
    if (hasQuery) {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const s = suggestions[activeIndex]
        navigateToProduct(s.slug, s.title)
      } else {
        navigateToSearch(trimmedQuery)
      }
    } else {
      if (activeIndex >= 0 && activeIndex < recentSearches.length) {
        navigateToSearch(recentSearches[activeIndex])
      }
    }
  }, [
    hasQuery,
    activeIndex,
    suggestions,
    recentSearches,
    trimmedQuery,
    navigateToProduct,
    navigateToSearch,
  ])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        if (navigableCount === 0) return
        setActiveIndex((prev) => (prev + 1) % navigableCount)
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        if (navigableCount === 0) return
        setActiveIndex((prev) => (prev <= 0 ? navigableCount - 1 : prev - 1))
        return
      }

      if (e.key === "Enter") {
        e.preventDefault()
        selectActive()
        return
      }
    },
    [onClose, navigableCount, setActiveIndex, selectActive],
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        // Close when clicking the overlay (not its children)
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="w-full max-w-2xl h-fit max-h-[85vh] mt-[10vh] mx-4 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <span className="flex items-center justify-center text-gray-400 shrink-0">
            <IoSearchOutline size={24} />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, brands..."
            aria-label="Search products"
            aria-autocomplete="list"
            aria-controls="search-results"
            className="flex-1 text-base lg:text-lg outline-none border-none bg-transparent text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex items-center justify-center size-9 text-gray-500 rounded-full hover:bg-gray-100 shrink-0 transition-colors"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Results body */}
        <div
          id="search-results"
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
        >
          {/* Loading state */}
          {loading && (
            <div className="px-4 py-10 flex flex-col items-center gap-3 text-gray-400">
              <div className="size-7 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm">Searching...</p>
            </div>
          )}

          {/* Error state */}
          {showError && (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              {error}. Please try again.
            </div>
          )}

          {/* No results state */}
          {showNoResults && (
            <div className="px-4 py-10 flex flex-col items-center gap-2 text-center">
              <IoSearchOutline size={36} className="text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">
                No products found for &ldquo;{trimmedQuery}&rdquo;
              </p>
              <button
                onClick={() => selectActive()}
                className="text-sm text-blue-600 font-semibold hover:underline mt-1"
              >
                Search all products for &ldquo;{trimmedQuery}&rdquo;
              </button>
            </div>
          )}

          {/* Recent searches (shown when not typing) */}
          {showRecent && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Recent searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <ul role="listbox" aria-label="Recent searches">
                {recentSearches.map((term, idx) => (
                  <li
                    key={term}
                    data-search-index={idx}
                    role="option"
                    aria-selected={activeIndex === idx}
                  >
                    <div
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => navigateToSearch(term)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        activeIndex === idx ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center justify-center text-gray-400 shrink-0">
                        <IoTimeOutline size={18} />
                      </span>
                      <span className="flex-1 text-sm text-gray-700 truncate">
                        {term}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeRecentSearch(term)
                        }}
                        aria-label={`Remove ${term} from recent searches`}
                        className="flex items-center justify-center size-7 text-gray-400 rounded-full hover:bg-gray-200 shrink-0 transition-colors"
                      >
                        <FiX size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Empty initial state (no recent searches, no query) */}
          {showNoRecent && (
            <div className="px-4 py-10 flex flex-col items-center gap-2 text-center">
              <IoSearchOutline size={36} className="text-gray-300" />
              <p className="text-sm text-gray-500">
                Start typing to search for products
              </p>
            </div>
          )}

          {/* Suggestions (shown when typing and results available) */}
          {hasResults && (
            <div className="py-2">
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="flex items-center justify-center text-gray-400">
                  <FaArrowTrendUp size={13} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Products
                </span>
              </div>
              <ul role="listbox" aria-label="Product suggestions">
                {suggestions.map((p, idx) => {
                  const isActive = activeIndex === idx
                  const effectivePrice = getEffectivePrice(p.price, p.discountPrice)
                  const isDiscounted = hasDiscount(p.price, p.discountPrice)
                  const imageSrc = p.images?.[0] || "/placeholder-product.png"

                  return (
                    <li
                      key={String(p._id)}
                      data-search-index={idx}
                      role="option"
                      aria-selected={isActive}
                    >
                      <Link
                        href={`/product/${p.slug}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => navigateToProduct(p.slug, p.title)}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                          isActive ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={imageSrc}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {p.title}
                          </p>
                          {p.brand && (
                            <p className="text-xs text-gray-400 truncate">
                              {p.brand}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isDiscounted && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(p.price)}
                            </span>
                          )}
                          <span className="text-sm font-bold text-blue-600">
                            {formatPrice(effectivePrice)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {/* View all results */}
              <button
                onClick={() => navigateToSearch(trimmedQuery)}
                className="w-full px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 border-t border-gray-100 transition-colors"
              >
                View all results for &ldquo;{trimmedQuery}&rdquo;
              </button>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold">
                ↵
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold">
                esc
              </kbd>
              close
            </span>
          </div>
          <span className="hidden sm:block">Press enter to search</span>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
