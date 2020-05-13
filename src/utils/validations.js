export function hasValue(value) {
  return value && value
}

export function maxLength(value, length, message) {
  return (value.length < length) || message
}

export function mail(value, message) {
  return (hasValue(value) && /\S+@\S+\.\S+/gi.test(value)) || message
}

export function required(value, message) {
  return !!hasValue(value) || message
}
