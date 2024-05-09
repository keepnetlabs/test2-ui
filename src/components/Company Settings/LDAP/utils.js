export const defaultFieldMappings = [
  { text: 'Email', customFieldResourceId: 'Email', ldapResourceId: '' },
  { text: 'First Name', customFieldResourceId: 'FirstName', ldapResourceId: '' },
  { text: 'Last Name', customFieldResourceId: 'LastName', ldapResourceId: '' },
  { text: 'Phone Number', customFieldResourceId: 'PhoneNumber', ldapResourceId: '' },
  { text: 'Department', customFieldResourceId: 'Department', ldapResourceId: '' },
  { text: 'Time Zone', customFieldResourceId: 'TimeZoneId', ldapResourceId: '' }
]

export const getDefaultFieldMappingsWithCurrent = (defaultMapping, currentMapping) => {
  const mappingFields = new Map()
  defaultMapping.map((mapping) => mappingFields.set(mapping.customFieldResourceId, mapping))
  currentMapping.map((mapping) => {
    mappingFields.set(mapping.customFieldResourceId, {
      text:
        defaultMapping.find((dm) => dm.customFieldResourceId === mapping.customFieldResourceId)
          ?.text || mapping.customFieldResourceId,
      ...mapping
    })
  })
  return [...mappingFields.values()]
}
