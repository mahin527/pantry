type LogMeta = Record<string, unknown> | undefined

const serialize = (message: string, meta?: LogMeta, err?: unknown) => {
  const payload: Record<string, unknown> = {
    level: "",
    message,
    timestamp: new Date().toISOString(),
  }

  if (meta && Object.keys(meta).length > 0) {
    payload.meta = meta
  }

  if (err !== undefined) {
    if (err instanceof Error) {
      payload.error = {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      }
    } else {
      payload.error = err
    }
  }

  return JSON.stringify(payload)
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(serialize(message, meta))
  },

  warn(message: string, meta?: LogMeta) {
    console.warn(serialize(message, meta))
  },

  error(message: string, err?: unknown, meta?: LogMeta) {
    console.error(serialize(message, meta, err))
  },

  debug(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV === "development") {
      console.debug(serialize(message, meta))
    }
  },
}