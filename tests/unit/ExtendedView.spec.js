import { createLocalVue, shallowMount } from '@vue/test-utils'
import ExtendedView from '@/components/ExtendedView'

describe('ExtendedView.vue', () => {
  const localVue = createLocalVue()

  const createWrapper = (propsData = {}) =>
    shallowMount(ExtendedView, {
      localVue,
      stubs: {
        'router-link': true
      },
      propsData: {
        options: {
          col: [],
          footer: [{ label: 'Created', key: 'createTime' }, { label: 'Updated', key: 'lastUpdateDate' }]
        },
        value: [{ name: 'row-1', createTime: '2024-01-01', lastUpdateDate: '2024-01-02' }],
        ...propsData
      }
    })

  it('initializes from value and createMode in created hook', () => {
    const wrapper = createWrapper({ createMode: true })

    expect(wrapper.vm.copyOfEditedRows).toEqual(wrapper.props('value'))
    expect(wrapper.vm.defaultValues).toEqual(wrapper.props('value'))
    expect(wrapper.vm.editMode).toBe(true)
  })

  it('computes edit/footer visibility correctly', () => {
    const wrapper = createWrapper({
      options: { col: [], isEditable: false, showFooter: false, footer: [{}, {}] }
    })

    expect(wrapper.vm.isEditRendered).toBe(false)
    expect(wrapper.vm.isFooterRendered).toBe(false)
  })

  it('computes save button disabled states', () => {
    const wrapper = createWrapper()

    wrapper.setData({
      copyOfEditedRows: [{ name: 'a' }],
      defaultValues: [{ name: 'a' }]
    })
    expect(wrapper.vm.isSaveButtonDisabled).toBe(true)

    wrapper.setProps({ extendedViewCallingApi: true })
    expect(wrapper.vm.isSaveButtonDisabled).toBe(true)

    wrapper.setProps({ extendedViewCallingApi: false, isCancelButtonDisabled: true })
    expect(wrapper.vm.isSaveButtonDisabled).toBe(true)
  })

  it('handles getTop and combobox conversions', () => {
    const wrapper = createWrapper({ containerStyle: { top: '200px' } })

    expect(wrapper.vm.getTop()).toBe('80px')
    expect(wrapper.vm.getComboBoxValue('a,b,')).toEqual(['a', 'b'])
    expect(wrapper.vm.getComboBoxValue('a,b')).toEqual(['a', 'b'])
    expect(wrapper.vm.getComboBoxValue(['x'])).toEqual(['x'])
    expect(wrapper.vm.getComboBoxValue(null)).toBe(null)
  })

  it('updates rows on text/select/checkbox/date handlers', () => {
    const wrapper = createWrapper({
      value: [{ status: false }, { status: false }]
    })

    wrapper.vm.handleEditPopupTextFieldChange('hello', 'name')
    expect(wrapper.vm.copyOfEditedRows[0].name).toBe('hello')
    expect(wrapper.vm.copyOfEditedRows[1].name).toBe('hello')

    wrapper.vm.handleEditPopupSelectChange('done', 'status')
    expect(wrapper.vm.copyOfEditedRows[0].status).toBe('done')

    wrapper.vm.handleEditPopupCheckboxChange(true, 'status')
    expect(wrapper.vm.copyOfEditedRows[1].status).toBe(true)

    wrapper.vm.handleEditPopupDatePickerChange('2026-01-01', 'date')
    expect(wrapper.vm.copyOfEditedRows[0].date).toBe('2026-01-01')
  })

  it('handles multiple edits and combo trimming', () => {
    const wrapper = createWrapper({
      value: [{ tags: '' }, { tags: '' }]
    })

    wrapper.vm.handleMultipleEdits(wrapper.vm.copyOfEditedRows, 'name', 'bulk')
    expect(wrapper.vm.copyOfEditedRows[0].name).toBe('bulk')
    expect(wrapper.vm.multipleEditModels.name).toBe('bulk')

    wrapper.vm.handleEditComboBoxChange([], 'tags')
    expect(wrapper.vm.copyOfEditedRows[0].tags).toBe('')

    wrapper.vm.handleEditComboBoxChange(['  x  ', 'abcdefghijklmnopqrstuvw'], 'tags')
    expect(wrapper.vm.copyOfEditedRows[0].tags).toBe('  x  ,abcdefghijklmnopqrst')
  })

  it('emits close/create mode and resets state on cancel', () => {
    const wrapper = createWrapper({ createMode: true })
    wrapper.vm.cancelEditedOnes()
    expect(wrapper.emitted('closeCreateMode')).toBeTruthy()

    const normalWrapper = createWrapper({ createMode: false })
    normalWrapper.setData({
      editMode: true,
      multipleEditModels: ['x'],
      editedPopupProperties: ['name'],
      multipleEditDisables: [true]
    })
    normalWrapper.vm.cancelEditedOnes()
    expect(normalWrapper.vm.editMode).toBe(false)
    expect(normalWrapper.vm.multipleEditModels).toEqual([])
    expect(normalWrapper.vm.editedPopupProperties).toEqual([])
  })

  it('saveEditedOnes emits handleEdit and respects waitApi', () => {
    const wrapper = createWrapper({ waitApi: true })
    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    const closeSpy = jest.spyOn(wrapper.vm, 'closeEditPopupAndResetParameters')

    const result = wrapper.vm.saveEditedOnes()

    expect(wrapper.emitted('handleEdit')).toBeTruthy()
    expect(result).toBe(true)
    expect(closeSpy).not.toHaveBeenCalled()
  })
})
