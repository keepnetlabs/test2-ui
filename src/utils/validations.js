export function hasValue(value) {
  return value && value
}

function getValue(value) {
  return value !== null && value !== undefined ? value : ''
}

export function maxLength(value, length, message) {
  //length patlamasın diye.
  value = getValue(value)
  return value.length <= length || message
}

export function minLength(value, length, message) {
  //length patlamasın diye.
  value = getValue(value)
  return value.length >= length || message
}

export function mail(value, message) {
  value = getValue(value)
  return !value || /\S+@\S+\.\S+/gi.test(value) || message
}

export function ip(value, message = 'Invalid IP address') {
  value = getValue(value)
  return (
    /^(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)$/.test(
      value
    ) || message
  )
}

export function ipWithStars(value, message = 'Invalid IP address') {
  value = getValue(value)
  return (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      value
    ) || message
  )
}

export function url(value, message = 'Invalid URL') {
  value = getValue(value)
  //https?:\/\/(www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
  return value
    ? /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
        value
      ) || message
    : true
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

export function email(value, message = 'Invalid email address') {
  value = getValue(value)
  return value
    ? /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi.test(
        value
      ) || message
    : true
}

export function controlEmailLength(value, message = '') {
  value = getValue(value)
  const [leftSide = '', rightSide = ''] = value.split('@')
  if (leftSide.length > 64 || rightSide.length > 256) {
    return message && message
  }
  return true
}
export function extension(value, message) {
  value = getValue(value)
  return !value.startsWith('.') || message
}

export function required(value, message = 'Required') {
  return !!hasValue(value) || message
}

export function trim(value, message) {
  value = getValue(value).trim()
  return value.length > 0 || message
}

export function startsWith(value = '', message = 'Cannot start with', startedValue = '') {
  value = getValue(value).toString()
  startedValue = startedValue.toString()
  return !value.startsWith(startedValue) || message
}

export function startsWithSpace(value, message = 'Cannot start with space') {
  value = getValue(value)
  return !value.startsWith(' ') || message
}

export function isNumber(value, message = 'Invalid File Size') {
  value = getValue(value)
  return /^\d+$/gi.test(value) || message
}
