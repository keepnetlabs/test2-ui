import { getDefaultAxiosPayload } from '@/utils/functions'

export const getAxiosPayloadOfManuallyTable = (hideFilter, viewUsersTableFilterParams) => {
  const axiosPayload = hideFilter
    ? getDefaultAxiosPayload({ pageSize: 5 })
    : getDefaultAxiosPayload({
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'Status',
                  Operator: 'Include',
                  Value: 'New,Exists,Error'
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      })
  if (viewUsersTableFilterParams?.items) {
    const index = Number(viewUsersTableFilterParams?.operator)
    axiosPayload.filter.FilterGroups[index].FilterItems = [
      ...axiosPayload.filter.FilterGroups[index].FilterItems,
      ...viewUsersTableFilterParams.items
    ]
  }
  return axiosPayload
}
