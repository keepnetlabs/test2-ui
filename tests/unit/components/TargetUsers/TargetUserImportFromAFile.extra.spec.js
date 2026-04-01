jest.mock('@/api/targetUsers', () => ({
  updateTransactionId: jest.fn(() => Promise.resolve({ data: { data: { transactionId: 'new-tx' } } })),
  createMapping: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'map-1' } } })),
  searchTmp: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          items: {
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1,
            results: []
          }
        }
      }
    })
  ),
  getTargetUserCustomFieldsByCompanyId: jest.fn(() =>
    Promise.resolve({ data: { data: [{ name: 'Email', isRequired: true }] } })
  )
}))

import TargetUserImportFromAFile from '@/components/TargetUsers/TargetUserImportFromAFile.vue'
import labels from '@/model/constants/labels'
import { LABEL_STORE } from '@/model/constants/commonConstants'
import { updateTransactionId, searchTmp } from '@/api/targetUsers'

const flushMacrotask = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUserImportFromAFile.vue (extra branches)', () => {
  const { computed, methods } = TargetUserImportFromAFile
  const defaultFilterBody = {
    filter: {
      FilterGroups: [
        {
          FilterItems: [{ FieldName: 'Status', Operator: 'Include', Value: 'New,Exists,Error,SCIM' }]
        },
        { FilterItems: [] }
      ]
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getDialogBodyForExceed prefers activeUserCount and falls back to totalUserCount', () => {
    const withActive = computed.getDialogBodyForExceed.call({
      companyLicense: { licenseLimit: 100, activeUserCount: 12, totalUserCount: 50 }
    })
    const withTotal = computed.getDialogBodyForExceed.call({
      companyLicense: { licenseLimit: 100, totalUserCount: 50 }
    })
    const withoutLicense = computed.getDialogBodyForExceed.call({ companyLicense: null })

    expect(withActive).toContain('Current target user count is 12')
    expect(withTotal).toContain('Current target user count is 50')
    expect(withoutLicense).toBe('')
  })

  it('isNextStepDisabled covers loading, invalid step1 and transaction fallback branches', () => {
    expect(
      computed.isNextStepDisabled.call({
        step1Loading: true,
        step2Loading: false,
        activeStep: 1,
        isValidUserFile: true,
        excelInfo: { transactionId: 'tx-1' }
      })
    ).toBe(true)

    expect(
      computed.isNextStepDisabled.call({
        step1Loading: false,
        step2Loading: false,
        activeStep: 1,
        isValidUserFile: false,
        excelInfo: { transactionId: 'tx-1' }
      })
    ).toBe(true)

    expect(
      computed.isNextStepDisabled.call({
        step1Loading: false,
        step2Loading: false,
        activeStep: 2,
        isValidUserFile: true,
        excelInfo: { transactionId: 'tx-1' }
      })
    ).toBe(false)

    expect(
      computed.isNextStepDisabled.call({
        step1Loading: false,
        step2Loading: false,
        activeStep: 2,
        isValidUserFile: true,
        excelInfo: null
      })
    ).toBe(true)
  })

  it('getLabelCount returns values for all supported labels and empty for unknown', () => {
    const ctx = {
      $refs: {
        refValidateList: {
          getSelectedMultipleValues: jest.fn(() => [{ resourceId: 'a' }, { resourceId: 'b' }])
        }
      },
      mappingStatus: { newUserCount: 3, existingUserCount: 4 },
      responsNumbers: { newUserCount: 5, existingUserCount: 6 }
    }

    expect(methods.getLabelCount.call(ctx, labels.ImportSelected)).toBe(2)
    expect(methods.getLabelCount.call(ctx, labels.ImportAll)).toBe(7)
    expect(methods.getLabelCount.call(ctx, 'onlyImportNewUsers')).toBe(5)
    expect(methods.getLabelCount.call(ctx, 'onlyUpdateExistingUsers')).toBe(6)
    expect(methods.getLabelCount.call(ctx, 'unknown-action')).toBe('')
  })

  it('nextStep returns false and opens required-area modal when required mapping is missing', () => {
    const ctx = {
      activeStep: 2,
      totalStep: 3,
      mappingData: {
        headers: [{ selectedValue: { dbName: 'FirstName' } }],
        columns: [{ required: true, dbName: 'Email' }]
      },
      requiredFields: [],
      showRequiredAreaModal: false
    }

    const result = methods.nextStep.call(ctx)

    expect(result).toBe(false)
    expect(ctx.requiredFields).toEqual(['Email'])
    expect(ctx.showRequiredAreaModal).toBe(true)
    expect(ctx.activeStep).toBe(2)
  })

  it('nextStep advances from step1 and triggers excel-data loading flow', () => {
    const getUploadedExcelData = jest.fn()
    const ctx = {
      activeStep: 1,
      totalStep: 3,
      formData: { file: { name: 'users.xlsx' } },
      step2Loading: false,
      getUploadedExcelData
    }

    const result = methods.nextStep.call(ctx)

    expect(result).toBe(true)
    expect(ctx.activeStep).toBe(2)
    expect(ctx.step2Loading).toBe(true)
    expect(getUploadedExcelData).toHaveBeenCalled()
  })

  it('cancelButtonClick toggles confirm dialog when excel exists, otherwise closes overlay', () => {
    const closeOverlay = jest.fn()
    const uploadedCtx = {
      isExcelUploaded: true,
      closeTargetUserImport: false,
      isLeaveAccepted: false,
      closeOverlay
    }
    methods.cancelButtonClick.call(uploadedCtx)
    expect(uploadedCtx.closeTargetUserImport).toBe(true)
    expect(closeOverlay).not.toHaveBeenCalled()

    const plainCtx = {
      isExcelUploaded: false,
      closeTargetUserImport: false,
      isLeaveAccepted: false,
      closeOverlay
    }
    methods.cancelButtonClick.call(plainCtx)
    expect(plainCtx.isLeaveAccepted).toBe(true)
    expect(closeOverlay).toHaveBeenCalled()
  })

  it('updateTransactionId uses new transaction id when api returns one', async () => {
    updateTransactionId.mockResolvedValueOnce({ data: { data: { transactionId: 'tx-new-1' } } })
    const ctx = {
      excelInfo: { transactionId: 'tx-old-1' }
    }

    methods.updateTransactionId.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(updateTransactionId).toHaveBeenCalledWith('tx-old-1')
    expect(ctx.excelInfo.transactionId).toBe('tx-new-1')
  })

  it('updateTransactionId falls back to old id when api returns empty or rejects', async () => {
    updateTransactionId.mockResolvedValueOnce({ data: { data: {} } })
    const emptyResponseCtx = {
      excelInfo: { transactionId: 'tx-old-2' }
    }
    methods.updateTransactionId.call(emptyResponseCtx)
    await Promise.resolve()
    await Promise.resolve()
    expect(emptyResponseCtx.excelInfo.transactionId).toBe('tx-old-2')

    updateTransactionId.mockRejectedValueOnce(new Error('fail'))
    const rejectedCtx = {
      excelInfo: { transactionId: 'tx-old-3' }
    }
    methods.updateTransactionId.call(rejectedCtx)
    await Promise.resolve()
    await Promise.resolve()
    expect(rejectedCtx.excelInfo.transactionId).toBe('tx-old-3')
  })

  it('prevStep clamps at step 1 and does not call reset/update hooks', () => {
    const resetDisabledValuesFromColumns = jest.fn()
    const updateTransactionIdSpy = jest.fn()
    const resetBodyData = jest.fn()
    const ctx = {
      activeStep: 1,
      tableData: [{ id: 1 }],
      resetDisabledValuesFromColumns,
      updateTransactionId: updateTransactionIdSpy,
      resetBodyData
    }

    methods.prevStep.call(ctx)

    expect(ctx.activeStep).toBe(1)
    expect(ctx.tableData).toEqual([{ id: 1 }])
    expect(resetDisabledValuesFromColumns).not.toHaveBeenCalled()
    expect(updateTransactionIdSpy).not.toHaveBeenCalled()
    expect(resetBodyData).not.toHaveBeenCalled()
  })

  it('prevStep from step 3 goes to step 2 and runs transaction/body resets', () => {
    const resetDisabledValuesFromColumns = jest.fn()
    const updateTransactionIdSpy = jest.fn()
    const resetBodyData = jest.fn()
    const ctx = {
      activeStep: 3,
      tableData: [{ id: 1 }],
      resetDisabledValuesFromColumns,
      updateTransactionId: updateTransactionIdSpy,
      resetBodyData
    }

    methods.prevStep.call(ctx)

    expect(ctx.activeStep).toBe(2)
    expect(updateTransactionIdSpy).toHaveBeenCalled()
    expect(resetBodyData).toHaveBeenCalled()
    expect(resetDisabledValuesFromColumns).not.toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks navigation only when excel is uploaded', () => {
    const nextBlocked = jest.fn()
    TargetUserImportFromAFile.beforeRouteLeave.call(
      { isExcelUploaded: true, isLeaveAccepted: false },
      {},
      {},
      nextBlocked
    )
    expect(nextBlocked).toHaveBeenCalledWith(false)

    const nextAllowed = jest.fn()
    TargetUserImportFromAFile.beforeRouteLeave.call(
      { isExcelUploaded: false, isLeaveAccepted: false },
      {},
      {},
      nextAllowed
    )
    expect(nextAllowed).toHaveBeenCalledWith()
  })

  it('tableOptions backupColumns includes Manager and Manager Email columns', () => {
    const { tableOptions } = TargetUserImportFromAFile.data()
    const backupCols = tableOptions.backupColumns
    const managerFullName = backupCols.find((c) => c.property === 'managerFullName')
    const managerEmail = backupCols.find((c) => c.property === 'managerEmail')

    expect(managerFullName).toBeDefined()
    expect(managerFullName.label).toBe('Manager')
    expect(managerFullName.dbName).toBe('ManagerFullName')
    expect(managerEmail).toBeDefined()
    expect(managerEmail.label).toBe('Manager Email')
    expect(managerEmail.dbName).toBe('ManagerEmail')
  })

  it('createMapFields maps ManagerFirstName, ManagerLastName and ManagerEmail to correct backend field names', async () => {
    const { createMapping } = require('@/api/targetUsers')
    createMapping.mockClear()
    createMapping.mockResolvedValueOnce({ data: { data: { resourceId: 'map-1' } } })

    const mockHeaders = [
      {
        name: 'ManagerFirstName',
        selectedValue: { name: 'Manager First Name', dbName: 'ManagerFirstName' }
      },
      {
        name: 'ManagerLastName',
        selectedValue: { name: 'Manager Last Name', dbName: 'ManagerLastName' }
      },
      { name: 'ManagerEmail', selectedValue: { name: 'Manager Email', dbName: 'ManagerEmail' } }
    ]

    const ctx = {
      excelInfo: { transactionId: 'tx-1' },
      formData: { groups: ['g1'] },
      showDatatable: false,
      mappindgId: null,
      getMappingStatus: jest.fn(),
      step3InitialLoading: false,
      getMapTableData: () => ({ headers: mockHeaders }),
      $refs: {
        refMapTable: {
          getMapTableData: () => ({ headers: mockHeaders })
        }
      }
    }

    await methods.createMapFields.call(ctx)

    expect(createMapping).toHaveBeenCalled()
    const payload = createMapping.mock.calls[0][0]
    const fieldMappings = payload.fieldMappings

    expect(fieldMappings).toContainEqual({
      excelColumnName: 'ManagerFirstName',
      fieldName: 'ManagerFirstName'
    })
    expect(fieldMappings).toContainEqual({
      excelColumnName: 'ManagerLastName',
      fieldName: 'ManagerLastName'
    })
    expect(fieldMappings).toContainEqual({
      excelColumnName: 'ManagerEmail',
      fieldName: 'ManagerEmail'
    })
  })

  it('getDatatableList sets managerFullName from managerFirstName+managerLastName when managerFullName is missing', async () => {
    const { searchTmp } = require('@/api/targetUsers')
    const response = {
      data: {
        data: {
          items: {
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1,
            results: [
              {
                status: 'New',
                email: 'david@example.com',
                firstName: 'David',
                lastName: 'Brown',
                managerFirstName: 'Michael',
                managerLastName: 'Johnson',
                managerEmail: 'michael@example.com',
                customFields: [],
                preferredLanguage: 'English',
                validationDetail: []
              }
            ]
          }
        }
      }
    }
    searchTmp.mockReset()
    searchTmp.mockResolvedValue(response)

    const ctx = {
      columns: [],
      mappingData: { columns: [] },
      bodyData: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      excelInfo: { transactionId: 'tx-1' },
      tableOptions: { backupColumns: [{ property: 'firstName' }, { property: 'lastName' }] },
      languageFilterOptions: [{ name: 'English', text: 'English' }],
      serverSideProps: {},
      tableData: [],
      step3Loading: false
    }

    methods.getDatatableList.call(ctx)
    expect(searchTmp).toHaveBeenCalled()
    await searchTmp.mock.results[0].value
    await flushMacrotask()

    expect(ctx.tableData).toHaveLength(1)
    expect(ctx.tableData[0].managerFullName).toBe('Michael Johnson')
    expect(ctx.tableData[0].managerFirstName).toBe('Michael')
    expect(ctx.tableData[0].managerLastName).toBe('Johnson')
  })

  it('callForGetTargetUserCustomFieldsByCompanyId filters ManagerFullName and adds Manager First Name, Last Name, Email to mapping', async () => {
    const { getTargetUserCustomFieldsByCompanyId } = require('@/api/targetUsers')
    getTargetUserCustomFieldsByCompanyId.mockResolvedValueOnce({
      data: { data: [{ name: 'Email', isRequired: true }] }
    })

    const ctx = {
      columns: [
        { label: 'First Name', dbName: 'FirstName', isCustomField: false },
        { label: 'Manager', dbName: 'ManagerFullName', isCustomField: false },
        { label: 'Manager Email', dbName: 'ManagerEmail', isCustomField: false }
      ],
      mappingData: { columns: [] },
      loading: false
    }

    await methods.callForGetTargetUserCustomFieldsByCompanyId.call(ctx)
    await Promise.resolve()

    const colNames = ctx.mappingData.columns.map((c) => c.name)
    expect(colNames).not.toContain('Manager')
    expect(colNames).toContain('Manager First Name')
    expect(colNames).toContain('Manager Last Name')
    expect(colNames).toContain('Manager Email')
  })

  it('getDatatableList keeps managerFullName when it exists', async () => {
    const { searchTmp } = require('@/api/targetUsers')
    const response = {
      data: {
        data: {
          items: {
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1,
            results: [
              {
                status: 'New',
                email: 'david@example.com',
                managerFullName: 'Michael Johnson',
                managerFirstName: 'Michael',
                managerLastName: 'Johnson',
                managerEmail: 'michael@example.com',
                customFields: [],
                preferredLanguage: 'English',
                validationDetail: []
              }
            ]
          }
        }
      }
    }
    searchTmp.mockReset()
    searchTmp.mockResolvedValue(response)

    const ctx = {
      columns: [],
      mappingData: { columns: [] },
      bodyData: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      excelInfo: { transactionId: 'tx-1' },
      tableOptions: { backupColumns: [] },
      languageFilterOptions: [],
      serverSideProps: {},
      tableData: [],
      step3Loading: false
    }

    methods.getDatatableList.call(ctx)
    expect(searchTmp).toHaveBeenCalled()
    await searchTmp.mock.results[0].value
    await flushMacrotask()

    expect(ctx.tableData[0].managerFullName).toBe('Michael Johnson')
  })

  it('validate step empty uses NO_DATA for default no-rows state (search message comes from DataTable slot when filter active)', () => {
    const { tableOptions } = TargetUserImportFromAFile.data()
    expect(tableOptions.empty.message).toBe(LABEL_STORE.NO_DATA)
  })

  it('importValidateDatatableFilterActive is false for default Status-only filter and true for search or non-default Status', () => {
    expect(
      computed.importValidateDatatableFilterActive.call({ bodyData: defaultFilterBody })
    ).toBe(false)

    expect(
      computed.importValidateDatatableFilterActive.call({
        bodyData: {
          filter: {
            FilterGroups: [
              {
                FilterItems: [
                  { FieldName: 'Status', Operator: 'Include', Value: 'New,Exists,Error,SCIM' }
                ]
              },
              {
                FilterItems: [{ FieldName: 'Email', Operator: 'Contains', Value: 'a' }]
              }
            ]
          }
        }
      })
    ).toBe(true)

    expect(
      computed.importValidateDatatableFilterActive.call({
        bodyData: {
          filter: {
            FilterGroups: [
              {
                FilterItems: [{ FieldName: 'Status', Operator: 'Include', Value: 'Error' }]
              },
              { FilterItems: [] }
            ]
          }
        }
      })
    ).toBe(true)

    expect(
      computed.importValidateDatatableFilterActive.call({
        bodyData: {
          filter: {
            FilterGroups: [
              {
                FilterItems: [
                  { FieldName: 'Status', Operator: 'Include', Value: 'New,Exists,Error,SCIM' },
                  { FieldName: 'Email', Operator: 'Contains', Value: 'x' }
                ]
              },
              { FilterItems: [] }
            ]
          }
        }
      })
    ).toBe(true)
  })

  it('filterStatusChange toggles Status filter to Error-only and refetches', () => {
    const getDatatableList = jest.fn()
    const ctx = {
      isShowInvalid: false,
      bodyData: {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'Status', Operator: 'Include', Value: 'New,Exists,Error,SCIM' }
              ]
            },
            { FilterItems: [] }
          ]
        }
      },
      mappingStatus: { totalRowCount: 100, invalidUserCount: 3 },
      step3Loading: false,
      getDatatableList
    }

    methods.filterStatusChange.call(ctx)

    expect(ctx.isShowInvalid).toBe(true)
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems[0].Value).toBe('Error')
    expect(ctx.step3Loading).toBe(true)
    expect(getDatatableList).toHaveBeenCalled()
  })

  it('setTableOption SHOW ALL: preview count (all statuses + search) wins; else file total or current API hits', () => {
    expect(
      methods.setTableOption.call({
        isShowInvalid: false,
        mappingStatus: { totalRowCount: 10, invalidUserCount: 2 }
      })
    ).toBe('ONLY SHOW INVALID (2)')

    const invalidNoSearch = {
      isShowInvalid: true,
      mappingStatus: { totalRowCount: 10, invalidUserCount: 2 },
      bodyData: defaultFilterBody,
      serverSideProps: { totalNumberOfRecords: 3 },
      step3Loading: false
    }
    expect(methods.setTableOption.call(invalidNoSearch)).toBe('SHOW ALL 10')

    const invalidWithSearch = {
      ...invalidNoSearch,
      bodyData: {
        filter: {
          FilterGroups: [
            defaultFilterBody.filter.FilterGroups[0],
            {
              FilterItems: [{ FieldName: 'Email', Operator: 'Contains', Value: 'r' }]
            }
          ]
        }
      },
      serverSideProps: { totalNumberOfRecords: 0 }
    }
    expect(methods.setTableOption.call({ ...invalidWithSearch, showAllPreviewCount: 1 })).toBe(
      'SHOW ALL 1'
    )

    expect(methods.setTableOption.call({ ...invalidWithSearch, showAllPreviewCount: 0 })).toBe(
      'SHOW ALL 0'
    )

    expect(methods.setTableOption.call(invalidWithSearch)).toBe('SHOW ALL 10')

    expect(
      methods.setTableOption.call({
        ...invalidWithSearch,
        serverSideProps: { totalNumberOfRecords: 1 },
        showAllPreviewCount: null
      })
    ).toBe('SHOW ALL 1')

    expect(
      methods.setTableOption.call({
        ...invalidWithSearch,
        step3Loading: true,
        serverSideProps: { totalNumberOfRecords: 1 },
        showAllPreviewCount: null
      })
    ).toBe('SHOW ALL 10')
  })

  it('validate step table marks tmp-unsupported columns as unSearchable for global search', () => {
    const { tableOptions } = TargetUserImportFromAFile.data()
    const langCol = tableOptions.columns.find((c) => c.property === 'preferredLanguage')
    const tzCol = tableOptions.columns.find((c) => c.property === 'timeZone')
    const priCol = tableOptions.columns.find((c) => c.property === 'priority')
    const ctCol = tableOptions.columns.find((c) => c.property === 'createTime')
    expect(langCol.unSearchable).toBe(true)
    expect(tzCol.unSearchable).toBe(true)
    expect(priCol.unSearchable).toBe(true)
    expect(ctCol.unSearchable).toBe(true)
  })

  it('searchChangedEvent strips tmp global-search fields not supported by SearchTmp API', () => {
    const resetPageNumber = jest.fn()
    const callForGetTargetUserCustomFieldsByCompanyId = jest.fn()
    const getDatatableList = jest.fn()
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'FirstName', Operator: 'Contains', Value: 'riley' },
              { FieldName: 'PreferredLanguage', Operator: 'Contains', Value: 'riley' },
              { FieldName: 'TimeZone', Operator: 'Contains', Value: 'riley' },
              { FieldName: 'Priority', Operator: 'Contains', Value: 'riley' },
              { FieldName: 'CreateTime', Operator: 'Contains', Value: 'riley' },
              { FieldName: 'Status', Operator: 'Contains', Value: 'riley' },
              { FieldName: 'Email', Operator: 'Contains', Value: 'riley' }
            ]
          }
        ]
      }
    }
    const ctx = {
      bodyData: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber,
      callForGetTargetUserCustomFieldsByCompanyId,
      getDatatableList
    }

    methods.searchChangedEvent.call(ctx, searchFilter)

    expect(ctx.bodyData.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'FirstName', Operator: 'Contains', Value: 'riley' },
      { FieldName: 'Email', Operator: 'Contains', Value: 'riley' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForGetTargetUserCustomFieldsByCompanyId).toHaveBeenCalled()
    expect(getDatatableList).toHaveBeenCalled()
  })

  it('searchChangedEvent treats Preferred Language (spaced custom field name) as excluded like PreferredLanguage', () => {
    const resetPageNumber = jest.fn()
    const callForGetTargetUserCustomFieldsByCompanyId = jest.fn()
    const getDatatableList = jest.fn()
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'FirstName', Operator: 'Contains', Value: 'x' },
              { FieldName: 'Preferred Language', Operator: 'Contains', Value: 'x' }
            ]
          }
        ]
      }
    }
    const ctx = {
      bodyData: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber,
      callForGetTargetUserCustomFieldsByCompanyId,
      getDatatableList
    }

    methods.searchChangedEvent.call(ctx, searchFilter)

    expect(ctx.bodyData.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'FirstName', Operator: 'Contains', Value: 'x' }
    ])
  })

  it('searchChangedEvent clears OR filters when search term is empty (no Value-only noise to backend)', () => {
    const resetPageNumber = jest.fn()
    const callForGetTargetUserCustomFieldsByCompanyId = jest.fn()
    const getDatatableList = jest.fn()
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'FirstName', Operator: 'Contains', Value: '' },
              { FieldName: 'Email', Operator: 'Contains', Value: '' }
            ]
          }
        ]
      }
    }
    const ctx = {
      bodyData: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [{ FieldName: 'Old', Value: 'x' }] }]
        }
      },
      resetPageNumber,
      callForGetTargetUserCustomFieldsByCompanyId,
      getDatatableList
    }

    methods.searchChangedEvent.call(ctx, searchFilter)

    expect(ctx.bodyData.filter.FilterGroups[1].FilterItems).toEqual([])
  })

  it('fetchShowAllPreviewCount calls searchTmp with full Status and pageSize 1, stores totalNumberOfRecords', async () => {
    searchTmp.mockClear()
    const ctx = {
      isShowInvalid: true,
      excelInfo: { transactionId: 'tx-preview' },
      showAllPreviewRequestId: 0,
      showAllPreviewCount: null,
      bodyData: {
        filter: {
          FilterGroups: [
            { FilterItems: [{ FieldName: 'Status', Operator: 'Include', Value: 'Error' }] },
            {
              FilterItems: [{ FieldName: 'Email', Operator: 'Contains', Value: 'riley' }]
            }
          ]
        }
      }
    }
    methods.fetchShowAllPreviewCount.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(searchTmp).toHaveBeenCalledTimes(1)
    const [payload, transactionId] = searchTmp.mock.calls[0]
    expect(transactionId).toBe('tx-preview')
    expect(payload.pageNumber).toBe(1)
    expect(payload.pageSize).toBe(1)
    expect(
      payload.filter.FilterGroups[0].FilterItems.find((i) => i.FieldName === 'Status').Value
    ).toBe('New,Exists,Error,SCIM')
    expect(payload.filter.FilterGroups[1].FilterItems[0].Value).toBe('riley')
    expect(ctx.showAllPreviewCount).toBe(1)
  })

  it('fetchShowAllPreviewCount does not call searchTmp when not invalid-only or no global search', () => {
    searchTmp.mockClear()
    methods.fetchShowAllPreviewCount.call({
      isShowInvalid: false,
      excelInfo: { transactionId: 'tx' },
      bodyData: defaultFilterBody,
      showAllPreviewCount: 9
    })
    expect(searchTmp).not.toHaveBeenCalled()

    searchTmp.mockClear()
    methods.fetchShowAllPreviewCount.call({
      isShowInvalid: true,
      excelInfo: { transactionId: 'tx' },
      bodyData: defaultFilterBody,
      showAllPreviewCount: 9
    })
    expect(searchTmp).not.toHaveBeenCalled()

    searchTmp.mockClear()
    methods.fetchShowAllPreviewCount.call({
      isShowInvalid: true,
      excelInfo: null,
      bodyData: defaultFilterBody
    })
    expect(searchTmp).not.toHaveBeenCalled()
  })

  it('resetBodyData clears showAllPreviewCount and resets default filter payload', () => {
    const ctx = {
      showAllPreviewCount: 3,
      bodyData: {
        pageNumber: 4,
        filter: {
          FilterGroups: [
            { FilterItems: [{ FieldName: 'Status', Value: 'Error' }] },
            { FilterItems: [{ FieldName: 'Email', Value: 'x' }] }
          ]
        }
      }
    }
    methods.resetBodyData.call(ctx)
    expect(ctx.showAllPreviewCount).toBeNull()
    expect(ctx.bodyData.pageNumber).toBe(1)
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems[0].Value).toBe('New,Exists,Error,SCIM')
    expect(ctx.bodyData.filter.FilterGroups[1].FilterItems).toEqual([])
  })

  it('filterStatusChange clears showAllPreviewCount when leaving invalid-only mode', () => {
    const getDatatableList = jest.fn()
    const ctx = {
      isShowInvalid: true,
      showAllPreviewCount: 2,
      bodyData: {
        filter: {
          FilterGroups: [
            {
              FilterItems: [{ FieldName: 'Status', Operator: 'Include', Value: 'Error' }]
            },
            { FilterItems: [] }
          ]
        }
      },
      step3Loading: false,
      getDatatableList
    }
    methods.filterStatusChange.call(ctx)
    expect(ctx.showAllPreviewCount).toBeNull()
    expect(ctx.isShowInvalid).toBe(false)
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems[0].Value).toBe('New,Exists,Error,SCIM')
    expect(getDatatableList).toHaveBeenCalled()
  })
})
