import { shallowMount } from '@vue/test-utils'
import ExecutiveReportsCard from '@/components/ExecutiveReports/ExecutiveReportsCard.vue'

describe('ExecutiveReportsCard.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(ExecutiveReportsCard, {
      propsData: {
        card: {
          resourceId: 'r1',
          name: 'Test Report',
          isEditable: true,
          isDeletable: true,
          isSupportManager: false
        },
        ...propsData
      },
      mocks: {
        $router: { push: jest.fn() }
      },
      stubs: { VBtn: true, VTooltip: true, VIcon: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getEditButtonClasses includes disabled when not editable', () => {
    const wrapper = mountComponent({ card: { resourceId: 'r1', isEditable: false } })
    expect(wrapper.vm.getEditButtonClasses).toContain('executive-reports-card__right-btn--disabled')
  })

  it('getEditButtonClasses does not include disabled when editable', () => {
    const wrapper = mountComponent({ card: { resourceId: 'r1', isEditable: true } })
    expect(wrapper.vm.getEditButtonClasses).not.toContain(
      'executive-reports-card__right-btn--disabled'
    )
  })

  it('getDeleteButtonClasses includes disabled when not deletable', () => {
    const wrapper = mountComponent({ card: { resourceId: 'r1', isDeletable: false } })
    expect(wrapper.vm.getDeleteButtonClasses).toContain(
      'executive-reports-card__right-btn--disabled'
    )
  })

  it('handlePreviewClick pushes to router', () => {
    const wrapper = mountComponent()
    wrapper.vm.handlePreviewClick()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Preview Executive Report',
      params: { id: 'r1' }
    })
  })

  it('handleScheduleClick emits on-schedule with card', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleScheduleClick()
    expect(wrapper.emitted('on-schedule')).toBeTruthy()
    expect(wrapper.emitted('on-schedule')[0]).toEqual([wrapper.vm.card])
  })

  it('handleEditClick pushes when editable', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleEditClick()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Edit Executive Report',
      params: { id: 'r1' }
    })
  })

  it('handleEditClick does not push when not editable', () => {
    const wrapper = mountComponent({ card: { resourceId: 'r1', isEditable: false } })
    wrapper.vm.handleEditClick()
    expect(wrapper.vm.$router.push).not.toHaveBeenCalled()
  })

  it('handleDeleteClick emits on-delete when deletable', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleDeleteClick()
    expect(wrapper.emitted('on-delete')).toBeTruthy()
    expect(wrapper.emitted('on-delete')[0]).toEqual([wrapper.vm.card])
  })

  it('handleDeleteClick does not emit when not deletable', () => {
    const wrapper = mountComponent({ card: { resourceId: 'r1', isDeletable: false } })
    wrapper.vm.handleDeleteClick()
    expect(wrapper.emitted('on-delete')).toBeFalsy()
  })

  it('handleContentDuplicateClick pushes to router', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleContentDuplicateClick()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Duplicate Executive Report',
      params: { id: 'r1' }
    })
  })

  it('handleDownloadClick pushes with showDownloadModal', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleDownloadClick()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Preview Executive Report',
      params: { id: 'r1', showDownloadModal: true }
    })
  })
})
