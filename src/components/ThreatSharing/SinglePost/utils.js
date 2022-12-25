export const getTlcClass = (item) => {
  if (item === 'wKBhLuFZ46y9') return 'TLP-GREEN'
  if (item === 'RhHwRcLlZxek') return 'TLP-AMBER'
  if (item === 'YpUZxVhYJlKg') return 'TLP-RED'
  if (item === 'wFlYRDMW946M') return 'TLP-WHITE'
  return ''
}

export const getTlcTooltip = (item) => {
  if (item === 'wKBhLuFZ46y9') return 'Limited disclosure, restricted to the community.'
  if (item === 'RhHwRcLlZxek')
    return 'Limited disclosure, restricted to participants’ organizations.'
  if (item === 'YpUZxVhYJlKg') return 'Not for disclosure, restricted to participants only.'
  if (item === 'wFlYRDMW946M') return 'Disclosure is not limited.'
  return ''
}

export const getTlcName = (item) => {
  if (item === 'wKBhLuFZ46y9') return 'TLP: GREEN'
  if (item === 'RhHwRcLlZxek') return 'TLP: AMBER'
  if (item === 'YpUZxVhYJlKg') return 'TLP: RED'
  if (item === 'wFlYRDMW946M') return 'TLP: WHITE'
  return ''
}

export const findCategory = (id) => {
  if (id === 'Ps0SSyl7rVNe') return 'Malicious'
  if (id === 'bEuAD1pdbRXF') return 'Non-Malicious'
  if (id === 'NGLCc9UCxJvw') return 'Phishing'
  if (id === 'Gwt67E1ftYtr') return 'Spam'
  return ''
}

export const getCategories = () => [
  {
    resourceId: 'Ps0SSyl7rVNe',
    name: 'Malicious'
  },
  {
    resourceId: 'bEuAD1pdbRXF',
    name: 'Non-Malicious'
  },
  {
    resourceId: 'NGLCc9UCxJvw',
    name: 'Phishing'
  },
  {
    resourceId: 'Gwt67E1ftYtr',
    name: 'Spam'
  }
]
