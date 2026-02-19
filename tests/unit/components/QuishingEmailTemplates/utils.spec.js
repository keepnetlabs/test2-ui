import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'

describe('QuishingEmailTemplates utils', () => {
  it('exports expected template types', () => {
    expect(QUISHING_EMAIL_TEMPLATE_TYPES).toEqual({
      EMAIL: 'email',
      INDIVIDUAL_PRINTOUT: 'individual'
    })
  })
})
