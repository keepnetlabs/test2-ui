jest.mock('@/api/phishingReporter', () => ({
  searchGeneratedApplicationHistory: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [{ version: '1.0' }] } } })
  ),
  exportPhishingReporterDownloadHistory: jest.fn(() =>
    Promise.resolve({ data: new ArrayBuffer(0) })
  )
}))

jest.mock('@/helper-classes/client-table-export-helper', () => {
  return jest.fn().mockImplementation(() => ({
    addSearchItems: jest.fn(),
    addSortItems: jest.fn(),
    filter: {},
    sortFilter: {}
  }))
})

import { shallowMount } from '@vue/test-utils'
import VersionHistoryModal from '@/components/PhishingReporter/Settings/VersionHistoryModal.vue'

const { searchGeneratedApplicationHistory, exportPhishingReporterDownloadHistory } = require(
  '@/api/phishingReporter'
)

describe('VersionHistoryModal.vue (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'blob:mock')
  })

  const createWrapper = (propsData = {}) =>
    shallowMount(VersionHistoryModal, {
      propsData: { status: true, ...propsData },
      stubs: { AppDialog: true, DataTable: true }
    })

  describe('callForTableData', () => {
    it('fetches data and sets tableData', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      await new Promise((r) => setTimeout(r, 0))
      expect(searchGeneratedApplicationHistory).toHaveBeenCalled()
      expect(wrapper.vm.tableData).toEqual([{ version: '1.0' }])
      expect(wrapper.vm.isLoading).toBe(false)
    })
  })

  describe('handleDetails', () => {
    it('emits handleHistoryRow with row', () => {
      const wrapper = createWrapper()
      const row = { version: '1.0', applicationType: 'PhishingReporter' }
      wrapper.vm.handleDetails(row)
      expect(wrapper.emitted('handleHistoryRow')).toBeTruthy()
      expect(wrapper.emitted('handleHistoryRow')[0]).toEqual([row])
    })
  })

  describe('handleDownload', () => {
    it('does not throw', () => {
      const wrapper = createWrapper()
      expect(() => wrapper.vm.handleDownload({})).not.toThrow()
    })
  })

  describe('exportDownloadHistoryList', () => {
    it('calls exportPhishingReporterDownloadHistory for each export type', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refPhishingReporterDownloadHistory: {
          search: false,
          sortProps: null
        }
      }
      wrapper.vm.exportDownloadHistoryList({
        exportTypes: ['CSV', 'XLS'],
        reportAllPages: false,
        pageNumber: 1,
        pageSize: 10
      })
      await wrapper.vm.$nextTick()
      await new Promise((r) => setTimeout(r, 0))
      expect(exportPhishingReporterDownloadHistory).toHaveBeenCalledTimes(2)
    })
  })

  describe('table structure', () => {
    it('has expected columns', () => {
      const wrapper = createWrapper()
      const columns = wrapper.vm.table.columns
      expect(columns.map((c) => c.property)).toContain('applicationType')
      expect(columns.map((c) => c.property)).toContain('version')
      expect(columns.map((c) => c.property)).toContain('createTime')
    })

    it('has rowActions with handleDetails', () => {
      const wrapper = createWrapper()
      const detailsAction = wrapper.vm.table.rowActions.find((a) => a.action === 'handleDetails')
      expect(detailsAction).toBeDefined()
      expect(detailsAction.name).toBe('Details')
    })
  })
})
