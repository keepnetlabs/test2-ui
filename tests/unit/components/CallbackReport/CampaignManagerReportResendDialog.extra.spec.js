import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportResendDialog from '@/components/CallbackReport/CampaignManagerReportResendDialog.vue'

describe('CampaignManagerReportResendDialog.vue (extra coverage)', () => {
  const AppDialogStub = {
    name: 'AppDialog',
    template: '<div><slot /><slot name="app-dialog-footer" /></div>',
    props: ['status', 'icon', 'title', 'subtitle']
  }
  const AppDialogFooterStub = {
    name: 'AppDialogFooter',
    template: '<div></div>',
    props: ['confirmButtonDisabled', 'cancelButtonId', 'confirmButtonId', 'actionButtonText']
  }
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportResendDialog, {
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        payload: { items: [] },
        resendItemCount: 0,
        ...propsData
      },
      stubs: { AppDialog: AppDialogStub, AppDialogFooter: AppDialogFooterStub }
    })

  it('getResendText uses resendItemCount when > 0 (singular)', () => {
    const wrapper = createWrapper({ resendItemCount: 1 })
    expect(wrapper.vm.getResendText).toContain('1 user')
    expect(wrapper.vm.getResendText).not.toContain('users')
  })

  it('getResendText uses resendItemCount when > 1 (plural)', () => {
    const wrapper = createWrapper({ resendItemCount: 3 })
    expect(wrapper.vm.getResendText).toContain('3 users')
  })

  it('getResendText uses payload.items.length when resendItemCount is 0', () => {
    const wrapper = createWrapper({
      resendItemCount: 0,
      payload: { items: [{ id: 1 }, { id: 2 }] }
    })
    expect(wrapper.vm.getResendText).toContain('2 users')
  })

  it('getResendText uses payload.items.length singular', () => {
    const wrapper = createWrapper({
      resendItemCount: 0,
      payload: { items: [{ id: 1 }] }
    })
    expect(wrapper.vm.getResendText).toContain('1 user')
  })

  it('getResendText returns fallback when no count or payload', () => {
    const wrapper = createWrapper({
      resendItemCount: 0,
      payload: { items: [] }
    })
    expect(wrapper.vm.getResendText).toContain('users you selected')
  })

  it('getResendText prioritizes resendItemCount over payload.items length', () => {
    const wrapper = createWrapper({
      resendItemCount: 4,
      payload: { items: [{ id: 1 }] }
    })

    expect(wrapper.vm.getResendText).toContain('4 users')
    expect(wrapper.vm.getResendText).not.toContain('1 user')
  })

  it('getResendText falls back safely when payload is undefined', () => {
    const wrapper = createWrapper({
      resendItemCount: 0,
      payload: undefined
    })

    expect(wrapper.vm.getResendText).toContain('users you selected')
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleConfirm emits on-confirm', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('forwards AppDialog changeStatus to on-close emit', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialogStub).vm.$emit('changeStatus')

    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('forwards AppDialogFooter handleClose and handleConfirm events', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialogFooterStub).vm.$emit('handleClose')
    wrapper.findComponent(AppDialogFooterStub).vm.$emit('handleConfirm')

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('passes isActionButtonDisabled prop through to footer', () => {
    const wrapper = createWrapper({ isActionButtonDisabled: true })
    const footer = wrapper.findComponent(AppDialogFooterStub)

    expect(footer.props('confirmButtonDisabled')).toBe(true)
  })

  it('passes default disabled state as false to footer', () => {
    const wrapper = createWrapper({ isActionButtonDisabled: false })
    const footer = wrapper.findComponent(AppDialogFooterStub)

    expect(footer.props('confirmButtonDisabled')).toBe(false)
  })

  it('uses fallback text when payload exists but items is missing', () => {
    const wrapper = createWrapper({
      resendItemCount: 0,
      payload: {}
    })

    expect(wrapper.vm.getResendText).toContain('users you selected')
  })

  it('treats negative resendItemCount as truthy and keeps singular suffix', () => {
    const wrapper = createWrapper({
      resendItemCount: -1,
      payload: { items: [{ id: 1 }, { id: 2 }] }
    })

    expect(wrapper.vm.getResendText).toContain('-1 user')
    expect(wrapper.vm.getResendText).not.toContain('users')
  })

  it('forwards static dialog props from constants and status prop', () => {
    const wrapper = createWrapper({ status: false })
    const appDialog = wrapper.findComponent(AppDialogStub)

    expect(appDialog.props('status')).toBe(false)
    expect(appDialog.props('icon')).toBe('mdi-alert-circle')
    expect(appDialog.props('title')).toBe('Resend the campaign?')
  })
})
