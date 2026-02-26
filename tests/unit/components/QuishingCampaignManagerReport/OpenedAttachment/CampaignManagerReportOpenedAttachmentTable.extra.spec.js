import CampaignManagerReportOpenedAttachmentTable from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserAttachmentOpened: jest.fn(),
    exportCampaignJobUserAttachmentOpened: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customAttachment', label: 'Custom Attachment' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedAttachmentTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('customFields watcher does not insert when department index is 0', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    CampaignManagerReportOpenedAttachmentTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('handleOnResend maps array items with excluded ids and selectAll', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { q: 'a' } },
      $emit: emit
    }

    CampaignManagerReportOpenedAttachmentTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      ['u3'],
      true
    )

    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [1],
      items: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { q: 'a' }
    })
  })

  it('callForData safely maps empty custom fields and finalizes loading', async () => {
    QuishingService.searchCampaignJobUserAttachmentOpened.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ customFieldValues: [] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} },
      id: 'c1',
      instanceGroup: 'ig1',
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportOpenedAttachmentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenNthCalledWith(1, true)
    expect(ctx.tableData).toHaveLength(1)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
