jest.mock('@/api/company', () => ({
  getTemplateTypes: jest.fn(),
  searchEmailTemplate: jest.fn()
}))

import { getTemplateTypes, searchEmailTemplate } from '@/api/company'
import { getEmailTypesAndEmailTemplates } from '@/components/IncidentResponder/utils'

describe('IncidentResponder utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads template types and searches template with matching resource id', async () => {
    const templateTypes = [
      { name: 'Other', resourceId: 'r-1' },
      { name: 'Suspicious Email Analysis Report Update', resourceId: 'r-2' }
    ]

    getTemplateTypes.mockResolvedValue({ data: { data: templateTypes } })
    searchEmailTemplate.mockResolvedValue({ data: { data: [{ resourceId: 'tpl-1' }] } })

    const [searchResult, returnedTypes] = await getEmailTypesAndEmailTemplates()

    expect(searchResult).toEqual({ data: { data: [{ resourceId: 'tpl-1' }] } })
    expect(returnedTypes).toEqual(templateTypes)
    expect(searchEmailTemplate).toHaveBeenCalledTimes(1)
    expect(searchEmailTemplate.mock.calls[0][0].filter.FilterGroups[0].FilterItems[0].Value).toBe('r-2')
  })
})
