/**
 * helperFunctions mock yok — sıralama süresi orderBy eşlemesi.
 */
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('useDefaultTableFunctions sort duration (integration)', () => {
  it('sortChanged maps totalDuration prop to DurationMinutes orderBy', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const component = {
      axiosPayload: {
        pageNumber: 2,
        pageSize: 10,
        ascending: false,
        orderBy: 'CreateTime',
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }],
          SearchInputTextValue: ''
        }
      },
      serverSideProps: { pageNumber: 2, pageSize: 10 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    component.sortChanged({ order: 'ascending', prop: PROPERTY_STORE.TOTAL_DURATION })

    expect(component.axiosPayload.orderBy).toBe('DurationMinutes')
    expect(component.axiosPayload.ascending).toBe(true)
    expect(component.callForData).toHaveBeenCalled()
  })

  it('sortChanged maps TotalDuration (PascalCase) prop to DurationMinutes orderBy', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const component = {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        ascending: true,
        orderBy: 'CreateTime',
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }],
          SearchInputTextValue: ''
        }
      },
      serverSideProps: { pageNumber: 1, pageSize: 10 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    component.sortChanged({ order: 'descending', prop: 'TotalDuration' })

    expect(component.axiosPayload.orderBy).toBe('DurationMinutes')
    expect(component.axiosPayload.ascending).toBe(false)
  })

  it('sortChanged leaves unrelated orderBy unchanged', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const component = {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        ascending: true,
        orderBy: 'X',
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }],
          SearchInputTextValue: ''
        }
      },
      serverSideProps: { pageNumber: 1, pageSize: 10 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    component.sortChanged({ order: 'descending', prop: 'companyName' })

    expect(component.axiosPayload.orderBy).toBe('companyName')
    expect(component.axiosPayload.ascending).toBe(false)
  })
})
