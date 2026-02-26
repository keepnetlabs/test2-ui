import { shallowMount } from '@vue/test-utils'
import SelectClickOnlyPageModal from '@/components/LandingPage/SelectClickOnlyPageModal.vue'

describe('SelectClickOnlyPageModal.vue', () => {
  const defaultStubs = {
    VNavigationDrawer: true,
    VIcon: true,
    VBtn: true,
    'v-navigation-drawer': true,
    'v-icon': true,
    'v-btn': true,
    ConfigureCompanyStepHeader: true,
    LandingPageTemplateListPreview: {
      name: 'LandingPageTemplateListPreview',
      template: '<div />'
    },
    'v-dialog': true,
    'v-card': true,
    'v-card-title': true,
    'v-card-text': true,
    'v-card-actions': true,
    'v-divider': true,
    'v-spacer': true
  }

  const mountComponent = (propsData = {}, mountOptions = {}) =>
    shallowMount(SelectClickOnlyPageModal, {
      propsData: {
        status: true,
        method: 'click',
        scenarioDetailsLookup: {},
        languages: [],
        type: 'landing',
        ...propsData
      },
      stubs: {
        ...defaultStubs,
        ...(mountOptions.stubs || {})
      }
    })

  it('resets selectedResourceId when closeDrawer runs', async () => {
    jest.useFakeTimers()
    const emit = jest.fn()
    const ctx = {
      drawerId: 'drawer-1',
      isVisible: true,
      selectedResourceId: 'lp-1',
      $emit: emit
    }
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(null)

    SelectClickOnlyPageModal.methods.closeDrawer.call(ctx)
    jest.runAllTimers()

    expect(ctx.selectedResourceId).toBe(null)
    expect(emit).toHaveBeenCalledWith('close')
    querySpy.mockRestore()
    jest.useRealTimers()
  })

  it('emits add with selected resource id', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({ selectedResourceId: 'lp-123' })

    wrapper.vm.handleAddTemplate()

    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')[0]).toEqual(['lp-123', 0])
  })

  it('does not emit add when selected resource id is missing', () => {
    const wrapper = mountComponent()

    wrapper.vm.handleAddTemplate()

    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('emits add with parsed page index from selected tab', async () => {
    const wrapper = mountComponent()
    wrapper.vm.$refs.templateListPreview = {
      selectedLandingPageTab: '4'
    }
    await wrapper.setData({ selectedResourceId: 'lp-456' })

    wrapper.vm.handleAddTemplate()

    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')[0]).toEqual(['lp-456', 3])
  })

  it('stores selected resource id in local state', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({ selectedResourceId: 'lp-999' })
    expect(wrapper.vm.selectedResourceId).toBe('lp-999')
  })

  it('builds drawer id with expected prefix', () => {
    const wrapper = mountComponent({ method: 'data submission' })
    expect(wrapper.vm.drawerId.startsWith('drawer-')).toBe(true)
  })

  it('stepSubtitle returns method based subtitles', () => {
    expect(
      SelectClickOnlyPageModal.computed.stepSubtitle.call({ method: 'click only' })
    ).toBe('Choose your click only type landing page')
    expect(
      SelectClickOnlyPageModal.computed.stepSubtitle.call({ method: 'data submission' })
    ).toBe('Choose your data submission type landing page')
    expect(
      SelectClickOnlyPageModal.computed.stepSubtitle.call({ method: '' })
    ).toBe('Select a Click Only or Data Submission type landing page')
  })

  it('stepSubtitle matches method case-insensitively', () => {
    expect(
      SelectClickOnlyPageModal.computed.stepSubtitle.call({ method: 'CLICK ONLY' })
    ).toBe('Choose your click only type landing page')
    expect(
      SelectClickOnlyPageModal.computed.stepSubtitle.call({ method: 'DATA SUBMISSION' })
    ).toBe('Choose your data submission type landing page')
  })

  it('stepSubtitle prefers click branch when method contains both click and data', () => {
    expect(
      SelectClickOnlyPageModal.computed.stepSubtitle.call({ method: 'click and data submission' })
    ).toBe('Choose your click only type landing page')
  })

  it('status watcher opens drawer flow when status becomes true', () => {
    jest.useFakeTimers()
    const openDrawer = jest.fn()
    const nextTick = (cb) => cb()
    const ctx = {
      isVisible: false,
      isJustOpened: false,
      openDrawer,
      $nextTick: nextTick
    }

    SelectClickOnlyPageModal.watch.status.call(ctx, true)
    jest.runAllTimers()

    expect(ctx.isVisible).toBe(true)
    expect(openDrawer).toHaveBeenCalledTimes(1)
    expect(ctx.isJustOpened).toBe(false)
    jest.useRealTimers()
  })

  it('status watcher marks drawer as just opened before timeout window ends', () => {
    jest.useFakeTimers()
    const openDrawer = jest.fn()
    const ctx = {
      isVisible: false,
      isJustOpened: false,
      openDrawer,
      $nextTick: (cb) => cb()
    }

    SelectClickOnlyPageModal.watch.status.call(ctx, true)

    expect(ctx.isVisible).toBe(true)
    expect(ctx.isJustOpened).toBe(true)
    expect(openDrawer).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(300)
    expect(ctx.isJustOpened).toBe(false)
    jest.useRealTimers()
  })

  it('status watcher closes drawer when status becomes false', () => {
    const closeDrawer = jest.fn()
    const ctx = {
      isVisible: true,
      closeDrawer
    }

    SelectClickOnlyPageModal.watch.status.call(ctx, false)
    expect(closeDrawer).toHaveBeenCalledTimes(1)
  })

  it('status watcher does nothing when status is false and drawer is already hidden', () => {
    const closeDrawer = jest.fn()
    const ctx = {
      isVisible: false,
      closeDrawer
    }

    SelectClickOnlyPageModal.watch.status.call(ctx, false)
    expect(closeDrawer).not.toHaveBeenCalled()
  })

  it('status watcher does nothing when status is true and drawer already visible', () => {
    const openDrawer = jest.fn()
    const closeDrawer = jest.fn()
    const ctx = {
      isVisible: true,
      openDrawer,
      closeDrawer
    }

    SelectClickOnlyPageModal.watch.status.call(ctx, true)

    expect(openDrawer).not.toHaveBeenCalled()
    expect(closeDrawer).not.toHaveBeenCalled()
  })

  it('handleClickOutside ignores select/picker/popover targets', () => {
    const handleClose = jest.fn()
    const makeTarget = (cls) => ({
      closest: (q) => (q === cls ? {} : null)
    })
    const ctx = {
      isJustOpened: false,
      handleClose
    }

    SelectClickOnlyPageModal.methods.handleClickOutside.call(ctx, {
      target: makeTarget('.el-select-dropdown')
    })
    SelectClickOnlyPageModal.methods.handleClickOutside.call(ctx, {
      target: makeTarget('.el-picker-panel')
    })
    SelectClickOnlyPageModal.methods.handleClickOutside.call(ctx, {
      target: makeTarget('.el-popper')
    })
    SelectClickOnlyPageModal.methods.handleClickOutside.call(ctx, {
      target: makeTarget('.v-menu__content')
    })

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('handleClickOutside ignores outside click while drawer is just opened', () => {
    const handleClose = jest.fn()
    const ctx = {
      isJustOpened: true,
      handleClose
    }

    SelectClickOnlyPageModal.methods.handleClickOutside.call(ctx, {
      target: { closest: () => null }
    })

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('handleClickOutside closes when open guard is off and target is plain', () => {
    const handleClose = jest.fn()
    const ctx = {
      isJustOpened: false,
      handleClose
    }

    SelectClickOnlyPageModal.methods.handleClickOutside.call(ctx, {
      target: { closest: () => null }
    })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('handleClickOutside closes when event target is missing', () => {
    const handleClose = jest.fn()
    const ctx = {
      isJustOpened: false,
      handleClose
    }

    SelectClickOnlyPageModal.methods.handleClickOutside.call(ctx, {})

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('closeDrawer resets state and emits close after timeout', () => {
    jest.useFakeTimers()
    const emit = jest.fn()
    const element = { style: { right: '' } }
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(element)
    const ctx = {
      drawerId: 'drawer-1',
      isVisible: true,
      selectedResourceId: 'lp-7',
      $emit: emit
    }

    SelectClickOnlyPageModal.methods.closeDrawer.call(ctx)
    expect(element.style.right).toBe('-100%')

    jest.advanceTimersByTime(250)
    expect(ctx.isVisible).toBe(false)
    expect(ctx.selectedResourceId).toBe(null)
    expect(emit).toHaveBeenCalledWith('close')

    querySpy.mockRestore()
    jest.useRealTimers()
  })

  it('openDrawer animates right position when drawer element exists', () => {
    jest.useFakeTimers()
    const element = { style: { right: '' } }
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(element)
    const ctx = { drawerId: 'drawer-2' }

    SelectClickOnlyPageModal.methods.openDrawer.call(ctx)
    expect(element.style.right).toBe('-100%')

    jest.advanceTimersByTime(10)
    expect(element.style.right).toBe('0')

    querySpy.mockRestore()
    jest.useRealTimers()
  })

  it('openDrawer skips when drawer element is missing', () => {
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(null)
    const ctx = { drawerId: 'drawer-3' }

    expect(() => SelectClickOnlyPageModal.methods.openDrawer.call(ctx)).not.toThrow()

    querySpy.mockRestore()
  })

  it('handleClose delegates to closeDrawer', () => {
    const closeDrawer = jest.fn()
    const ctx = { closeDrawer }

    SelectClickOnlyPageModal.methods.handleClose.call(ctx)

    expect(closeDrawer).toHaveBeenCalledTimes(1)
  })

  it('getSelectedPageIndex returns parsed positive index', () => {
    const ctx = {
      $refs: {
        templateListPreview: {
          selectedLandingPageTab: '3'
        }
      }
    }

    expect(SelectClickOnlyPageModal.methods.getSelectedPageIndex.call(ctx)).toBe(2)
  })

  it('getSelectedPageIndex returns 0 for invalid tab values', () => {
    const invalidCtx = {
      $refs: {
        templateListPreview: {
          selectedLandingPageTab: 'not-a-number'
        }
      }
    }
    const zeroCtx = {
      $refs: {
        templateListPreview: {
          selectedLandingPageTab: '0'
        }
      }
    }

    expect(SelectClickOnlyPageModal.methods.getSelectedPageIndex.call(invalidCtx)).toBe(0)
    expect(SelectClickOnlyPageModal.methods.getSelectedPageIndex.call(zeroCtx)).toBe(0)
  })

  it('getSelectedPageIndex returns 0 for negative tab values', () => {
    const ctx = {
      $refs: {
        templateListPreview: {
          selectedLandingPageTab: '-2'
        }
      }
    }

    expect(SelectClickOnlyPageModal.methods.getSelectedPageIndex.call(ctx)).toBe(0)
  })

  it('getSelectedPageIndex returns 0 when template ref is missing', () => {
    const ctx = { $refs: {} }
    expect(SelectClickOnlyPageModal.methods.getSelectedPageIndex.call(ctx)).toBe(0)
  })

})
