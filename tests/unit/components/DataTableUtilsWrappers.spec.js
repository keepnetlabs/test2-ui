jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getBtnStatusColor: jest.fn((v) => `status-${v}`),
    getBtnPriorityColor: jest.fn((v) => `priority-${v}`),
    getDataTableFieldLabel: jest.fn((v) => `label-${v}`),
    copyToClipboard: jest.fn()
  }
})

import DataTable from '@/components/DataTable.vue'
import {
  getBtnStatusColor,
  getBtnPriorityColor,
  getDataTableFieldLabel,
  copyToClipboard
} from '@/utils/functions'

describe('DataTable.vue utility wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('delegates color/label wrapper methods to utility functions', () => {
    expect(DataTable.methods.getBtnStatusColor('Delivered')).toBe('status-Delivered')
    expect(getBtnStatusColor).toHaveBeenCalledWith('Delivered')

    expect(DataTable.methods.getBtnPriorityColor('High')).toBe('priority-High')
    expect(getBtnPriorityColor).toHaveBeenCalledWith('High')

    expect(DataTable.methods.getDataTableFieldLabel('abc')).toBe('label-abc')
    expect(getDataTableFieldLabel).toHaveBeenCalledWith('abc')
  })

  it('handleCopy builds export text and calls copyToClipboard', () => {
    const ctx = {
      columns: [{ property: 'name' }, { property: 'status' }]
    }
    const selections = [
      { name: 'Alice', status: 'Active' },
      { name: 'Bob' }
    ]

    DataTable.methods.handleCopy.call(ctx, selections)
    expect(copyToClipboard).toHaveBeenCalled()
    const copiedText = copyToClipboard.mock.calls[0][0]
    expect(copiedText).toContain('Alice Active')
    expect(copiedText).toContain('Bob Empty')
  })

  it('setCellClass delegates to custom handler when provided', () => {
    const handleSetCellClass = jest.fn(() => 'custom-class')
    const ctx = { handleSetCellClass }
    const obj = { row: { id: 1 } }

    const result = DataTable.methods.setCellClass.call(ctx, obj)
    expect(handleSetCellClass).toHaveBeenCalledWith(obj)
    expect(result).toBe('custom-class')
  })
})
