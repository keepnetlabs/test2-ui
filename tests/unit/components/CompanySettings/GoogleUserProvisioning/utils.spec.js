import { SYNC_SOURCE_TYPES, SYNC_METHOD_TYPES } from '@/components/Company Settings/GoogleUserProvisioning/utils'

describe('CompanySettings GoogleUserProvisioning utils', () => {
  it('exports sync source and method types', () => {
    expect(SYNC_SOURCE_TYPES).toEqual({
      GROUP: 'Group',
      ORGANIZATION: 'Organization'
    })
    expect(SYNC_METHOD_TYPES).toEqual({
      TARGET_USER: 'User',
      TARGET_GROUP: 'TargetGroup',
      SOURCE_GROUP: 'SourceGroup'
    })
  })
})
