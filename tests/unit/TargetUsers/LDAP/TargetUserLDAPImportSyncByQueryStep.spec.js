import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportSyncByQueryStep from '@/components/TargetUsers/LDAP/TargetUserLDAPImportSyncByQueryStep.vue'
import { getAxiosPayloadOfManuallyTable } from '@/components/TargetUsers/LDAP/utils'

jest.mock('@/components/TargetUsers/LDAP/utils', () => ({
  getAxiosPayloadOfManuallyTable: jest.fn(() => ({
    filter: { FilterGroups: [{}, {}] }
  }))
}))

describe('TargetUserLDAPImportSyncByQueryStep.vue', () => {
  const createWrapper = (editedFilter = null) =>
    shallowMount(TargetUserLDAPImportSyncByQueryStep, {
      provide: {
        fieldMappings: [
          { text: 'Department', customFieldResourceId: 'department' },
          { text: 'TimeZone', customFieldResourceId: 'timezone' }
        ],
        customFields: [{ name: 'Department', resourceId: 'department' }],
        getEditedScheduledFilter: () => editedFilter
      },
      stubs: {
        VueQueryBuilder: { template: '<div><slot :query="{}" /></div>' },
        QueryBuilderGroup: { template: '<div><slot name="group-footer" /></div>' },
        TargetUserLDAPImportSyncByQueryViewUsers: true,
        VForm: true,
        VBtn: true,
        VIcon: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with expected component name and default state', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('TargetUserLDAPImportSyncByQueryStep')
    expect(wrapper.vm.showUsersDialog).toBe(false)
    expect(wrapper.vm.query.children[0].query.logicalOperator).toBe('AND')
  })

  it('setEditedFilter loads AND filter items from edited schedule filter', () => {
    const wrapper = createWrapper({
      filterGroups: [
        {
          filterItems: [{ fieldName: 'Department', operator: 'Include', value: 'IT' }]
        },
        { filterItems: [] }
      ]
    })

    expect(wrapper.vm.query.children[0].query.logicalOperator).toBe('AND')
    expect(wrapper.vm.query.children[0].query.children[0]).toEqual(
      expect.objectContaining({
        type: 'query-builder-rule',
        query: expect.objectContaining({
          operand: 'Department',
          operator: 'Contains',
          value: 'IT'
        })
      })
    )
  })

  it('setEditedFilter supports legacy FilterGroups format and OR condition', () => {
    const wrapper = createWrapper({
      FilterGroups: [
        { FilterItems: [] },
        {
          FilterItems: [{ fieldName: 'TimeZone', operator: '=', value: 'UTC' }]
        }
      ]
    })

    expect(wrapper.vm.query.children[0].query.logicalOperator).toBe('OR')
    expect(wrapper.vm.query.children[0].query.children[0].query.operator).toBe('=')
  })

  it('transformQuery recursively converts query-builder tree to table filter items', () => {
    const wrapper = createWrapper()
    const output = wrapper.vm.transformQuery(
      [
        {
          type: 'query-builder-group',
          query: {
            children: [
              {
                type: 'query-builder-rule',
                query: { operand: 'Department', operator: 'Contains', value: 'IT' }
              },
              {
                type: 'query-builder-rule',
                query: { operand: 'TimeZone', operator: '=', value: 'UTC' }
              }
            ]
          }
        }
      ],
      []
    )

    expect(output).toEqual([
      { Value: 'IT', FieldName: 'Department', Operator: 'Contains' },
      { Value: 'UTC', FieldName: 'TimeZone', Operator: '=' }
    ])
  })

  it('setViewUsersTableFilterParams sets operator flag and renames TimeZone to TimeZoneId', () => {
    const wrapper = createWrapper()
    wrapper.vm.query.children[0].query.logicalOperator = 'OR'
    wrapper.vm.query.children[0].query.children = [
      {
        type: 'query-builder-rule',
        query: { operand: 'TimeZone', operator: '=', value: 'UTC' }
      }
    ]

    const out = wrapper.vm.setViewUsersTableFilterParams()
    expect(out.operator).toBe(true)
    expect(out.items[0].FieldName).toBe('TimeZoneId')
  })

  it('getPayloadFilter delegates to getAxiosPayloadOfManuallyTable with hideFilter=true', () => {
    const wrapper = createWrapper()
    wrapper.vm.query.children[0].query.children = [
      {
        type: 'query-builder-rule',
        query: { operand: 'Department', operator: 'Contains', value: 'IT' }
      }
    ]

    const filter = wrapper.vm.getPayloadFilter()
    expect(getAxiosPayloadOfManuallyTable).toHaveBeenCalledWith(
      true,
      expect.objectContaining({
        items: [{ Value: 'IT', FieldName: 'Department', Operator: 'Contains' }]
      })
    )
    expect(filter).toEqual({ FilterGroups: [{}, {}] })
  })

  it('handleViewUsers prepares filter params and toggles dialog', () => {
    const wrapper = createWrapper()
    const setSpy = jest.spyOn(wrapper.vm, 'setViewUsersTableFilterParams')
    expect(wrapper.vm.showUsersDialog).toBe(false)

    wrapper.vm.handleViewUsers()

    expect(setSpy).toHaveBeenCalled()
    expect(wrapper.vm.showUsersDialog).toBe(true)
  })
})
