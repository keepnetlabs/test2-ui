import { COLUMNS } from '@/components/QuishingCampaignManagerReport/OpenedAttachment/utils'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('QuishingCampaignManagerReport OpenedAttachment utils', () => {
  it('contains expected attachment specific columns', () => {
    expect(COLUMNS.FIRST_NAME.property).toBe(PROPERTY_STORE.FIRSTNAME)
    expect(COLUMNS.LAST_OPENED.property).toBe('lastAttachmentOpenedTime')
    expect(COLUMNS.TIMES_OPENED.property).toBe('attachmentOpenedCount')
  })

  it('keeps delivery and ip column configuration', () => {
    expect(COLUMNS.DELIVERY_STATUS.type).toBe('badge')
    expect(COLUMNS.SUBMITTED_DATA_IP.fixed).toBe('false')
  })
})
