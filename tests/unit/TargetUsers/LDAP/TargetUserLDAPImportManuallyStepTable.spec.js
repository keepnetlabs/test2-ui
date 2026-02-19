import TargetUserLDAPImportManuallyStepTable from '@/components/TargetUsers/LDAP/TargetUserLDAPImportManuallyStepTable.vue'
import LDAPService from '@/api/ldap'

jest.mock('@/api/ldap', () => ({
  __esModule: true,
  default: {
    searchTmpTargetUsersForLdap: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            items: {
              results: [],
              totalNumberOfRecords: 0,
              totalNumberOfPages: 0,
              pageNumber: 1
            }
          }
        }
      })
    )
  }
}))

jest.mock('@/components/TargetUsers/LDAP/utils', () => ({
  getAxiosPayloadOfManuallyTable: jest.fn(() => ({
    pageNumber: 1,
    pageSize: 10,
    filter: {
      FilterGroups: [
        {
          FilterItems: [{ FieldName: 'Status', Operator: 'Include', Value: 'New,Exists,Error' }]
        },
        { FilterItems: [] }
      ]
    }
  }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUserLDAPImportManuallyStepTable.vue', () => {
  it('computes validity button text and invalid count', () => {
    const invalidCount = TargetUserLDAPImportManuallyStepTable.computed.getInvalidUserCount.call({
      getMappingObject: () => ({ invalidUserCount: 7 })
    })
    expect(invalidCount).toBe(7)

    expect(
      TargetUserLDAPImportManuallyStepTable.computed.getValidityButtonText.call({
        isShowInvalid: false,
        getInvalidUserCount: 7
      })
    ).toBe('ONLY SHOW INVALID (7)')

    expect(
      TargetUserLDAPImportManuallyStepTable.computed.getValidityButtonText.call({
        isShowInvalid: true,
        getInvalidUserCount: 7
      })
    ).toBe('SHOW ALL')
  })

  it('getTimezones watcher triggers setTimeZoneFilterableItems when list exists', () => {
    const setTimeZoneFilterableItems = jest.fn()
    TargetUserLDAPImportManuallyStepTable.watch.getTimezones.handler.call(
      { setTimeZoneFilterableItems },
      { timeZoneList: [{ id: 'tz-1' }] }
    )
    expect(setTimeZoneFilterableItems).toHaveBeenCalled()
  })

  it('callForGetTimeZones dispatches only when timezone list is empty', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: {
        getters: { 'common/getTimezones': { timeZoneList: [] } },
        dispatch
      }
    }
    TargetUserLDAPImportManuallyStepTable.methods.callForGetTimeZones.call(ctx)
    expect(dispatch).toHaveBeenCalledWith('common/getTimezone')

    const ctx2 = {
      $store: {
        getters: { 'common/getTimezones': { timeZoneList: [{ id: 'x' }] } },
        dispatch: jest.fn()
      }
    }
    TargetUserLDAPImportManuallyStepTable.methods.callForGetTimeZones.call(ctx2)
    expect(ctx2.$store.dispatch).not.toHaveBeenCalled()
  })

  it('handleSearchChange copies search filters, removes TimeZone, resets page and refreshes', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            { FilterItems: [] },
            { FilterItems: [{ FieldName: 'TimeZone', Value: 'tz-1' }] }
          ]
        }
      },
      resetPageNumber,
      callForData
    }
    TargetUserLDAPImportManuallyStepTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'Email', Operator: 'Contains', Value: 'a' }] }]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Email', Operator: 'Contains', Value: 'a' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('setTimeZoneFilterableItems maps timezones and prepends Blank option', () => {
    const data = TargetUserLDAPImportManuallyStepTable.data.call({
      hideFilter: false,
      viewUsersTableFilterParams: null
    })
    const ref = { reRenderFilters: jest.fn() }
    const ctx = {
      ...data,
      getTimezones: {
        timeZoneList: [
          { id: 'tz-1', displayName: 'UTC' },
          { id: 'tz-2', displayName: 'Europe/Istanbul' }
        ]
      },
      $set: (obj, key, value) => {
        obj[key] = value
      },
      $refs: { refPeopleTable: ref }
    }

    TargetUserLDAPImportManuallyStepTable.methods.setTimeZoneFilterableItems.call(ctx)
    const tzColumn = ctx.tableOptions.columns.find((c) => c.property === ctx.tableOptions.columns[5].property)
    expect(tzColumn.filterableItems[0]).toEqual({ text: 'Blank', value: 'Blank' })
    expect(tzColumn.filterableItems[1]).toEqual({ text: 'UTC', value: 'tz-1' })
    expect(ref.reRenderFilters).toHaveBeenCalled()
  })

  it('createCustomFields creates filterable types and appends status column once', () => {
    const data = TargetUserLDAPImportManuallyStepTable.data.call({
      hideFilter: false,
      viewUsersTableFilterParams: null
    })
    const ctx = { ...data }
    const rows = [
      {
        customFields: [
          { name: 'isActive', dataType: 'boolean' },
          { name: 'hiredAt', dataType: 'date' },
          { name: 'score', dataType: 'number' }
        ]
      }
    ]

    TargetUserLDAPImportManuallyStepTable.methods.createCustomFields.call(ctx, rows)
    expect(ctx.customFields).toHaveLength(3)
    expect(ctx.customFields[0].filterableType).toBe('select')
    expect(ctx.customFields[0].filterableItems).toEqual([
      { text: 'Yes', value: 1 },
      { text: 'No', value: 0 }
    ])
    expect(ctx.customFields[1].filterableType).toBe('dateOnly')
    expect(ctx.customFields[2].filterableType).toBe('text')
    expect(ctx.tableOptions.columns.some((c) => c.property === 'status')).toBe(true)
  })

  it('setTableData flattens custom field values into rows', () => {
    const ctx = { tableData: [] }
    TargetUserLDAPImportManuallyStepTable.methods.setTableData.call(ctx, [
      {
        firstName: 'A',
        customFields: [
          { name: 'JobTitle', value: 'Analyst' },
          { name: 'Region', value: 'EU' }
        ]
      }
    ])
    expect(ctx.tableData[0].JobTitle).toBe('Analyst')
    expect(ctx.tableData[0].Region).toBe('EU')
  })

  it('handleValidityButton toggles filter value and refreshes', () => {
    const callForData = jest.fn()
    const ctx = {
      isShowInvalid: false,
      hideFilter: false,
      axiosPayload: {
        filter: {
          FilterGroups: [
            {
              FilterItems: [{ FieldName: 'Status', Operator: 'Include', Value: 'New,Exists,Error' }]
            }
          ]
        }
      },
      callForData
    }
    TargetUserLDAPImportManuallyStepTable.methods.handleValidityButton.call(ctx)
    expect(ctx.isShowInvalid).toBe(true)
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('Error')
    expect(callForData).toHaveBeenCalled()
  })

  it('handleSelectionChange sends selection only when filter is visible', () => {
    const setSelectedUsers = jest.fn()
    TargetUserLDAPImportManuallyStepTable.methods.handleSelectionChange.call(
      { hideFilter: false, setSelectedUsers },
      [{ id: 1 }]
    )
    expect(setSelectedUsers).toHaveBeenCalledWith([{ id: 1 }])

    const setSelectedUsers2 = jest.fn()
    TargetUserLDAPImportManuallyStepTable.methods.handleSelectionChange.call(
      { hideFilter: true, setSelectedUsers: setSelectedUsers2 },
      [{ id: 2 }]
    )
    expect(setSelectedUsers2).not.toHaveBeenCalled()
  })

  it('callForData updates pagination and emits total records', async () => {
    LDAPService.searchTmpTargetUsersForLdap.mockResolvedValueOnce({
      data: {
        data: {
          items: {
            results: [{ id: 1, customFields: [] }],
            totalNumberOfRecords: 11,
            totalNumberOfPages: 2,
            pageNumber: 1
          }
        }
      }
    })
    const setTableData = jest.fn()
    const createCustomFields = jest.fn()
    const setTotalNumberOfRecords = jest.fn()
    const emit = jest.fn()
    const ctx = {
      setLoading: jest.fn(),
      getTransactionId: () => 'trx-1',
      axiosPayload: { pageNumber: 1 },
      hideFilter: false,
      setTotalNumberOfRecords,
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      customFields: [],
      createCustomFields,
      setTableData,
      $emit: emit
    }

    TargetUserLDAPImportManuallyStepTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(LDAPService.searchTmpTargetUsersForLdap).toHaveBeenCalledWith(ctx.axiosPayload, 'trx-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(11)
    expect(setTotalNumberOfRecords).toHaveBeenCalledWith(11)
    expect(emit).toHaveBeenCalledWith('update:totalNumberOfRecords', 11)
    expect(createCustomFields).toHaveBeenCalled()
    expect(setTableData).toHaveBeenCalledWith([{ id: 1, customFields: [] }])
  })
})
