jest.mock('@/api/company', () => ({
  getTemplateTypes: jest.fn(),
  searchEmailTemplate: jest.fn()
}))

import { getTemplateTypes, searchEmailTemplate } from '@/api/company'
import { getEmailTypesAndEmailTemplates } from '@/components/IncidentResponder/utils'

describe('IncidentResponder utils (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles missing Suspicious Email template - uses undefined resourceId', async () => {
    const templateTypes = [
      { name: 'Other', resourceId: 'r-1' },
      { name: 'Different Template', resourceId: 'r-2' }
    ]

    getTemplateTypes.mockResolvedValue({ data: { data: templateTypes } })
    searchEmailTemplate.mockResolvedValue({ data: { data: [] } })

    const [searchResult, returnedTypes] = await getEmailTypesAndEmailTemplates()

    expect(returnedTypes).toEqual(templateTypes)
    expect(searchEmailTemplate).toHaveBeenCalled()
    expect(searchEmailTemplate.mock.calls[0][0].filter.FilterGroups[0].FilterItems[0].Value).toBe(
      undefined
    )
  })

  it('handles empty template types array', async () => {
    getTemplateTypes.mockResolvedValue({ data: { data: [] } })
    searchEmailTemplate.mockResolvedValue({ data: { data: [] } })

    const [searchResult, returnedTypes] = await getEmailTypesAndEmailTemplates()

    expect(returnedTypes).toEqual([])
    expect(searchEmailTemplate).toHaveBeenCalled()
  })
})
