type LogMeta = Record<string, unknown> | unknown

const serialize = (message: string, meta?: LogMeta, err?: unknown) => {
  const payload: Record<string, unknown> = {
    message,
    timestamp: new Date().toISOString(),
  }

  if (meta !== undefined) {
    payload.meta = meta
  }

  if (err !== undefined) {
    if (err instanceof Error) {
      payload.error = {
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
  info(message: string, ...args: unknown[]) {
    let meta: LogMeta | undefined = undefined
    let err: unknown = undefined
    
    if (args.length === 1) {
      if (args[0] instanceof Error) {
        err = args[0]
      } else {
        meta = args[0]
      }
    } else if (args.length === 2) {
      meta = args[0]
      err = args[1]
    }
    
    console.log(serialize(message, meta, err))
  },

  warn(message: string, ...args: unknown[]) {
    let meta: LogMeta | undefined = undefined
    let err: unknown = undefined
    
    if (args.length === 1) {
      if (args[0] instanceof Error) {
        err = args[0]
      } else {
        meta = args[0]
      }
    } else if (args.length === 2) {
      meta = args[0]
      err = args[1]
    }
    
    console.warn(serialize(message, meta, err))
  },

  error(message: string, ...args: unknown[]) {
    let meta: LogMeta | undefined = undefined
    let err: unknown = undefined
    
    if (args.length === 1) {
      if (args[0] instanceof Error) {
        err = args[0]
      } else {
        meta = args[0]
      }
    } else if (args.length === 2) {
      if (args[1] instanceof Error) {
        err = args[1]
        meta = args[0]
      } else {
        meta = args[0]
        err = args[1]
      }
    }
    
    console.error(serialize(message, meta, err))
  },

  debug(message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV !== "development") {
      return
    }
    
    let meta: LogMeta | undefined = undefined
    let err: unknown = undefined
    
    if (args.length === 1) {
      if (args[0] instanceof Error) {
        err = args[0]
      } else {
        meta = args[0]
      }
    } else if (args.length === 2) {
      if (args[1] instanceof Error) {
        err = args[1]
        meta = args[0]
      } else {
        meta = args[0]
        err = args[1]
      }
    }
    
    console.debug(serialize(message, meta, err))
  },
}