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

jest.mock('@/api/file', () => ({
  getUploadedFiles: jest.fn(),
  uploadFiles: jest.fn(),
  deleteFiles: jest.fn()
}))

jest.mock('@/api/threatSharing', () => ({
  uploadEmlOrMsg: jest.fn()
}))

import { getTraits } from '@/components/GrapesJs/Newsletter/utils'
import * as fileApi from '@/api/file'
import * as threatSharingApi from '@/api/threatSharing'
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

  it('getGrapesEditorContent returns juiced HTML when email template succeeds', () => {
    const runCmd = jest.fn(() => '<html>juiced</html>')
    const ctx = {
      editor: {
        select: jest.fn(),
        getWrapper: jest.fn(() => 'wrapper'),
        Commands: { run: runCmd }
      },
      templateType: 'email'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(runCmd).toHaveBeenCalledWith('get-html-juiced')
    expect(result).toBe('<html>juiced</html>')
  })

  it('getGrapesEditorContent returns landing page HTML when templateType is not email', () => {
    const ctx = {
      editor: {
        select: jest.fn(),
        getHtml: jest.fn(() => '<body>content</body>'),
        getCss: jest.fn(() => 'p { color: red; }'),
        getWrapper: jest.fn(() => 'wrapper')
      },
      templateType: 'landing',
      isProtocolHttp: true,
      isEdit: false,
      editedCustomHeadScripts: '',
      customHeadScripts: '',
      customHeadScriptsPlacement: 'body-start'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(typeof result).toBe('string')
    expect(result).toContain('<html>')
    expect(result).toContain('<head>')
    expect(result).toContain('<style>')
    expect(result).toContain('p { color: red; }')
    expect(result).toContain('content')
  })

  it('getGrapesEditorContent adds Content-Security-Policy meta when not isProtocolHttp', () => {
    const ctx = {
      editor: {
        select: jest.fn(),
        getHtml: jest.fn(() => '<body>x</body>'),
        getCss: jest.fn(() => ''),
        getWrapper: jest.fn(() => 'wrapper')
      },
      templateType: 'landing',
      isProtocolHttp: false,
      isEdit: false,
      editedCustomHeadScripts: '',
      customHeadScripts: '',
      customHeadScriptsPlacement: 'body-start'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(result).toContain('Content-Security-Policy')
    expect(result).toContain('upgrade-insecure-requests')
  })

  it('getGrapesEditorContent inserts custom scripts at body-end when placement is body-end', () => {
    const ctx = {
      editor: {
        select: jest.fn(),
        getHtml: jest.fn(() => '<body>content</body>'),
        getCss: jest.fn(() => ''),
        getWrapper: jest.fn(() => 'wrapper')
      },
      templateType: 'landing',
      isProtocolHttp: true,
      isEdit: false,
      editedCustomHeadScripts: '',
      customHeadScripts: '<script>console.log(1)</script>',
      customHeadScriptsPlacement: 'body-end'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(result).toContain('console.log(1)')
    expect(result).toContain('data-custom-landing-page-script="true"')
    expect(result).toContain('data-custom-landing-page-script-position="body-end"')
  })

  it('getGrapesEditorContent inserts custom scripts at body-start when placement is body-start', () => {
    const ctx = {
      editor: {
        select: jest.fn(),
        getHtml: jest.fn(() => '<body>content</body>'),
        getCss: jest.fn(() => ''),
        getWrapper: jest.fn(() => 'wrapper')
      },
      templateType: 'landing',
      isProtocolHttp: true,
      isEdit: false,
      editedCustomHeadScripts: '',
      customHeadScripts: '<script>alert(1)</script>',
      customHeadScriptsPlacement: 'body-start'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(result).toContain('alert(1)')
    expect(result).toContain('data-custom-landing-page-script-position="body-start"')
  })

  it('getGrapesEditorContent skips custom scripts when customHeadScripts is empty or whitespace', () => {
    const ctx = {
      editor: {
        select: jest.fn(),
        getHtml: jest.fn(() => '<body>x</body>'),
        getCss: jest.fn(() => ''),
        getWrapper: jest.fn(() => 'wrapper')
      },
      templateType: 'landing',
      isProtocolHttp: true,
      isEdit: false,
      editedCustomHeadScripts: '',
      customHeadScripts: '   ',
      customHeadScriptsPlacement: 'body-start'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(result).not.toContain('data-custom-landing-page-script')
  })

  it('calculateOutlookWidth adds 12 when width < 65', () => {
    const result = GrapesNewsletterModal.methods.calculateOutlookWidth.call({}, 50)
    expect(result).toBe(62)
  })

  it('calculateOutlookWidth adds 14 when width < 95', () => {
    const result = GrapesNewsletterModal.methods.calculateOutlookWidth.call({}, 80)
    expect(result).toBe(94)
  })

  it('calculateOutlookWidth adds 18 when width < 140', () => {
    const result = GrapesNewsletterModal.methods.calculateOutlookWidth.call({}, 120)
    expect(result).toBe(138)
  })

  it('calculateOutlookWidth adds 22 when width >= 140', () => {
    const result = GrapesNewsletterModal.methods.calculateOutlookWidth.call({}, 150)
    expect(result).toBe(172)
  })

  it('calculateOutlookWidth uses 0 when rawWidth is undefined', () => {
    const result = GrapesNewsletterModal.methods.calculateOutlookWidth.call({}, undefined)
    expect(result).toBe(12)
  })

  it('getMergeTagsForDropdown returns non-image merged-text blocks sorted by label', () => {
    const ctx = {
      blockManagerComponents: {
        '{Z}': { attributes: { class: 'merged-text' }, label: 'Zebra', type: 'text' },
        '{A}': { attributes: { class: 'merged-text' }, label: 'Alpha' },
        '{IMG}': { attributes: { class: 'merged-text' }, type: 'image' },
        plain: { attributes: {} }
      }
    }

    const result = GrapesNewsletterModal.methods.getMergeTagsForDropdown.call(ctx)

    expect(result).toHaveLength(2)
    expect(result[0].label).toBe('Alpha')
    expect(result[1].label).toBe('Zebra')
    expect(result).not.toContainEqual(expect.objectContaining({ key: '{IMG}' }))
    expect(result).not.toContainEqual(expect.objectContaining({ key: 'plain' }))
  })

  it('getMergeTagsForDropdown skips blocks with content.type === image', () => {
    const ctx = {
      blockManagerComponents: {
        '{IMG2}': {
          attributes: { class: 'merged-text' },
          content: { type: 'image' },
          label: 'Image'
        }
      }
    }

    const result = GrapesNewsletterModal.methods.getMergeTagsForDropdown.call(ctx)

    expect(result).toHaveLength(0)
  })

  it('getMergeTagsForDropdown sets isUrl from attributes', () => {
    const ctx = {
      blockManagerComponents: {
        '{URL}': {
          attributes: { class: 'merged-text', isUrl: true },
          label: 'URL'
        }
      }
    }

    const result = GrapesNewsletterModal.methods.getMergeTagsForDropdown.call(ctx)

    expect(result[0].isUrl).toBe(true)
  })

  it('setMergedTextsForLinks returns early when JSON parse fails', () => {
    const circular = { x: 1 }
    circular.self = circular
    const ctx = {
      isAttachmentBasedTemplate: false,
      blockManagerComponents: circular,
      urlMergedTexts: [{ value: '', name: 'No Merged Text' }]
    }

    GrapesNewsletterModal.methods.setMergedTextsForLinks.call(ctx)

    expect(ctx.urlMergedTexts).toHaveLength(1)
  })

  it('getCommentElementByComponent returns null when models has no comment type', () => {
    const ctxComponent = {
      parent: () => ({
        components: () => ({
          models: [{ attributes: { type: 'text' } }, { attributes: { type: 'span' } }]
        })
      })
    }

    const result = GrapesNewsletterModal.methods.getCommentElementByComponent.call(
      {},
      ctxComponent
    )

    expect(result).toBe(null)
  })

  it('getCommentElementByComponent returns null when parent returns object with no components', () => {
    const ctxComponent = {
      parent: () => ({ components: () => null })
    }

    const result = GrapesNewsletterModal.methods.getCommentElementByComponent.call(
      {},
      ctxComponent
    )

    expect(result).toBe(null)
  })

  it('renderAssetsToAssetsManager does nothing when editor is null', () => {
    const ctx = { editor: null }
    expect(() =>
      GrapesNewsletterModal.methods.renderAssetsToAssetsManager.call(ctx, [])
    ).not.toThrow()
  })

  it('renderAssetsToAssetsManager does nothing when AssetManager has no render', () => {
    const ctx = {
      editor: {
        AssetManager: {}
      }
    }
    expect(() =>
      GrapesNewsletterModal.methods.renderAssetsToAssetsManager.call(ctx, [])
    ).not.toThrow()
  })

  it('openHeadScriptsEditor sets dialog state and placement value', () => {
    const ctx = {
      showHeadScriptsDialog: false,
      customHeadScriptsPlacement: 'body-end',
      customHeadScriptsPlacementValue: 'body-start',
      $nextTick: jest.fn((cb) => cb && cb()),
      initializeCodeMirror: jest.fn()
    }

    GrapesNewsletterModal.methods.openHeadScriptsEditor.call(ctx)

    expect(ctx.showHeadScriptsDialog).toBe(true)
    expect(ctx.customHeadScriptsPlacementValue).toBe('body-end')
    expect(ctx.initializeCodeMirror).toHaveBeenCalled()
  })

  it('setMergedTextsForLinks skips blocks without attributes', () => {
    const ctx = {
      isAttachmentBasedTemplate: false,
      blockManagerComponents: {
        noAttrs: { label: 'No attrs' },
        withUrl: { label: 'URL', attributes: { isUrl: true } }
      },
      urlMergedTexts: [{ value: '', name: 'No Merged Text' }]
    }

    GrapesNewsletterModal.methods.setMergedTextsForLinks.call(ctx)

    expect(ctx.urlMergedTexts).toContainEqual(
      expect.objectContaining({ value: 'withUrl', name: 'URL' })
    )
    expect(ctx.urlMergedTexts).not.toContainEqual(
      expect.objectContaining({ value: 'noAttrs' })
    )
  })

  it('changeEditorComponentFunction dispatches snackbar when setComponents throws', () => {
    const dispatch = jest.fn()
    const originalSetComponents = jest.fn(() => {
      throw new Error('Parse error')
    })
    const editor = {
      setComponents: originalSetComponents,
      $store: { dispatch }
    }
    const ctx = { editor }

    GrapesNewsletterModal.methods.changeEditorComponentFunction.call(ctx)

    const wrapped = ctx.editor.setComponents
    expect(typeof wrapped).toBe('function')
    wrapped.call(editor, 'bad-html')

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      color: expect.any(String),
      message: expect.stringContaining('Parse error')
    })
  })

  it('changeEditorComponentFunction calls original when no error', () => {
    const originalSetComponents = jest.fn()
    const ctx = {
      editor: { setComponents: originalSetComponents }
    }

    GrapesNewsletterModal.methods.changeEditorComponentFunction.call(ctx)

    ctx.editor.setComponents('<div>ok</div>')
    expect(originalSetComponents).toHaveBeenCalledWith('<div>ok</div>')
  })

  it('uploadFile calls getGrapesWebModalDraw on success', async () => {
    threatSharingApi.uploadEmlOrMsg.mockResolvedValue({
      data: { data: { body: '<html>parsed</html>' } }
    })
    const getGrapesWebModalDraw = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      msgEmlFile: new File([''], 'test.eml'),
      getGrapesWebModalDraw,
      $store: { dispatch }
    }

    await GrapesNewsletterModal.methods.uploadFile.call(ctx, ctx.msgEmlFile)

    expect(threatSharingApi.uploadEmlOrMsg).toHaveBeenCalledWith(ctx.msgEmlFile)
    expect(getGrapesWebModalDraw).toHaveBeenCalledWith('<html>parsed</html>')
  })

  it('uploadFile dispatches snackbar on error', async () => {
    threatSharingApi.uploadEmlOrMsg.mockRejectedValue(new Error('Upload failed'))
    const dispatch = jest.fn()
    const ctx = {
      msgEmlFile: new File([''], 'test.eml'),
      getGrapesWebModalDraw: jest.fn(),
      $store: { dispatch }
    }

    GrapesNewsletterModal.methods.uploadFile.call(ctx, ctx.msgEmlFile)
    await Promise.resolve().then(() => {})

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      color: expect.any(String),
      message: 'Error when getting details of uploaded file'
    })
  })

  it('callForImages adds assets and renders when editor has AssetManager', async () => {
    const addFn = jest.fn()
    const renderFn = jest.fn()
    fileApi.getUploadedFiles.mockResolvedValue({
      data: {
        data: [
          { originalName: 'img1.png', previewLink: '/preview/1', resourceId: 'r1' }
        ]
      }
    })
    const ctx = {
      editor: {
        AssetManager: { add: addFn }
      },
      renderAssetsToAssetsManager: renderFn
    }

    GrapesNewsletterModal.methods.callForImages.call(ctx)

    await Promise.resolve()

    expect(fileApi.getUploadedFiles).toHaveBeenCalled()
    expect(addFn).toHaveBeenCalled()
    expect(renderFn).toHaveBeenCalled()
  })

  it('callForImages handles getUploadedFiles rejection silently', async () => {
    fileApi.getUploadedFiles.mockRejectedValue(new Error('Network error'))
    const ctx = { editor: null }

    GrapesNewsletterModal.methods.callForImages.call(ctx)

    await Promise.resolve().catch(() => {})

    expect(fileApi.getUploadedFiles).toHaveBeenCalled()
  })

  it('callForImages skips assetManager.add when add is not a function', async () => {
    fileApi.getUploadedFiles.mockResolvedValue({
      data: { data: [{ originalName: 'x.png', previewLink: '/p', resourceId: 'r1' }] }
    })
    const renderFn = jest.fn()
    const ctx = {
      editor: { AssetManager: {} },
      renderAssetsToAssetsManager: renderFn
    }

    GrapesNewsletterModal.methods.callForImages.call(ctx)

    await Promise.resolve()

    expect(renderFn).toHaveBeenCalled()
  })

  it('removeVideoElement splices Video block when present', () => {
    const videoModel = { attributes: { label: 'Video' } }
    const models = [{ attributes: { label: 'Text' } }, videoModel]
    const ctx = {
      editor: {
        Blocks: {
          all: { models }
        }
      }
    }

    GrapesNewsletterModal.methods.removeVideoElement.call(ctx)

    expect(models).not.toContain(videoModel)
    expect(models).toHaveLength(1)
  })

  it('removeVideoElement does nothing when Video block is absent', () => {
    const models = [{ attributes: { label: 'Text' } }]
    const ctx = {
      editor: {
        Blocks: {
          all: { models }
        }
      }
    }

    GrapesNewsletterModal.methods.removeVideoElement.call(ctx)

    expect(models).toHaveLength(1)
  })

  it('setMergeTextNames does nothing when no component is selected', () => {
    const ctx = {
      editor: { getSelected: () => null },
      urlMergedTexts: []
    }
    jest.useFakeTimers()

    GrapesNewsletterModal.methods.setMergeTextNames.call(ctx)

    expect(() => jest.advanceTimersByTime(20)).not.toThrow()
    jest.useRealTimers()
  })

  it('createImageAssetSearchField returns input with Search placeholder', () => {
    const getAll = jest.fn(() => [])
    const renderFn = jest.fn()
    const ctx = {
      editor: { AssetManager: { getAll } },
      renderAssetsToAssetsManager: renderFn
    }

    const result = GrapesNewsletterModal.methods.createImageAssetSearchField.call(ctx)

    expect(result.tagName).toBe('INPUT')
    expect(result.getAttribute('placeholder')).toBe('Search')
  })

  it('createImageAssetSearchField filters assets on input', () => {
    const assets = [
      { attributes: { name: 'Alpha.png' } },
      { attributes: { name: 'Beta.png' } }
    ]
    const getAll = jest.fn(() => assets)
    const renderFn = jest.fn()
    const ctx = {
      editor: { AssetManager: { getAll } },
      renderAssetsToAssetsManager: renderFn
    }

    const input = GrapesNewsletterModal.methods.createImageAssetSearchField.call(ctx)
    input.value = 'alpha'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(renderFn).toHaveBeenCalledWith([{ attributes: { name: 'Alpha.png' } }])
  })

  it('initializeCodeMirror returns early when container is null', () => {
    const ctx = {
      editor: {},
      $refs: {},
      customHeadScripts: ''
    }

    expect(() =>
      GrapesNewsletterModal.methods.initializeCodeMirror.call(ctx)
    ).not.toThrow()
  })

  it('getGrapesEditorContent exercises isEdit path and adds custom scripts', () => {
    const ctx = {
      editor: {
        select: jest.fn(),
        getHtml: jest.fn(() => '<body>content</body>'),
        getCss: jest.fn(() => ''),
        getWrapper: jest.fn(() => 'wrapper')
      },
      templateType: 'landing',
      isProtocolHttp: true,
      isEdit: true,
      editedCustomHeadScripts: '<script>edit</script>',
      customHeadScripts: '<script>edit</script>',
      customHeadScriptsPlacement: 'body-start'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(result).toContain('edit')
    expect(result).toContain('content')
  })

  it('getGrapesEditorContent handles html without body when head missing', () => {
    const ctx = {
      editor: {
        select: jest.fn(),
        getHtml: jest.fn(() => '<div>bare</div>'),
        getCss: jest.fn(() => ''),
        getWrapper: jest.fn(() => 'wrapper')
      },
      templateType: 'landing',
      isProtocolHttp: true,
      isEdit: false,
      editedCustomHeadScripts: '',
      customHeadScripts: '',
      customHeadScriptsPlacement: 'body-start'
    }

    const result = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)

    expect(typeof result).toBe('string')
    expect(result).toContain('<html>')
  })

  it('getMergeTagsForDropdown uses key as label when label is undefined', () => {
    const ctx = {
      blockManagerComponents: {
        '{NO_LABEL}': {
          attributes: { class: 'merged-text' }
        }
      }
    }

    const result = GrapesNewsletterModal.methods.getMergeTagsForDropdown.call(ctx)

    expect(result[0].label).toBe('{NO_LABEL}')
  })
})
