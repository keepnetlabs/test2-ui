export const getTlcClass = (item) => {
  switch (item) {
    case 'wKBhLuFZ46y9':
      return 'TLP-GREEN'
    case 'RhHwRcLlZxek':
      return 'TLP-AMBER'
    case 'YpUZxVhYJlKg':
      return 'TLP-RED'
    case 'wFlYRDMW946M':
      return 'TLP-WHITE'
    default:
      break
  }
}

export const getTlcTooltip = (item) => {
  switch (item) {
    case 'wKBhLuFZ46y9':
      return 'Limited disclosure, restricted to the community.'
    case 'RhHwRcLlZxek':
      return 'Limited disclosure, restricted to participants’ organizations.'
    case 'YpUZxVhYJlKg':
      return 'Not for disclosure, restricted to participants only.'
    case 'wFlYRDMW946M':
      return 'Disclosure is not limited.'
    default:
      break
  }
}

export const getTlcName = (item) => {
  switch (item) {
    case 'wKBhLuFZ46y9':
      return 'TLP: GREEN'
    case 'RhHwRcLlZxek':
      return 'TLP: AMBER'
    case 'YpUZxVhYJlKg':
      return 'TLP: RED'
    case 'wFlYRDMW946M':
      return 'TLP: WHITE'
    default:
      break
  }
}

export const findCategory = (id) => {
  switch (id) {
    case 'Ps0SSyl7rVNe':
      return 'Malicious'
    case 'bEuAD1pdbRXF':
      return 'Non-Malicious'
    case 'NGLCc9UCxJvw':
      return 'Phishing'
    case 'Gwt67E1ftYtr':
      return 'Spam'
    default:
      return ''
  }
}
