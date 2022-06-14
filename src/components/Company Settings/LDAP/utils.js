export const defaultFieldMappings = [
  { customFieldResourceId: 'Email', ldapResourceId: '' },
  { customFieldResourceId: 'FirstName', ldapResourceId: '' },
  { customFieldResourceId: 'LastName', ldapResourceId: '' },
  { customFieldResourceId: 'Department', ldapResourceId: '' }
]

export const getDefaultFieldMappingsWithCurrent = (defaultMapping, currentMapping) => {
  const mappingFields = new Map()
  defaultMapping.map((mapping) => mappingFields.set(mapping.customFieldResourceId, mapping))
  currentMapping.map((mapping) => {
    mappingFields.set(mapping.customFieldResourceId, mapping)
  })
  return [...mappingFields.values()]
}
