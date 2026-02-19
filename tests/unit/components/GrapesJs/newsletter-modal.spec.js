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

import GrapesNewsletterModal from '@/components/GrapesJs/Newsletter/GrapesNewsletterModal.vue'

describe('GrapesNewsletterModal.vue methods', () => {
  it('handleHeadScriptsDialogStatus clears codemirror and container on close', () => {
    const ctx = {
      showHeadScriptsDialog: true,
      codeMirrorViewer: { getValue: jest.fn() },
      $refs: { codeMirrorContainer: { innerHTML: '<div>x</div>' } }
    }

    GrapesNewsletterModal.methods.handleHeadScriptsDialogStatus.call(ctx, false)

    expect(ctx.showHeadScriptsDialog).toBe(false)
    expect(ctx.codeMirrorViewer).toBeNull()
    expect(ctx.$refs.codeMirrorContainer.innerHTML).toBe('')
  })

  it('handleHeadScriptsSave emits script and placement events then resets dialog state', () => {
    const emit = jest.fn()
    const ctx = {
      codeMirrorViewer: { getValue: jest.fn(() => '<script>1</script>') },
      customHeadScriptsPlacementValue: 'body-end',
      currentPageIndex: 2,
      showHeadScriptsDialog: true,
      $emit: emit,
      $refs: { codeMirrorContainer: { innerHTML: '<div>x</div>' } }
    }

    GrapesNewsletterModal.methods.handleHeadScriptsSave.call(ctx)

    expect(emit).toHaveBeenCalledWith('update:customHeadScripts', '<script>1</script>')
    expect(emit).toHaveBeenCalledWith(
      'on-custom-head-scripts-change',
      '<script>1</script>',
      2
    )
    expect(emit).toHaveBeenCalledWith(
      'on-custom-head-scripts-placement-change',
      'body-end',
      2
    )
    expect(ctx.showHeadScriptsDialog).toBe(false)
    expect(ctx.codeMirrorViewer).toBeNull()
    expect(ctx.$refs.codeMirrorContainer.innerHTML).toBe('')
  })

  it('handleHeadScriptsCancel resets dialog state without emits', () => {
    const ctx = {
      showHeadScriptsDialog: true,
      codeMirrorViewer: { getValue: jest.fn() },
      $refs: { codeMirrorContainer: { innerHTML: 'x' } }
    }

    GrapesNewsletterModal.methods.handleHeadScriptsCancel.call(ctx)

    expect(ctx.showHeadScriptsDialog).toBe(false)
    expect(ctx.codeMirrorViewer).toBeNull()
    expect(ctx.$refs.codeMirrorContainer.innerHTML).toBe('')
  })

  it('getGrapesEditorContent returns command output for email template and empty string on error', () => {
    const emailCtx = {
      editor: {
        getWrapper: jest.fn(() => ({})),
        select: jest.fn(),
        Commands: { run: jest.fn(() => '<html>Email</html>') }
      },
      templateType: 'email'
    }
    const out1 = GrapesNewsletterModal.methods.getGrapesEditorContent.call(emailCtx)
    expect(out1).toBe('<html>Email</html>')

    const errCtx = {
      editor: {
        getWrapper: jest.fn(() => ({})),
        select: jest.fn(),
        Commands: { run: jest.fn(() => { throw new Error('bad') }) }
      },
      templateType: 'email'
    }
    const out2 = GrapesNewsletterModal.methods.getGrapesEditorContent.call(errCtx)
    expect(out2).toBe('')
  })

  it('getGrapesEditorContent for landing page injects style/meta/scripts', () => {
    const ctx = {
      editor: {
        getWrapper: jest.fn(() => ({})),
        select: jest.fn(),
        getHtml: jest.fn(() => '<html><body><div>Landing</div></body></html>'),
        getCss: jest.fn(() => 'body { color: red; }')
      },
      templateType: 'landing-page',
      isProtocolHttp: false,
      isEdit: false,
      editedCustomHeadScripts: '',
      customHeadScripts: '<script src="https://cdn.test/a.js"></script>',
      customHeadScriptsPlacement: 'body-end'
    }

    const out = GrapesNewsletterModal.methods.getGrapesEditorContent.call(ctx)
    expect(out).toContain('Content-Security-Policy')
    expect(out).toContain('upgrade-insecure-requests')
    expect(out).toContain('body { color: red; }')
    expect(out).toContain('data-custom-landing-page-script="true"')
    expect(out).toContain('data-custom-landing-page-script-position="body-end"')
  })

  it('createImageAssetSearchField filters assets by search text', () => {
    const renderAssetsToAssetsManager = jest.fn()
    const ctx = {
      editor: {
        AssetManager: {
          getAll: jest.fn(() => [
            { attributes: { name: 'Logo Keepnet' } },
            { attributes: { name: 'Banner Threat' } }
          ])
        }
      },
      renderAssetsToAssetsManager
    }

    const input = GrapesNewsletterModal.methods.createImageAssetSearchField.call(ctx)
    input.value = 'keep'
    input.dispatchEvent(new Event('input'))

    expect(renderAssetsToAssetsManager).toHaveBeenCalledWith([
      { attributes: { name: 'Logo Keepnet' } }
    ])
  })

  it('openHeadScriptsEditor toggles dialog and initializes editor on nextTick', () => {
    const initializeCodeMirror = jest.fn()
    const ctx = {
      showHeadScriptsDialog: false,
      customHeadScriptsPlacement: 'body-start',
      customHeadScriptsPlacementValue: 'body-end',
      initializeCodeMirror,
      $nextTick: (cb) => cb()
    }

    GrapesNewsletterModal.methods.openHeadScriptsEditor.call(ctx)

    expect(ctx.showHeadScriptsDialog).toBe(true)
    expect(ctx.customHeadScriptsPlacementValue).toBe('body-start')
    expect(initializeCodeMirror).toHaveBeenCalled()
  })
})
