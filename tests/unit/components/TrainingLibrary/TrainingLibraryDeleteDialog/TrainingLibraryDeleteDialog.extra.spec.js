import { shallowMount } from '@vue/test-utils'
import TrainingLibraryDeleteDialog from '@/components/TrainingLibrary/TrainingLibraryDeleteDialog/TrainingLibraryDeleteDialog.vue'

describe('TrainingLibraryDeleteDialog.vue (branch coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TrainingLibraryDeleteDialog, {
      propsData: {
        status: true,
        selectedRow: { trainingId: 't1' },
        title: 'Delete?',
        body: 'Are you sure?',
        ...propsData
      },
      mocks: { $store: { dispatch: jest.fn() } },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleClose does not call onClose when onClose is not a function', () => {
    const wrapper = createWrapper({ onClose: null })
    wrapper.vm.handleClose(false)
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalled()
    expect(wrapper.emitted('changeStatus')).toBeTruthy()
  })

  it('handleClose with default onClose (no-op) does not throw', () => {
    const wrapper = createWrapper()
    expect(() => wrapper.vm.handleClose(true)).not.toThrow()
    expect(wrapper.emitted('changeStatus')[0]).toEqual([true])
  })

  it('handleConfirm returns early when apiFunc is not a function', () => {
    const wrapper = createWrapper({ apiFunc: null })
    wrapper.vm.handleConfirm()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('handleConfirm success path calls api and emits close(true)', async () => {
    const apiFunc = jest.fn(() => Promise.resolve())
    const wrapper = createWrapper({ apiFunc, selectedRow: { trainingId: 't42' } })
    const closeSpy = jest.spyOn(wrapper.vm, 'handleClose')

    wrapper.vm.handleConfirm()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    await Promise.resolve()
    await Promise.resolve()

    expect(apiFunc).toHaveBeenCalledWith('t42')
    expect(closeSpy).toHaveBeenCalledWith(true)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('handleConfirm non-success path still resets disabled state', async () => {
    const failedThenable = {
      then() {
        return this
      },
      finally(cb) {
        cb()
        return this
      }
    }
    const apiFunc = jest.fn(() => failedThenable)
    const wrapper = createWrapper({ apiFunc, selectedRow: { trainingId: 't43' } })
    const closeSpy = jest.spyOn(wrapper.vm, 'handleClose')

    wrapper.vm.handleConfirm()

    expect(apiFunc).toHaveBeenCalledWith('t43')
    expect(closeSpy).not.toHaveBeenCalledWith(true)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
