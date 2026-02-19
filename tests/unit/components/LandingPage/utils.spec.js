import { MERGED_TEXTS_MAP, processTemplateWithCustomScripts } from '@/components/LandingPage/utils'

describe('LandingPage utils', () => {
  it('contains expected merge keys', () => {
    expect(MERGED_TEXTS_MAP['{CURRENT_DATE}']).toBeTruthy()
    expect(MERGED_TEXTS_MAP['{RANDOM_NUMBER_3_DIGITS}']).toBeTruthy()
    expect(MERGED_TEXTS_MAP['{USERDEPARTMENT}']).toBeTruthy()
  })

  it('returns fallback for invalid template input', () => {
    expect(processTemplateWithCustomScripts(null)).toEqual({
      customScripts: [],
      cleanTemplate: null,
      scriptsContent: ''
    })
  })

  it('extracts custom scripts and cleans template', () => {
    const html = `
      <div id="content">Hello</div>
      <script data-custom-landing-page-script="true" data-custom-landing-page-script-position="head">console.log('x')</script>
      <script data-custom-landing-page-script="true" src="https://cdn.example.com/app.js"></script>
    `
    const result = processTemplateWithCustomScripts(html)

    expect(result.customScripts).toHaveLength(2)
    expect(result.cleanTemplate).toContain('id="content"')
    expect(result.cleanTemplate).not.toContain('data-custom-landing-page-script')
    expect(result.scriptsContent).toContain('console.log')
    expect(result.scriptsContent).toContain('src="https://cdn.example.com/app.js"')
    expect(result.scriptsPlacement).toBe('head')
  })
})
