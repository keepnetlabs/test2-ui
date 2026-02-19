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

  it('updates payload with report update type and returns combined result', async () => {
    const templateTypes = [
      { name: 'Another Type', resourceId: 'type-1' },
      { name: 'Suspicious Email Analysis Report Update', resourceId: 'target-99' }
    ]
    const searchResult = { data: { items: [{ id: 1 }] } }

    getTemplateTypes.mockResolvedValueOnce({ data: { data: templateTypes } })
    searchEmailTemplate.mockResolvedValueOnce(searchResult)

    const [emailTemplatesResponse, returnedTemplateTypes] = await getEmailTypesAndEmailTemplates()

    expect(getTemplateTypes).toHaveBeenCalledTimes(1)
    expect(searchEmailTemplate).toHaveBeenCalledTimes(1)
    expect(searchEmailTemplate.mock.calls[0][0].filter.FilterGroups[0].FilterItems[0].Value).toBe(
      'target-99'
    )
    expect(emailTemplatesResponse).toBe(searchResult)
    expect(returnedTemplateTypes).toEqual(templateTypes)
  })
})
