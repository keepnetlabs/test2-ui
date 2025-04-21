import blacklist from './subdomainBlacklist'

export function hasValue(value) {
  return value ? value : undefined
}

export function getValue(value) {
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
  return email(value, message)
}

export function ipv4Oripv6(value, message = 'Invalid IP address') {
  value = getValue(value)

  if (value.includes(':')) {
    if (value.includes('/')) {
      return (
        /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:)(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/(12[4-8]))?$/.test(
          value
        ) || 'Invalid subnet mask'
      )
    }

    return (
      /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:)(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*$/.test(
        value
      ) || message
    )
  }

  return ip(value, message)
}

export function ip(value, message = 'Invalid IP address') {
  value = getValue(value)

  if (value.includes('/')) {
    return (
      /^(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)(\/(\d|1\d|2\d|3[0-2]))$/.test(
        value
      ) || 'Invalid subnet mask'
    )
  }

  return (
    /^(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)$/.test(
      value
    ) || message
  )
}

export function ipWithStars(value, message = 'Invalid IP address') {
  value = getValue(value)
  return (
    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(
      value
    ) || message
  )
}

export function url(value, message = 'Invalid URL') {
  value = getValue(value)
  if (value.includes(' ')) return message
  return value
    ? /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
        value
      ) || message
    : true
}

export function startsWithHttpOrHttps(value, message = 'Must start with http:// or https://') {
  value = getValue(value)

  if (value.includes(' ')) return message

  return /^(http|https):\/\//.test(value) || message
}

export function urlOrIpAddress(value, message = 'Invalid URL') {
  value = getValue(value)
  if (value.includes(' ')) return message
  return value
    ? /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-z0-9@:%_\+.~#?&/=]*)/gi.test(
        value
      ) ||
        /^([(http(s)?):\/\/]{7,8})?(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)\.(25[0-5\x2A]|2[0-4\x2A][0-9\x2A]|[01\x2A]?[0-9\x2A][0-9\x2A]?)/.test(
          value
        ) ||
        message
    : true
}

export function urlWithPort(value, message = 'Invalid URL') {
  value = getValue(value)
  if (value.includes(' ')) return message
  return value
    ? /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z])?\b([-a-z0-9@:%_\+.~#?&/=]*)/gi.test(
        value
      ) || message
    : true
}

export function domain(value, message) {
  value = getValue(value)
  return /^[a-z0-9\-]{1,61}[a-z0-9](?:\.[a-z]{2,})+$/gi.test(value) || message
}

export function phone(value, message) {
  //e.164
  value = getValue(value)
  return /^\+[1-9]\d{10,14}$/gi.test(value) || message
}

export function emailOrDomain(value, message = 'Invalid email address') {
  value = getValue(value)
  if (!value.includes('@')) {
    return domain(value, 'Invalid domain')
  }
  return value
    ? (/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,255}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,255}[a-zA-Z0-9])?)*$/.test(
        value
      ) &&
        isEmailSpecialCharacter(value)) ||
        message
    : true
}

export function email(value, message = 'Invalid email address') {
  value = getValue(value)
  return value
    ? (/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,255}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,255}[a-zA-Z0-9])?)*$/.test(
        value
      ) &&
        isEmailSpecialCharacter(value)) ||
        message
    : true
}

