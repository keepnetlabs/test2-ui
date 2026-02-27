import { shallowMount } from '@vue/test-utils'
import TargetGroupUsersTable from '@/components/TargetUsers/GroupUsers/TargetGroupUsersTable.vue'

jest.mock('@/api/targetUsers', () => ({
  exportTargetGroupUsers: jest.fn(() =>
    Promise.resolve({
      data: new (globalThis.Blob || global.Blob)(['x'], { type: 'application/octet-stream' })
    })
  ),
  getTargetGroup: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getTargetUserCustomFieldsByCompanyId: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getTargetUsers: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  searchTargetGroupUsers: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } }))
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() =>
      Promise.resolve([
        { isoFriendlyName: 'English', name: 'English', resourceId: 'en-id' },
        { isoFriendlyName: 'Turkish', name: 'Turkish', resourceId: 'tr-id' }
      ])
    )
  }
}))

const {
  exportTargetGroupUsers,
  getTargetGroup,
  getTargetUserCustomFieldsByCompanyId,
  getTargetUsers,
  searchTargetGroupUsers
} = require('@/api/targetUsers')
const LookupLocalStorage = require('@/helper-classes/lookup-local-storage').default
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetGroupUsersTable.vue', () => {
  const createWrapper = (overrides = {}) =>
    shallowMount(TargetGroupUsersTable, {
      stubs: {
        DataTable: true,
        TargetUserRowActionsEditButton: true,
        TargetUserRowActionsRemoveFromGroupButton: true,
        DefaultMenuRowAction: true,
        RowActionsMenu: true
      },
      mocks: {
        $route: { params: {} },
        $store: {
          getters: {
            'common/getTimezones': { timeZoneList: [] }
          },
          dispatch: jest.fn()
        },
        ...(overrides.mocks || {})
      },
      propsData: {
        resourceId: '',
        ...((overrides && overrides.propsData) || {})
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes group editability from route params and group flags', async () => {
    const wrapper = createWrapper({ mocks: { $route: { params: { isGroupEditable: 'false' } } } })
    expect(wrapper.vm.isGroupEditableParam).toBe(false)

    wrapper.vm.$route.params.isGroupEditable = 'true'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isGroupEditableParam).toBe(true)

    wrapper.vm.$route.params = {}
    wrapper.setData({ isScimGroup: true, isGoogleGroup: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isGroupEditableParam).toBe(false)
  })

  it('returns remove button style and tooltip variants', async () => {
    const wrapper = createWrapper()

    wrapper.setData({ isScimGroup: true, isGoogleGroup: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.canRemoveUsers).toBe(false)
    expect(wrapper.vm.getRemoveUsersButtonStyle).toEqual({ opacity: 0.5, pointerEvents: 'none' })
    expect(wrapper.vm.removeUsersTooltip).toBe('Users cannot be removed from SCIM groups.')

    wrapper.setData({ isScimGroup: false, isGoogleGroup: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.removeUsersTooltip).toBe('Users cannot be removed from the Google group.')
  })

  it('updates empty state and add button from groupName watcher', async () => {
    const wrapper = createWrapper()

    wrapper.setProps({ groupName: 'Repeat Offenders' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableOptions.iEmpty.message).toBe(
      'No repeat offenders found in the last 3 months'
    )
    expect(wrapper.vm.tableOptions.addButton.show).toBe(false)

    wrapper.setProps({ groupName: 'New Hires' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableOptions.iEmpty.message).toBe('There is no user in this group')
    expect(wrapper.vm.tableOptions.addButton.show).toBe(false)

    wrapper.setProps({ groupName: 'Any Other Group' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableOptions.iEmpty.btn).toBe('Add Users')
    expect(wrapper.vm.tableOptions.addButton.show).toBe(true)
  })

  it('handleAddUsersSelectionClick emits default server-side params when table ref is missing', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refTargetGroupUsersTable = {
      getServerSideSelectionParams: () => undefined
    }
    wrapper.setData({ selections: [{ resourceId: 'u1' }] })

    wrapper.vm.handleAddUsersSelectionClick()
    const [selections, filter, serverSideParams, serverSideProps] = wrapper.emitted()
      .handleAddUsersSelectionClick[0]

    expect(selections).toEqual([{ resourceId: 'u1' }])
    expect(filter).toEqual(wrapper.vm.axiosPayload.filter)
    expect(serverSideParams).toEqual({ isSelectedAllEver: false, excludedResourceIdList: [] })
    expect(serverSideProps).toBe(wrapper.vm.serverSideProps)
  })

  it('handleAddUsersSelectionClick uses table ref selection params when available', () => {
    const wrapper = createWrapper()
    const getServerSideSelectionParams = jest.fn(() => ({
      isSelectedAllEver: true,
      excludedResourceIdList: ['x']
    }))
    wrapper.vm.$refs.refTargetGroupUsersTable = { getServerSideSelectionParams }

    wrapper.vm.handleAddUsersSelectionClick()
    const [, , serverSideParams] = wrapper.emitted().handleAddUsersSelectionClick[0]
    expect(serverSideParams).toEqual({
      isSelectedAllEver: true,
      excludedResourceIdList: ['x']
    })
  })

  it('handleRemoveUsersSelectionClick respects canRemoveUsers guard', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ isScimGroup: true, selections: [{ resourceId: 'u1' }] })
    await wrapper.vm.$nextTick()

    wrapper.vm.handleRemoveUsersSelectionClick()
    expect(wrapper.emitted().handleRemoveUsersSelectionClick).toBeFalsy()

    wrapper.setData({ isScimGroup: false, isGoogleGroup: false })
    await wrapper.vm.$nextTick()
    wrapper.vm.handleRemoveUsersSelectionClick()
    expect(wrapper.emitted().handleRemoveUsersSelectionClick[0][0]).toEqual([{ resourceId: 'u1' }])
  })

  it('setTimeZoneFilterableItems maps timezone list and rerenders filters', async () => {
    const wrapper = createWrapper({
      mocks: {
        $store: {
          getters: {
            'common/getTimezones': {
              timeZoneList: [{ displayName: 'UTC', id: 'utc' }]
            }
          },
          dispatch: jest.fn()
        }
      }
    })
    const reRenderFilters = jest.fn()
    wrapper.vm.$refs.refTargetGroupUsersTable = { reRenderFilters }

    wrapper.vm.setTimeZoneFilterableItems()
    const timezoneColumn = wrapper.vm.defaultColumns.find((col) => col.property === 'timeZone')
    expect(timezoneColumn.filterableItems[0]).toEqual({ text: 'Blank', value: 'Blank' })
    expect(timezoneColumn.filterableItems[1]).toEqual({ text: 'UTC', value: 'utc' })
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('callForTargetGroup marks group flags and hides add button for SCIM/Google', async () => {
    getTargetGroup.mockResolvedValueOnce({
      data: { data: { isScimGroup: true, isGoogleGroup: false } }
    })
    const wrapper = createWrapper({ propsData: { resourceId: 'group-1' } })
    await flushPromises()

    expect(wrapper.vm.isScimGroup).toBe(true)
    expect(wrapper.vm.isGoogleGroup).toBe(false)
    expect(wrapper.vm.tableOptions.addButton.show).toBe(false)
  })

  it('exportTargetGroupsUserList maps XLS to Excel and triggers download', async () => {
    const wrapper = createWrapper({ propsData: { resourceId: 'group-export' } })
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:x')
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:test')

    const initialCreateObjectURLCalls = createObjectURLSpy.mock.calls.length
    const initialClickCalls = click.mock.calls.length

    try {
      wrapper.vm.exportTargetGroupsUserList({
        exportTypes: ['XLS', 'CSV'],
        reportAllPages: true,
        pageNumber: 1,
        pageSize: 10
      })
      await flushPromises()

      expect(exportTargetGroupUsers).toHaveBeenNthCalledWith(
        1,
        'group-export',
        expect.objectContaining({ exportType: 'Excel' })
      )
      expect(exportTargetGroupUsers).toHaveBeenNthCalledWith(
        2,
        'group-export',
        expect.objectContaining({ exportType: 'CSV' })
      )
      expect(createObjectURLSpy.mock.calls.length - initialCreateObjectURLCalls).toBe(2)
      expect(click.mock.calls.length - initialClickCalls).toBe(2)
    } finally {
      createElementSpy.mockRestore()
      createObjectURLSpy.mockRestore()
    }
  })

  it('created calls timezone dispatch and language lookup', async () => {
    const dispatch = jest.fn()
    createWrapper({
      mocks: {
        $store: {
          getters: { 'common/getTimezones': { timeZoneList: [] } },
          dispatch
        }
      }
    })
    await flushPromises()

    expect(dispatch).toHaveBeenCalledWith('common/getTimezone')
    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
  })

  it('callForGetTimeZones does not dispatch when timezone list already exists', () => {
    const dispatch = jest.fn()
    const wrapper = createWrapper({
      mocks: {
        $store: {
          getters: { 'common/getTimezones': { timeZoneList: [{ id: 'utc', displayName: 'UTC' }] } },
          dispatch
        }
      }
    })

    wrapper.vm.callForGetTimeZones()
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('handleSearchChange removes TimeZone and PreferredLanguage filters before refresh', () => {
    const wrapper = createWrapper()
    wrapper.vm.resetPageNumber = jest.fn()
    wrapper.vm.callForGetTargetUserCustomFieldsByCompanyId = jest.fn()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'TimeZone', Value: 'UTC' },
              { FieldName: 'PreferredLanguage', Value: 'English' },
              { FieldName: 'Email', Value: 'a@test.com' }
            ]
          }
        ]
      }
    })

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Email', Value: 'a@test.com' }
    ])
    expect(wrapper.vm.resetPageNumber).toHaveBeenCalled()
    expect(wrapper.vm.callForGetTargetUserCustomFieldsByCompanyId).toHaveBeenCalled()
  })

  it('callForGetTargetUserCustomFieldsByCompanyId loads active custom fields sorted and continues search', async () => {
    getTargetUserCustomFieldsByCompanyId.mockResolvedValueOnce({
      data: {
        data: [
          { name: 'B', isActive: true, sortOrder: 2, fieldDataType: 'String' },
          { name: 'A', isActive: true, sortOrder: 1, fieldDataType: 'String' },
          { name: 'C', isActive: false, sortOrder: 3, fieldDataType: 'String' }
        ]
      }
    })
    const wrapper = createWrapper()
    wrapper.vm.callForSearchTargetGroupUsers = jest.fn()
    wrapper.vm.addCustomFieldColumns = jest.fn()
    wrapper.setData({ customFields: [] })

    wrapper.vm.callForGetTargetUserCustomFieldsByCompanyId()
    await flushPromises()

    expect(getTargetUserCustomFieldsByCompanyId).toHaveBeenCalled()
    expect(wrapper.vm.customFields.map((i) => i.name)).toEqual(['A', 'B'])
    expect(wrapper.vm.addCustomFieldColumns).toHaveBeenCalled()
    expect(wrapper.vm.callForSearchTargetGroupUsers).toHaveBeenCalled()
  })

  it('callForGetTargetUserCustomFieldsByCompanyId skips fetch when custom fields already exist', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForSearchTargetGroupUsers = jest.fn()
    wrapper.setData({
      customFields: [{ name: 'existing', isActive: true, sortOrder: 1, fieldDataType: 'String' }]
    })

    wrapper.vm.callForGetTargetUserCustomFieldsByCompanyId()

    expect(getTargetUserCustomFieldsByCompanyId).not.toHaveBeenCalled()
    expect(wrapper.vm.callForSearchTargetGroupUsers).toHaveBeenCalled()
  })

  it('callForSearchTargetGroupUsers uses searchTargetGroupUsers and maps custom field values', async () => {
    searchTargetGroupUsers.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 2,
          results: [
            {
              preferredLanguage: 'English',
              customFieldValues: [
                { name: 'isAdmin', value: 'True', dataType: 'Boolean' },
                { name: 'startDate', value: 'x', dataType: 'DateTime', timestampValue: '2024-01-01' },
                { name: 'note', value: 'Some text', dataType: 'Text' }
              ]
            }
          ]
        }
      }
    })
    const wrapper = createWrapper()
    wrapper.setData({
      languageFilterOptions: [{ text: 'English', name: 'English', value: 'en-id' }]
    })

    wrapper.vm.callForSearchTargetGroupUsers('group-9')
    await flushPromises()

    expect(searchTargetGroupUsers).toHaveBeenCalledWith('group-9', wrapper.vm.axiosPayload)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(2)
    expect(wrapper.vm.tableData[0].preferredLanguage).toBe('English')
    expect(wrapper.vm.tableData[0].isAdmin).toBe('Yes')
    expect(wrapper.vm.tableData[0].startDate).toBe('2024-01-01')
    expect(wrapper.vm.tableData[0].note).toBe('Some text')
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForSearchTargetGroupUsers uses getTargetUsers when isCallTargetUserSearch is true', async () => {
    getTargetUsers.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            {
              preferredLanguage: 'Turkish',
              customFieldValues: [{ name: 'flag', value: 'False', dataType: 'Boolean' }]
            }
          ]
        }
      }
    })
    const wrapper = createWrapper({ propsData: { isCallTargetUserSearch: true } })
    wrapper.setData({
      languageFilterOptions: [{ text: 'Turkish', name: 'Turkish', value: 'tr-id' }]
    })

    wrapper.vm.callForSearchTargetGroupUsers()
    await flushPromises()

    expect(getTargetUsers).toHaveBeenCalledWith(wrapper.vm.axiosPayload)
    expect(wrapper.vm.tableData[0].preferredLanguage).toBe('Turkish')
    expect(wrapper.vm.tableData[0].flag).toBe('No')
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForSearchTargetGroupUsers emits route-back on 404 errors', async () => {
    searchTargetGroupUsers.mockRejectedValueOnce({ response: { status: 404 } })
    const wrapper = createWrapper({ propsData: { resourceId: 'group-404' } })

    wrapper.vm.callForSearchTargetGroupUsers()
    await flushPromises()

    expect(wrapper.emitted().handleRouteBackToTargetUsers).toBeTruthy()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('column and pagination handlers trigger refresh and emit selection', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForGetTargetUserCustomFieldsByCompanyId = jest.fn()

    wrapper.vm.serverSidePageNumberChanged(3)
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(3)

    wrapper.vm.serverSideSizeChanged(25)
    expect(wrapper.vm.axiosPayload.pageSize).toBe(25)
    expect(wrapper.vm.serverSideProps.pageSize).toBe(25)
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(1)

    wrapper.vm.sortChanged({ order: 'ascending', prop: 'email' })
    expect(wrapper.vm.axiosPayload.ascending).toBe(true)
    expect(wrapper.vm.axiosPayload.orderBy).toBe('email')

    wrapper.vm.handleSelectionChange([{ resourceId: 'u1' }], ['u2'], true)
    expect(wrapper.vm.selections).toEqual([{ resourceId: 'u1' }])
    expect(wrapper.emitted().handleSelectionChange[0]).toEqual([[{ resourceId: 'u1' }], ['u2'], true])

    expect(wrapper.vm.callForGetTargetUserCustomFieldsByCompanyId).toHaveBeenCalledTimes(3)
  })
})
