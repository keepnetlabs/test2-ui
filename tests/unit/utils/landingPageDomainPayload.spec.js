import {
  mapDomainFormRecords,
  buildDomainChangePayload
} from '@/utils/landingPageDomainPayload'

describe('mapDomainFormRecords', () => {
  it('maps raw form-details domain records into the ranking/select shape', () => {
    const raw = [
      {
        id: 12,
        domain: 'acme-bank-login.com',
        urlSchemaType: 'https',
        urlSchemaTypeId: 2,
        isStopBotActivity: true
      }
    ]
    expect(mapDomainFormRecords(raw)).toEqual([
      {
        text: 'acme-bank-login.com',
        value: '12',
        extraDatas: [
          { text: 'https', value: '2' },
          { text: true, value: true }
        ]
      }
    ])
  })

  it('is null-safe for missing id / schema and non-array input', () => {
    expect(mapDomainFormRecords(null)).toEqual([])
    expect(mapDomainFormRecords(undefined)).toEqual([])
    const [record] = mapDomainFormRecords([{ domain: 'x.com' }])
    expect(record.value).toBe('')
    expect(record.extraDatas[0].value).toBe('')
  })
})

describe('buildDomainChangePayload', () => {
  const baseEntity = () => ({
    resourceId: 'lp-1',
    name: 'Acme Bank',
    description: 'secure login',
    methodTypeId: 1,
    difficultyTypeId: 2,
    languageTypeResourceId: 'en',
    landingPages: [{ name: 'Page 1', content: '<html>...</html>', order: 0, languages: [] }],
    domainRecordId: '5',
    urlSchemaTypeId: '1',
    subDomain: 'login',
    availableForList: [
      { typeName: 'SpecificCompany', targetName: 'Acme', targetResourceId: 'r1' }
    ]
  })

  it('sets the new domainRecordId as a string', () => {
    const payload = buildDomainChangePayload(baseEntity(), 12)
    expect(payload.domainRecordId).toBe('12')
  })

  it('flattens the nested phishingLink object away (PUT uses top-level fields)', () => {
    const entity = {
      ...baseEntity(),
      phishingLink: { subDomain: 'nested-sub', urlSchemaTypeId: '3', domainRecordId: '99' }
    }
    const payload = buildDomainChangePayload(entity, '7')
    expect(payload.phishingLink).toBeUndefined()
    // nested wins over base for carried-over fields...
    expect(payload.subDomain).toBe('nested-sub')
    // ...but the requested domain change overrides everything
    expect(payload.domainRecordId).toBe('7')
  })

  it('follows the chosen domain schema when single-protocol, keeps it when "both"/missing', () => {
    const single = buildDomainChangePayload(baseEntity(), '12', { text: 'https', value: '2' })
    expect(single.urlSchemaTypeId).toBe('2')

    const both = buildDomainChangePayload(baseEntity(), '12', { text: 'Both', value: '3' })
    expect(both.urlSchemaTypeId).toBe('1') // unchanged

    const none = buildDomainChangePayload(baseEntity(), '12')
    expect(none.urlSchemaTypeId).toBe('1') // unchanged
  })

  it('re-derives availableForRequests from availableForList and drops the list', () => {
    const payload = buildDomainChangePayload(baseEntity(), '12')
    expect(payload.availableForList).toBeUndefined()
    expect(payload.availableForRequests).toEqual([{ resourceId: 'r1', type: 'SpecificCompany' }])
  })

  it('preserves landingPages and unrelated fields verbatim', () => {
    const entity = baseEntity()
    const payload = buildDomainChangePayload(entity, '12')
    expect(payload.landingPages).toEqual(entity.landingPages)
    expect(payload.name).toBe('Acme Bank')
    expect(payload.methodTypeId).toBe(1)
    expect(payload.resourceId).toBe('lp-1')
  })

  it('is null-safe for a missing entity', () => {
    const payload = buildDomainChangePayload(null, '12')
    expect(payload.domainRecordId).toBe('12')
  })
})
