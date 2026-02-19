import SystemUserModel from '@/components/SystemUsers/system-user-model'

describe('SystemUserModel', () => {
  it('initializes with expected defaults', () => {
    const model = new SystemUserModel()
    expect(model.firstName).toBe('')
    expect(model.lastName).toBe('')
    expect(model.email).toBe('')
    expect(model.roleResourceIdList).toEqual([])
    expect(model.statusId).toBe(1)
  })

  it('getFullName returns concatenated first and last name', () => {
    const model = new SystemUserModel()
    model.firstName = 'Jane'
    model.lastName = 'Doe'
    expect(model.getFullName()).toBe('Jane Doe')
  })
})
