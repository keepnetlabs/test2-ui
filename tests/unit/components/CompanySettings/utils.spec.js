import { MERGED_TEXTS_MAP, scrollToEmailTemplateContent } from '@/components/Company Settings/utils'

describe('Company Settings utils', () => {
  it('exports merged text map with expected keys', () => {
    expect(MERGED_TEXTS_MAP).toHaveProperty('{FULLNAME}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{TRAININGNAME}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{SURVEYNAME}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{Manuel_Check_Url}')
  })

  it('scrollToEmailTemplateContent scrolls target element when found', () => {
    const scrollIntoView = jest.fn()
    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue({
      scrollIntoView
    })

    scrollToEmailTemplateContent()

    expect(querySelectorSpy).toHaveBeenCalledWith('#email-template-content')
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'end',
      inline: 'end'
    })
    querySelectorSpy.mockRestore()
  })
})
