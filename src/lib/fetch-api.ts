import { headers } from "next/headers"

export async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const reqHeaders = await headers()
    const host = reqHeaders.get("host") || "localhost:3000"
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    const cookie = reqHeaders.get("cookie")

    const res = await fetch(`${protocol}://${host}${path}`, {
      headers: cookie ? { cookie } : undefined,
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json()
    if (!json.success) return null
    return json.data as T
  } catch {
    return null
  }
}
