export function hasValue(value) {
  return value && value
}
function getValue(value) {
  return value !== null && value !== undefined ? value : ''
}

export function maxLength(value, length, message) {
  //length patlamasın diye.
  value = getValue(value)
  return value.length < length || message
}

export function minLength(value, length, message) {
  //length patlamasın diye.
  value = getValue(value)
  return value.length > length || message
}

export function mail(value, message) {
  value = getValue(value)
  return !value || /\S+@\S+\.\S+/gi.test(value) || message
}

export function required(value, message) {
  return !!hasValue(value) || message
}
