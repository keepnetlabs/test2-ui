import { shallowMount } from '@vue/test-utils'
import CommonSimulatorDeleteScenario from '@/components/Common/Simulator/CommonSimulatorDeleteScenario.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CommonSimulatorDeleteScenario.vue', () => {
  const factory = (propsData = {}) =>
    shallowMount(CommonSimulatorDeleteScenario, {
      propsData: {
        status: true,
        selectedScenario: { resourceId: 'sc-1', name: 'Scenario A' },
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

  it('getBodyText returns single scenario text when isMultiple is false', () => {
    const wrapper = factory({ isMultiple: false })
    expect(wrapper.vm.getBodyText).toBe('Scenario A will be deleted.')
  })

  it('getBodyText returns multi scenario text when isMultiple is true', () => {
    const wrapper = factory({ isMultiple: true, scenarioCount: 3 })
    expect(wrapper.vm.getBodyText).toBe('3 scenarios will be deleted.')
  })

  it('handleClose emits on-close', () => {
    const wrapper = factory()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleDelete calls apiFunc and emits on-success for single delete', async () => {
    const apiFunc = jest.fn(() => Promise.resolve())
    const wrapper = factory({
      isMultiple: false,
      apiFunc
    })

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    expect(apiFunc).toHaveBeenCalledWith('sc-1')

    await flushPromises()

    expect(wrapper.emitted('on-success')).toEqual([[{ resourceId: 'sc-1', name: 'Scenario A' }]])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('handleDelete calls multipleDeleteApiFunc and emits on-success-multiple for bulk delete', async () => {
    const multipleDeleteApiFunc = jest.fn(() => Promise.resolve())
    const payload = { resourceIds: ['sc-1', 'sc-2'] }
    const wrapper = factory({
      isMultiple: true,
      scenarioCount: 2,
      multipleDeletePayload: payload,
      multipleDeleteApiFunc
    })

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    expect(multipleDeleteApiFunc).toHaveBeenCalledWith(payload)

    await flushPromises()

    expect(wrapper.emitted('on-success-multiple')).toEqual([[]])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

})
