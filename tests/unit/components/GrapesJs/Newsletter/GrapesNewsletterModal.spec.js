jest.mock('grapesjs', () => ({
  init: jest.fn(() => ({}))
}))
jest.mock('grapesjs-blocks-basic', () => ({}))
jest.mock('grapesjs-preset-newsletter', () => ({}))
jest.mock('grapesjs-preset-webpage', () => ({}))
jest.mock('grapesjs-plugin-forms', () => ({}))
jest.mock('grapesjs-style-bg', () => ({}))
jest.mock('grapick/dist/grapick.min.css', () => ({}))
jest.mock('grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css', () => ({}))
jest.mock('grapesjs/dist/css/grapes.min.css', () => ({}))

jest.mock('@/components/GrapesJs/Newsletter/utils', () => ({
  getComponentTypeDefaultParams: jest.fn(() => ({})),
  getTraits: jest.fn(() => ['trait-1']),
  setBlocksCategories: jest.fn()
}))

import { getTraits } from '@/components/GrapesJs/Newsletter/utils'
import GrapesNewsletterModal from '@/components/GrapesJs/Newsletter/GrapesNewsletterModal.vue'

describe('GrapesNewsletterModal.vue (mirrored spec)', () => {
  it('has expected component name', () => {
    expect(GrapesNewsletterModal.name).toBe('GrapesNewsletterModal')
  })

  it('created calls image loader and sets edited scripts in edit mode', () => {
    const ctx = {
      isEdit: true,
      customHeadScripts: '<script>1</script>',
      editedCustomHeadScripts: '',
      callForImages: jest.fn()
    }

    GrapesNewsletterModal.created.call(ctx)

    expect(ctx.callForImages).toHaveBeenCalled()
    expect(ctx.editedCustomHeadScripts).toBe('<script>1</script>')
  })

  it('mounted initializes merged texts, traits and editor', () => {
    const ctx = {
      setMergedTextsForLinks: jest.fn(),
      setTraits: jest.fn(),
      setGrapesEditor: jest.fn()
    }

    GrapesNewsletterModal.mounted.call(ctx)

    expect(ctx.setMergedTextsForLinks).toHaveBeenCalled()
    expect(ctx.setTraits).toHaveBeenCalled()
    expect(ctx.setGrapesEditor).toHaveBeenCalled()
  })

  it('setMergedTextsForLinks appends only URL-capable blocks', () => {
    const ctx = {
      isAttachmentBasedTemplate: false,
      blockManagerComponents: {
        '{PHISHINGURL}': { label: 'Phishing URL', attributes: { isUrl: true } },
        plainText: { label: 'Plain', attributes: { isUrl: false } },
        noAttrs: { label: 'No attrs' }
      },
      urlMergedTexts: [{ value: '', name: 'No Merged Text' }]
    }

    GrapesNewsletterModal.methods.setMergedTextsForLinks.call(ctx)

    expect(ctx.urlMergedTexts).toContainEqual(
      expect.objectContaining({ value: '{PHISHINGURL}', name: 'Phishing URL' })
    )
    expect(ctx.urlMergedTexts.length).toBe(2)
  })

  it('setTraits delegates to getTraits with current urlMergedTexts', () => {
    const ctx = {
      urlMergedTexts: [{ value: '{A}', name: 'A' }],
      traits: []
    }

    GrapesNewsletterModal.methods.setTraits.call(ctx)

    expect(getTraits).toHaveBeenCalledWith([{ value: '{A}', name: 'A' }])
    expect(ctx.traits).toEqual(['trait-1'])
  })

  it('destroyEditor calls editor.destroy', () => {
    const ctx = { editor: { destroy: jest.fn() } }

    GrapesNewsletterModal.methods.destroyEditor.call(ctx)

    expect(ctx.editor.destroy).toHaveBeenCalled()
  })
})
