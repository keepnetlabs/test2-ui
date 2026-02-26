import CampaignManagerReportSubmittedMfaCodeTable from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmittedMfa: jest.fn(),
    exportCampaignJobUserEmailSubmittedMfa: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customX', label: 'Custom X' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing/CampaignManagerReportSubmittedMfaCodeTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data() builds rowActions for printout mode', () => {
    const data = CampaignManagerReportSubmittedMfaCodeTable.data.call({
      getQuishingTypePrintOut: () => true,
      $store: {
        getters: {
          'permissions/getQuishingCampaignReportsSubmittedDataDetailsPermissions': true
        }
      }
    })

    expect(data.tableOptions.rowActions).toHaveLength(1)
    expect(data.tableOptions.rowActions[0].action).toBe('on-detail')
  })

  it('data() builds rowActions for non-printout mode and handles disabled permission', () => {
    const data = CampaignManagerReportSubmittedMfaCodeTable.data.call({
      getQuishingTypePrintOut: () => false,
      $store: {
        getters: {
          'permissions/getQuishingCampaignReportsSubmittedDataDetailsPermissions': false
        }
      }
    })

    expect(data.tableOptions.rowActions).toHaveLength(2)
    expect(data.tableOptions.rowActions[0].disabled).toBe(true)
    expect(data.tableOptions.rowActions[1].action).toBe('on-resend')
  })

  it('customFields watcher inserts fields when department index is positive', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'firstName' }, { property: 'department' }, { property: 'email' }]
      }
    }
    CampaignManagerReportSubmittedMfaCodeTable.watch.customFields.handler.call(ctx, [
      { name: 'x' }
    ])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual([
      'firstName',
      'department',
      'customX',
      'email'
    ])
  })

  it('customFields watcher skips insert when department index is 0', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'department' }, { property: 'email' }]
      }
    }
    CampaignManagerReportSubmittedMfaCodeTable.watch.customFields.handler.call(ctx, [
      { name: 'x' }
    ])

    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('handleOnResend supports array items, excluded list and selectAll', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { q: 'x' } },
      $emit: emit
    }

    CampaignManagerReportSubmittedMfaCodeTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      ['u3'],
      true
    )

    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [8],
      items: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { q: 'x' }
    })
  })

  it('callForData maps payload and flattens custom fields', async () => {
    QuishingService.searchCampaignJobUserEmailSubmittedMfa.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'Office', value: 'TR' }] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} },
      id: 'job-1',
      instanceGroup: 'ig-1',
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportSubmittedMfaCodeTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenNthCalledWith(1, true)
    expect(ctx.tableData[0].Office).toBe('TR')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
