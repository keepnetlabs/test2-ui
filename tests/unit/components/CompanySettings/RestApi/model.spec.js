import RestApiModel from '@/components/Company Settings/RestApi/model'

describe('RestApiModel', () => {
  it('initializes with expected defaults', () => {
    const model = new RestApiModel()

    expect(model.name).toBe('')
    expect(model.clientId).toBe('')
    expect(model.clientSecret).toBe('')
    expect(model.status).toBe(true)
    expect(model.statusId).toBe(1)
    expect(model.hasIpAddressRestriction).toBe(false)
    expect(model.allowedIpAddresses).toEqual([{ value: '', name: '' }])
    expect(model.roleResourceIdList).toEqual([])
  })
})
