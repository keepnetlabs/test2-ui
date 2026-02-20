import { MERGED_TEXTS_MAP, processTemplateWithCustomScripts } from '@/components/LandingPage/utils'

describe('LandingPage utils', () => {
  it('contains expected merged text keys', () => {
    expect(MERGED_TEXTS_MAP).toHaveProperty('{FULLNAME}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{PHISHINGURL}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{USERLANGUAGE}')
    expect(MERGED_TEXTS_MAP).toHaveProperty('{USERDEPARTMENT}')
  })

  it('returns fallback output for invalid template values', () => {
    expect(processTemplateWithCustomScripts(null)).toEqual({
      customScripts: [],
      cleanTemplate: null,
      scriptsContent: ''
    })

    expect(processTemplateWithCustomScripts(123)).toEqual({
      customScripts: [],
      cleanTemplate: 123,
      scriptsContent: ''
    })
  })

  it('extracts inline custom scripts and removes them from clean template', () => {
    const template = `
      <div>
        <h1>Title</h1>
        <script data-custom-landing-page-script="true">console.log('x')</script>
      </div>
    `

    const result = processTemplateWithCustomScripts(template)

    expect(result.customScripts).toHaveLength(1)
    expect(result.customScripts[0].content).toContain("console.log('x')")
    expect(result.cleanTemplate).toContain('<h1>Title</h1>')
    expect(result.cleanTemplate).not.toContain('data-custom-landing-page-script="true"')
    expect(result.scriptsContent).toContain('<script>')
    expect(result.scriptsPlacement).toBe('body-start')
  })

  it('uses custom scripts placement attribute and preserves non-custom scripts', () => {
    const template = `
      <div>
        <script src="https://cdn.example.com/a.js"
                data-custom-landing-page-script="true"
                data-custom-landing-page-script-position="head-end"></script>
        <script>window.keepThisScript = true</script>
      </div>
    `

    const result = processTemplateWithCustomScripts(template)

    expect(result.customScripts).toHaveLength(1)
    expect(result.customScripts[0].src).toContain('cdn.example.com/a.js')
    expect(result.scriptsPlacement).toBe('head-end')
    expect(result.cleanTemplate).toContain('window.keepThisScript = true')
    expect(result.scriptsContent).toContain('src="https://cdn.example.com/a.js"')
  })

  it('returns empty scriptsContent when custom script has no src and no content', () => {
    const template = `
      <div>
        <script data-custom-landing-page-script="true"></script>
      </div>
    `

    const result = processTemplateWithCustomScripts(template)

    expect(result.customScripts).toHaveLength(1)
    expect(result.customScripts[0].src).toBe(null)
    expect(result.customScripts[0].content).toBe('')
    expect(result.scriptsContent).toBe('')
  })

  it('extracts multiple custom scripts and joins generated script tags', () => {
    const template = `
      <div>
        <script data-custom-landing-page-script="true">window.a = 1</script>
        <script data-custom-landing-page-script="true" src="https://cdn.example.com/b.js"></script>
      </div>
    `

    const result = processTemplateWithCustomScripts(template)

    expect(result.customScripts).toHaveLength(2)
    expect(result.cleanTemplate).not.toContain('data-custom-landing-page-script="true"')
    expect(result.scriptsContent).toContain('<script>window.a = 1</script>')
    expect(result.scriptsContent).toContain('src="https://cdn.example.com/b.js"')
    expect(result.scriptsContent).toContain('\n')
  })
})
