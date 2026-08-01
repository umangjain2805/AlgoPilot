// NoSQL injection sanitization middleware.
// express-mongo-sanitize is not compatible with Express 5 (req.query is a read-only getter),
// so this is a drop-in replacement that sanitizes body, params and query.
const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const sanitizeValue = (value) => {
  if (value instanceof Date || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    return value.replace(/\$\$?/g, '')
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (isObject(value)) {
    const cleaned = {}
    for (const [key, val] of Object.entries(value)) {
      const cleanKey = key.replace(/\$\$?/g, '')
      cleaned[cleanKey] = sanitizeValue(val)
    }
    return cleaned
  }
  return value
}

export const mongoSanitize = () => (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body)
  if (req.params) req.params = sanitizeValue(req.params)
  if (req.query) {
    // req.query is a getter-only property in Express 5; redefine it.
    Object.defineProperty(req, 'query', {
      value: sanitizeValue(req.query),
      writable: true,
      configurable: true,
      enumerable: true,
    })
  }
  next()
}
