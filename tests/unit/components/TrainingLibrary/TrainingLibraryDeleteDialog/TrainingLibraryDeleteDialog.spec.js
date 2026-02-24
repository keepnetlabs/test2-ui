import { shallowMount } from '@vue/test-utils'
import TrainingLibraryDeleteDialog from '@/components/TrainingLibrary/TrainingLibraryDeleteDialog/TrainingLibraryDeleteDialog.vue'

describe('TrainingLibraryDeleteDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TrainingLibraryDeleteDialog, {
      propsData: {
        status: true,
        selectedRow: { trainingId: 't1' },
        title: 'Delete Training?',
        body: 'This will permanently delete the training.',
        apiFunc: jest.fn(() => Promise.resolve()),
        ...propsData
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('handleClose emits changeStatus and calls setDeleteDialog', () => {
    const onClose = jest.fn()
    const wrapper = createWrapper({ onClose })

    wrapper.vm.handleClose(false)

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledWith(false)
    expect(wrapper.emitted('changeStatus')[0]).toEqual([false])
  })

  it('handleClose with forceUpdate passes true', () => {
    const onClose = jest.fn()
    const wrapper = createWrapper({ onClose })

    wrapper.vm.handleClose(true)

    expect(onClose).toHaveBeenCalledWith(true)
    expect(wrapper.emitted('changeStatus')[0]).toEqual([true])
  })

  it('handleConfirm calls apiFunc and closes on success', async () => {
    const apiFunc = jest.fn(() => Promise.resolve())
    const wrapper = createWrapper({ apiFunc })
    const flushPromises = () => new Promise((r) => setTimeout(r, 0))

    wrapper.vm.handleConfirm()
    await flushPromises()

    expect(apiFunc).toHaveBeenCalledWith('t1')
    expect(wrapper.emitted('changeStatus')[0]).toEqual([true])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('handleConfirm does nothing when apiFunc not function', () => {
    const wrapper = createWrapper({ apiFunc: null })

    wrapper.vm.handleConfirm()

    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