export function controlEmailLength(value, message = '') {
  value = getValue(value)
  const [leftSide = '', rightSide = ''] = value?.split('@') || []
  if (leftSide.length > 64 || rightSide.length > 256) return message || ''
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

export function noWhitespace(value, message = '') {
  value = getValue(value)
  return !value.includes(' ') || message
}

export function isNumber(value, message = 'Invalid File Size') {
  value = getValue(value)
  return /^\d+$/gi.test(value) || message
}

export function isDescriptionSpecialCharacter(
  value,
  message = "Only use letters, numbers, dot '.' dash '-', slash '/', paranthesis '( ), comma ',' and ampersand '&'"
) {
  value = getValue(value)
  return /^(\d|[A-Z]|[-\/,&\s().öğüıçşÖĞÜİÇŞ]){0,2001}$/gi.test(value) || message
}

export function isProxyAddressOrIp(
  value,
  message = "Only use letters, numbers, dot '.' dash '-', slash '/', paranthesis '( ), comma ',' and ampersand '&'"
) {
  value = getValue(value)
  return /^(\d|[A-Z]|[-\/,&()ö.ğüıçşÖĞÜİÇŞ]){0,2001}$/gi.test(value) || message
}

export function isNameSpecialCharacter(
  value,
  message = `Only use letters, dash '-' and apostrophe '`
) {
  return /^([A-Z]|[-'\söğüıçşÖĞÜİÇŞ]){0,40}$/gi.test(value) || message
}

export function isEntityNameSpecialCharacter(
  value,
  message = `Only use letters, numbers, dash '-' slash '/' comma ',' and ampersand '&'`
) {
  value = getValue(value)
  return /^([A-Z]|\d|[-/,:&\söğüıçşÖĞÜİÇŞ]){0,64}$/gi.test(value) || message
}

export function isEmailSpecialCharacter(value) {
  return /^([A-Z]|\d|[,&!#$%'*+-/=?@^_`~]){0,320}$/gi.test(value)
}

export function port(value, message = 'Only use numbers') {
  value = getValue(value)
  if (!/^\d*$/gi.test(value)) return message
  value = parseInt(value, 10)
  return (value > 0 && value <= 65536) || 'Invalid port number'
}

export function isFileExtensionSpecialCharacter(value, message) {
  return /^([A-Z]|\d|[!#@$?()^[]_~]){0,10}$/gi.test(value) || message
}

export function isDomainUrl(value, message = 'Invalid URL') {
  return (
    /^((urn):|(|(file|gopher|news|nntp|telnet|http|ftp|https|ftps|sftp):\/\/)|(www\.))+(([a-z0-9\._-]+\.(com|tech|cloud|app|cl|edu|ro|gov|aero|asia|arpa|cat|coop|int|io|jobs|mobi|museum|mx|me|travel|tv|pro|mil|tw|net|org|biz|info|name|museum|ru|ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cl|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|ro|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|top|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ru|ve|vg|vi|vn|vu|wf|ws|us|ca|uk|co|uk|tr|fr|gb|life|isbank)(\.(ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cl|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|ro|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|top|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ru|ve|vg|vi|vn|vu|wf|ws|life|isbank)|))|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(\/[a-zıIiİuUüÜA-ZıIiİuUüÜ0-9\&\;\?\=%_\.\/\-~-]*)?$/i.test(
      value
    ) || message
  )
}
export function numberRangeRule(value, min = 0, max = 999, message = '') {
  if (value == '' && value == null) return false
  if (!isNaN(parseInt(value)) && value >= min && value <= max) return true
  return message || `Enter a number between ${min} and ${max}`
}

export function subdomainDash(value, message = 'Invalid Subdomain') {
  value = getValue(value)
  return /^[a-z0-9-]*$/gi.test(value) || message
}

export function startsOrEndsWithHyphen(value, message = 'Cannot start or end with hyphen(-)') {
  value = getValue(value)
  return /^(?!-).*[^-]$/gi.test(value) || message
}

export function subdomainDashDot(value, message = 'Invalid Subdomain') {
  value = getValue(value)
  return /^[a-z0-9.-]*$/gi.test(value) || message
}

export function subdomainBlacklist(value) {
  value = getValue(value)
  const subdomainIndex = blacklist.findIndex((domain) =>
    value.toLowerCase().includes(domain.toLowerCase())
  )
  if (subdomainIndex !== -1) {
    return `“${blacklist[subdomainIndex]}” is a banned word for a subdomain`
  }
  return true
}

export function verifiedDomains(
  value,
  verifiedDomainList = [],
  message = 'This domain is unverified. Make it verified to use.'
) {
  value = getValue(value)
  if (value.includes('@')) {
    value = value?.split('@')[1]
    return verifiedDomainList.some((domain) => domain === value) || message
  }
  return true
}
export function isGsm7(
  v = '',
  message = "The SMS content isn't compatible with the GSM-7 character set."
) {
  const gsm = new RegExp(
    '^[A-Za-z0-9 \\r\\n@£$¥èéùìòÇØøÅå\u0394_\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039EÆæßÉ!"#$%&\'()*+,\\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\\\\\[~\\]|\u20AC]*$'
  )
  return gsm.test(v) || message
}

export function ldapConnectionStringUrl(value, message = 'Incorrect path format') {
  return (
    /^(ldaps?:\/\/)?([0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}|[a-zA-Z][a-zA-Z0-9._-]{1,})(:[0-9]{1,5})?$/i.test(
      value
    ) || message
  )
}
