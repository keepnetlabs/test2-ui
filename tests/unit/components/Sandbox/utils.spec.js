import {
  integrationTypesEnum,
  scanTypesEnum,
  createAxiosPayloadForSandboxStats,
  createAxiosPayloadForSandboxLogs
} from '@/components/Sandbox/utils'

describe('Sandbox utils', () => {
  it('exports integration and scan enums', () => {
    expect(integrationTypesEnum).toHaveLength(7)
    expect(scanTypesEnum).toHaveLength(4)
    expect(integrationTypesEnum[0].name).toBe('VirusTotal')
  })

  it('creates stats payload with include operators when values are provided', () => {
    const payload = createAxiosPayloadForSandboxStats('comp1', 'int1', {
      Operator: '>=',
      Value: '2024-01-01'
    })

    const items = payload.FilterSummary.FilterGroups[0].FilterItems
    expect(items[0]).toEqual({
      Value: 'int1',
      FieldName: 'AnalysisEngineTypeId',
      Operator: 'Include'
    })
    expect(items[1].Operator).toBe('Include')
    expect(items[3]).toEqual({
      FieldName: 'CreateTime',
      Operator: '>=',
      Value: '2024-01-01'
    })
  })

  it('creates logs payload and handles non-array date', () => {
    const payload = createAxiosPayloadForSandboxLogs('', '', null)
    const items = payload.filter.FilterGroups[0].FilterItems
    expect(items[0].Operator).toBe('Contains')
    expect(items[3]).toEqual({
      FieldName: 'CreateTime',
      Operator: 'Contains',
      Value: ''
    })
  })

  it('throws for array date in logs payload due to invalid bodyData path', () => {
    expect(() =>
      createAxiosPayloadForSandboxLogs('', '', [
        { Operator: '>=', Value: '2024-01-01' },
        { Operator: '<=', Value: '2024-01-31' }
      ])
    ).toThrow()
  })
})
