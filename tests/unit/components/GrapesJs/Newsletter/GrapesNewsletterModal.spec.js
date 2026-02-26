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

  it('created does not mutate edited scripts when not in edit mode', () => {
    const ctx = {
      isEdit: false,
      customHeadScripts: '<script>2</script>',
      editedCustomHeadScripts: 'old',
      callForImages: jest.fn()
    }

    GrapesNewsletterModal.created.call(ctx)

    expect(ctx.callForImages).toHaveBeenCalled()
    expect(ctx.editedCustomHeadScripts).toBe('old')
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

  it('setMergedTextsForLinks removes {PHISHINGURL} when attachment-based template', () => {
    const ctx = {
      isAttachmentBasedTemplate: true,
      blockManagerComponents: {
        '{PHISHINGURL}': { label: 'Phishing URL', attributes: { isUrl: true } },
        '{TRAININGURL}': { label: 'Training URL', attributes: { isUrl: true } }
      },
      urlMergedTexts: [{ value: '', name: 'No Merged Text' }]
    }

    GrapesNewsletterModal.methods.setMergedTextsForLinks.call(ctx)

    expect(ctx.urlMergedTexts).not.toContainEqual(
      expect.objectContaining({ value: '{PHISHINGURL}' })
    )
    expect(ctx.urlMergedTexts).toContainEqual(
      expect.objectContaining({ value: '{TRAININGURL}', name: 'Training URL' })
    )
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

  it('handleHeadScriptsDialogStatus clears codeMirror and container when closing', () => {
    const ctx = {
      showHeadScriptsDialog: true,
      codeMirrorViewer: { dummy: true },
      $refs: { codeMirrorContainer: { innerHTML: 'filled' } }
    }

    GrapesNewsletterModal.methods.handleHeadScriptsDialogStatus.call(ctx, false)

    expect(ctx.showHeadScriptsDialog).toBe(false)
    expect(ctx.codeMirrorViewer).toBe(null)
    expect(ctx.$refs.codeMirrorContainer.innerHTML).toBe('')
  })

  it('handleHeadScriptsDialogStatus leaves codeMirror untouched when opening', () => {
    const viewer = { dummy: true }
    const ctx = {
      showHeadScriptsDialog: false,
      codeMirrorViewer: viewer,
      $refs: { codeMirrorContainer: { innerHTML: 'filled' } }
    }

    GrapesNewsletterModal.methods.handleHeadScriptsDialogStatus.call(ctx, true)

    expect(ctx.showHeadScriptsDialog).toBe(true)
    expect(ctx.codeMirrorViewer).toBe(viewer)
    expect(ctx.$refs.codeMirrorContainer.innerHTML).toBe('filled')
  })

  it('handleHeadScriptsSave emits updates and clears dialog/editor state', () => {
    const emit = jest.fn()
    const ctx = {
      codeMirrorViewer: { getValue: jest.fn(() => '<script>abc</script>') },
      customHeadScriptsPlacementValue: 'body-end',
      currentPageIndex: 2,
      showHeadScriptsDialog: true,
      $emit: emit,
      $refs: { codeMirrorContainer: { innerHTML: 'filled' } }
    }

    GrapesNewsletterModal.methods.handleHeadScriptsSave.call(ctx)

    expect(emit).toHaveBeenCalledWith('update:customHeadScripts', '<script>abc</script>')
    expect(emit).toHaveBeenCalledWith(
      'on-custom-head-scripts-change',
      '<script>abc</script>',
      2
    )
    expect(emit).toHaveBeenCalledWith(
      'on-custom-head-scripts-placement-change',
      'body-end',
      2
    )
    expect(ctx.showHeadScriptsDialog).toBe(false)
    expect(ctx.codeMirrorViewer).toBe(null)
    expect(ctx.$refs.codeMirrorContainer.innerHTML).toBe('')
  })

  it('handleHeadScriptsSave still emits placement when codeMirror is missing', () => {
    const emit = jest.fn()
    const ctx = {
      codeMirrorViewer: null,
      customHeadScriptsPlacementValue: 'body-start',
      currentPageIndex: 0,
      showHeadScriptsDialog: true,
      $emit: emit,
      $refs: { codeMirrorContainer: { innerHTML: 'filled' } }
    }

    GrapesNewsletterModal.methods.handleHeadScriptsSave.call(ctx)

    expect(emit).not.toHaveBeenCalledWith('update:customHeadScripts', expect.anything())
    expect(emit).toHaveBeenCalledWith(
      'on-custom-head-scripts-placement-change',
      'body-start',
      0
    )
    expect(ctx.showHeadScriptsDialog).toBe(false)
  })

  it('handleHeadScriptsCancel clears dialog/editor state safely', () => {
    const ctx = {
      showHeadScriptsDialog: true,
      codeMirrorViewer: { dummy: true },
      $refs: { codeMirrorContainer: { innerHTML: 'filled' } }
    }

    GrapesNewsletterModal.methods.handleHeadScriptsCancel.call(ctx)

    expect(ctx.showHeadScriptsDialog).toBe(false)
    expect(ctx.codeMirrorViewer).toBe(null)
    expect(ctx.$refs.codeMirrorContainer.innerHTML).toBe('')
  })

  it('getCommentElementByComponent returns matching comment sibling when present', () => {
    const commentModel = { attributes: { type: 'comment' } }
    const ctxComponent = {
      parent: () => ({
        components: () => ({
          models: [{ attributes: { type: 'text' } }, commentModel]
        })
      })
    }

    const result = GrapesNewsletterModal.methods.getCommentElementByComponent.call(
      {},
      ctxComponent
    )
    expect(result).toBe(commentModel)
  })

  it('getCommentElementByComponent returns null when no parent/components exists', () => {
    const result1 = GrapesNewsletterModal.methods.getCommentElementByComponent.call({}, null)
    const result2 = GrapesNewsletterModal.methods.getCommentElementByComponent.call(
      {},
      { parent: () => null }
    )

    expect(result1).toBe(null)
    expect(result2).toBe(null)
  })

  it('getGrapesEditorContent returns empty string when email command throws', () => {
    const ctx = {
      editor: {
        select: jest.fn(),
        getWrapper: jest.fn(() => 'wrapper'),
        Commands: {
          run: jest.fn(() => {
            throw new Error('boom')
          })
        }
      },
      templateType: 'email'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(result).toBe('')
  })
})
