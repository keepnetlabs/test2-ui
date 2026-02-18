import { shallowMount } from '@vue/test-utils'
import SelectClickOnlyPageModal from '@/components/LandingPage/SelectClickOnlyPageModal.vue'

describe('SelectClickOnlyPageModal.vue', () => {
  const mountComponent = (propsData = {}) =>
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
        LandingPageTemplateListPreview: true,
        'v-dialog': true,
        'v-card': true,
        'v-card-title': true,
        'v-card-text': true,
        'v-card-actions': true,
        'v-btn': true,
        'v-icon': true,
        'v-divider': true,
        'v-spacer': true
      }
    })

  it('resets selectedResourceId when modal is closed', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({ selectedResourceId: 'lp-1' })

    await wrapper.setProps({ status: false })

    expect(wrapper.vm.selectedResourceId).toBe(null)
  })

  it('emits add with selected resource id', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({ selectedResourceId: 'lp-123' })

    wrapper.vm.handleAddTemplate()

    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')[0]).toEqual(['lp-123'])
  })

  it('does not emit add when selected resource id is missing', () => {
    const wrapper = mountComponent()

    wrapper.vm.handleAddTemplate()

    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('stores selected resource id from child event', async () => {
    const wrapper = mountComponent()

    wrapper.findComponent({ name: 'LandingPageTemplateListPreview' }).vm.$emit(
      'selectedLandingPageTemplateResourceId',
      'lp-999'
    )
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedResourceId).toBe('lp-999')
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

  it('status watcher closes drawer when status becomes false', () => {
    const closeDrawer = jest.fn()
    const ctx = {
      isVisible: true,
      closeDrawer
    }

    SelectClickOnlyPageModal.watch.status.call(ctx, false)
    expect(closeDrawer).toHaveBeenCalledTimes(1)
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
})
