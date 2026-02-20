import { shallowMount } from '@vue/test-utils'
import CommonSimulatorEmailTemplateDeleteDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplateDeleteDialog.vue'
import { SCENARIO_DELETE_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

describe('CommonSimulatorEmailTemplateDeleteDialog.vue', () => {
  const factory = (propsData = {}) =>
    shallowMount(CommonSimulatorEmailTemplateDeleteDialog, {
      propsData: {
        status: true,
        selectedEmailTemplate: { resourceId: 'et-1', name: 'Template A' },
        apiFunc: jest.fn(() => Promise.resolve()),
        ...propsData
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          props: ['status'],
          template: '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: true
      }
    })

  it('computes title/subtitle for email and landing page delete modes', async () => {
    const wrapper = factory({
      type: SCENARIO_DELETE_DIALOG_TYPES.EMAIL
    })
    expect(wrapper.vm.getTitle).toBe('Delete Email Template?')
    expect(wrapper.vm.getSubtitle).toBe('Email Template will deleted permanently')

    await wrapper.setProps({
      type: SCENARIO_DELETE_DIALOG_TYPES.LANDING_PAGE
    })
    expect(wrapper.vm.getTitle).toBe('Delete Landing Page Template?')
    expect(wrapper.vm.getSubtitle).toBe('Landing Page will deleted permanently')
  })

  it('computes body text for single and multiple delete', async () => {
    const wrapper = factory({
      isMultiple: false,
      selectedEmailTemplate: { resourceId: 'et-1', name: 'Template A' }
    })
    expect(wrapper.vm.getBodyText).toBe('Template A will be deleted.')

    await wrapper.setProps({
      isMultiple: true,
      templateCount: 3
    })
    expect(wrapper.vm.getBodyText).toBe('3 templates will be deleted.')
  })

  it('emits on-close in handleClose', () => {
    const wrapper = factory()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handles single delete and emits on-success with template', async () => {
    const apiFunc = jest.fn(() => Promise.resolve())
    const wrapper = factory({
      isMultiple: false,
      apiFunc
    })

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    expect(apiFunc).toHaveBeenCalledWith('et-1')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    expect(wrapper.emitted('on-success')).toEqual([[{ resourceId: 'et-1', name: 'Template A' }]])
  })

  it('handles multiple delete and emits on-success-multiple', async () => {
    const multipleDeleteApiFunc = jest.fn(() => Promise.resolve())
    const payload = { resourceIds: ['et-1', 'et-2'] }
    const wrapper = factory({
      isMultiple: true,
      templateCount: 2,
      multipleDeletePayload: payload,
      multipleDeleteApiFunc
    })

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    expect(multipleDeleteApiFunc).toHaveBeenCalledWith(payload)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    expect(wrapper.emitted('on-success-multiple')).toEqual([[]])
  })
})
