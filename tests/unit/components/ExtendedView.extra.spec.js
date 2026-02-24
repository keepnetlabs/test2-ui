import { createLocalVue, shallowMount } from '@vue/test-utils'
import ExtendedView from '@/components/ExtendedView'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn((x) => x),
  getBtnPriorityColor: jest.fn((x) => x),
  getDataTableFieldLabel: jest.fn((x) => String(x)),
  getTextColor: jest.fn(() => '#000'),
  copyToClipboard: jest.fn(() => Promise.resolve())
}))

describe('ExtendedView.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const createWrapper = (propsData = {}) =>
    shallowMount(ExtendedView, {
      localVue,
      stubs: { 'router-link': true, Badge: true, apexchart: true },
      propsData: {
        options: {
          col: [{ label: 'Status', property: 'status', type: 'text' }],
          footer: [{ label: 'Created', key: 'createTime' }, { label: 'Updated', key: 'lastUpdateDate' }]
        },
        value: [{ name: 'row-1', status: 'active', createTime: '2024-01-01', lastUpdateDate: '2024-01-02' }],
        ...propsData
      }
    })

  describe('multipleValues', () => {
    it('returns true when isMultiple and value.length > 1', () => {
      const wrapper = createWrapper({
        isMultiple: true,
        totalItemCount: 5,
        value: [{ a: 1 }, { a: 2 }]
      })
      expect(wrapper.vm.multipleValues('a')).toBe(true)
    })
    it('returns false when values are same across rows', () => {
      const wrapper = createWrapper({
        value: [
          { status: 'active' },
          { status: 'active' }
        ]
      })
      expect(wrapper.vm.multipleValues('status')).toBe(false)
    })
    it('returns true when values differ across rows', () => {
      const wrapper = createWrapper({
        value: [
          { status: 'active' },
          { status: 'inactive' }
        ]
      })
      expect(wrapper.vm.multipleValues('status')).toBe(true)
    })
    it('returns undefined when single row (no multi-value check)', () => {
      const wrapper = createWrapper({ value: [{ status: 'active' }] })
      expect(wrapper.vm.multipleValues('status')).toBeUndefined()
    })
  })

  describe('getTop', () => {
    it('returns false when no containerStyle', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTop()).toBe(false)
    })
    it('returns false when containerStyle has no top', () => {
      const wrapper = createWrapper({ containerStyle: {} })
      expect(wrapper.vm.getTop()).toBe(false)
    })
  })

  describe('getComboBoxValue', () => {
    it('returns [] for empty string', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getComboBoxValue('')).toEqual([])
    })
    it('returns [] for undefined', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getComboBoxValue(undefined)).toEqual([])
    })
    it('returns null for null', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getComboBoxValue(null)).toBeNull()
    })
  })

  describe('handleEditComboBoxChange empty value', () => {
    it('clears all rows when value is empty array', () => {
      const wrapper = createWrapper({
        value: [{ tags: 'a,b' }, { tags: 'x' }]
      })
      wrapper.vm.handleEditComboBoxChange([], 'tags')
      expect(wrapper.vm.copyOfEditedRows[0].tags).toBe('')
      expect(wrapper.vm.copyOfEditedRows[1].tags).toBe('')
    })
  })

  describe('handleMultipleComboEdit', () => {
    it('handles string value', () => {
      const wrapper = createWrapper({
        value: [{ tags: '' }, { tags: '' }]
      })
      wrapper.vm.handleMultipleComboEdit(wrapper.vm.copyOfEditedRows, 'tags', 'short')
      expect(wrapper.vm.multipleEditModels.tags).toBe('short')
    })
    it('trims and filters empty from array', () => {
      const wrapper = createWrapper({
        value: [{ tags: '' }, { tags: '' }]
      })
      wrapper.vm.handleMultipleComboEdit(wrapper.vm.copyOfEditedRows, 'tags', ['  a  ', '', '  b  '])
      expect(wrapper.vm.multipleEditModels.tags).toEqual(['a', 'b'])
    })
  })

  describe('getCheckboxStatus and getCheckboxLabel', () => {
    it('hasOneMoreCheckboxValue returns true when mixed values', () => {
      const wrapper = createWrapper({
        value: [{ active: true }, { active: false }]
      })
      expect(wrapper.vm.hasOneMoreCheckboxValue('active')).toBe(true)
    })
    it('hasOneMoreCheckboxValue returns false when same values', () => {
      const wrapper = createWrapper({
        value: [{ active: true }, { active: true }]
      })
      expect(wrapper.vm.hasOneMoreCheckboxValue('active')).toBe(false)
    })
  })

  describe('handleEditClick', () => {
    it('enables edit and pushes to editedPopupProperties', () => {
      const wrapper = createWrapper()
      wrapper.vm.multipleEditDisables = []
      wrapper.vm.editedPopupProperties = []
      wrapper.vm.handleEditClick('name')
      expect(wrapper.vm.multipleEditDisables.name).toBe(true)
      expect(wrapper.vm.editedPopupProperties).toContain('name')
    })
  })

  describe('writeTextToClipBoard', () => {
    it('calls copyToClipboard and catches errors', async () => {
      const { copyToClipboard } = require('@/utils/functions')
      copyToClipboard.mockRejectedValueOnce(new Error('clipboard error'))
      const wrapper = createWrapper()
      await wrapper.vm.writeTextToClipBoard('test')
      expect(copyToClipboard).toHaveBeenCalledWith('test')
    })
  })

  describe('isSaveButtonDisabled with extendedViewDisableChanger', () => {
    it('returns true when extendedViewDisableChanger returns true', () => {
      const wrapper = createWrapper({
        extendedViewDisableChanger: () => true,
        extendedViewCallingApi: false,
        isCancelButtonDisabled: false
      })
      wrapper.setData({
        copyOfEditedRows: [{ a: 1 }],
        defaultValues: [{ a: 1 }]
      })
      expect(wrapper.vm.isSaveButtonDisabled).toBe(true)
    })
    it('returns false when data changed and disableChanger returns false', () => {
      const wrapper = createWrapper({
        extendedViewDisableChanger: () => false,
        extendedViewCallingApi: false,
        isCancelButtonDisabled: false
      })
      wrapper.setData({
        copyOfEditedRows: [{ a: 2 }],
        defaultValues: [{ a: 1 }]
      })
      expect(wrapper.vm.isSaveButtonDisabled).toBe(false)
    })
  })
})
