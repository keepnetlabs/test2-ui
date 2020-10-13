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

export function ip(value, message) {
  value = getValue(value)
  return (
    /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/gi.test(
      value
    ) || message
  )
}

export function url(value, message) {
  value = getValue(value)
  return (
    /https?:\/\/(www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(
      value
    ) || message
  )
}

export function domain(value, message) {
  value = getValue(value)
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/gi.test(value) || message
}
export function phone(value, message) {
  //e.164
  value = getValue(value)
  return /^\+[1-9]\d{10,14}$/gi.test(value) || message
}
export function email(value, message) {
  value = getValue(value)
  return (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi.test(
      value
    ) || message
  )
}

export function extension(value, message) {
  value = getValue(value)
  return !value.startsWith('.') || message
}

export function required(value, message) {
  return !!hasValue(value) || message
}

export function trim(value, message) {
  value = getValue(value).trim()
  return value.length > 0 || message
}
